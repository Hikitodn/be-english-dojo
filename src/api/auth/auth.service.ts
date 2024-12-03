import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtPayload } from '@common/intefaces';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@configs/jwt/jwt.service';
import { plainToInstance } from 'class-transformer';
import { BEARER, SALT_ROUNDS } from '@common/constants';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { MailService } from '../mail/mail.service';
import {
  convert_ms_to_sec,
  forward_current_datetime_by_milisecond,
} from '@common/helper';
import { AuthDTO, LoginDTO, RefreshDTO, RegisterDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  async login(loginDTO: LoginDTO): Promise<AuthDTO> {
    const user = await this.userRepository.find_user_by_email(loginDTO.email);

    if (!user) throw new UnauthorizedException('ED-0501');

    if (!user.is_verified) throw new UnauthorizedException('ED-0502');

    if (!(await bcrypt.compare(loginDTO.password, user.password)))
      throw new UnauthorizedException('ED-0501');

    const payload: JwtPayload = {
      sub: user.id.toString(),
      jti: await this.save_token(user.id),
    };

    const access_token = await this.generate_access_token(payload);
    const refresh_token = await this.generate_refresh_token(payload);

    return plainToInstance(AuthDTO, {
      ...access_token,
      ...refresh_token,
      token_type: BEARER,
    });
  }

  async register(registerDTO: RegisterDTO): Promise<void> {
    registerDTO.password = await bcrypt.hash(registerDTO.password, SALT_ROUNDS);

    const user = await this.userRepository.insert_user({
      email: registerDTO.email,
      password: registerDTO.password,
      first_name: registerDTO.first_name,
      last_name: registerDTO.last_name,
    });

    this.userRepository.insert_profile({
      phone_number: registerDTO.phone_number,
      date_of_birth: registerDTO.date_of_birth,
      gender: registerDTO.gender,
      user_id: user.id,
      social_links: [],
    });

    this.userRepository.insert_user_role({
      user_id: user.id,
      role_id: 1,
    });

    const mail_data = await this.mailService.generate_mail_data({
      sub: user.id.toString(),
      aud: user.email,
    });

    this.mailQueue.add('send-verify-mail', mail_data);
  }

  async save_token(user_id: number): Promise<string> {
    const { id } = await this.authRepository.insert_access_token({
      user_id: user_id,
      expired_at: forward_current_datetime_by_milisecond(
        this.jwtConfigService.getAccessTokenExpireTime(),
      ),
    });

    await this.authRepository.insert_refresh_token({
      user_id: user_id,
      access_token_id: id,
      expired_at: forward_current_datetime_by_milisecond(
        this.jwtConfigService.getRefreshTokenExpireTime(),
      ),
    });

    return id.toString();
  }

  async generate_access_token(payload: JwtPayload): Promise<object> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.getAccessTokenSecret(),
      expiresIn: convert_ms_to_sec(
        this.jwtConfigService.getAccessTokenExpireTime(),
      ),
    });

    return {
      access_token: access_token,
      access_token_expire_time: convert_ms_to_sec(
        this.jwtConfigService.getRefreshTokenExpireTime(),
      ),
    };
  }

  async generate_refresh_token(payload: JwtPayload): Promise<object> {
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.getRefreshTokenSecret(),
      expiresIn: convert_ms_to_sec(
        this.jwtConfigService.getRefreshTokenExpireTime(),
      ),
    });

    return {
      refresh_token: refresh_token,
      refresh_token_expire_time:
        this.jwtConfigService.getRefreshTokenExpireTime(),
    };
  }

  async refresh(payload: JwtPayload): Promise<RefreshDTO> {
    if (!payload.jti || !payload.sub)
      throw new UnauthorizedException('ED-0503');

    const refresh_token =
      await this.authRepository.find_refresh_token_by_access_token_id(
        +payload.jti,
      );

    if (!refresh_token) throw new UnauthorizedException('ED-0503');

    const access_token = await this.authRepository.insert_access_token({
      user_id: +payload.sub,
      expired_at: forward_current_datetime_by_milisecond(
        this.jwtConfigService.getAccessTokenExpireTime(),
      ),
    });

    await this.authRepository.update_refresh_token(refresh_token.id, {
      access_token_id: access_token.id,
    });

    const new_access_token = await this.generate_access_token({
      sub: payload.sub,
      jti: access_token.id.toString(),
    });

    return plainToInstance(RefreshDTO, {
      ...new_access_token,
      token_type: BEARER,
    });
  }

  async logout(payload: JwtPayload): Promise<void> {
    if (!payload.jti) throw new UnauthorizedException('ED-0503');

    await this.authRepository.delete_access_token_by_id(+payload.jti);
  }
}
