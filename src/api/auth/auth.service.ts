import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginDTO } from './dto/login.dto';
import { JwtPayload } from '@common/intefaces';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@configs/jwt/jwt.service';
import { TokenDTO } from './dto/token.dto';
import { plainToInstance } from 'class-transformer';
import { BEARER, SALT_ROUNDS } from '@common/constants';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../user/dto/create_user.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { MailService } from '../mail/mail.service';
import { current_datetime, forward_current_datetime } from '@common/helper';

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

  async login(loginDTO: LoginDTO): Promise<TokenDTO> {
    const user = await this.userRepository.find_user_by_email(loginDTO.email);

    if (!user) throw new UnauthorizedException();

    if (!(await bcrypt.compare(loginDTO.password, user.password)))
      throw new UnauthorizedException();

    this.save_token(user.id);

    return await this.generate_token(user.id);
  }

  async register(createUserDTO: CreateUserDTO): Promise<void> {
    if (await this.userRepository.find_user_by_email(createUserDTO.email))
      throw new UnprocessableEntityException();

    const hash_password = await bcrypt.hash(
      createUserDTO.password,
      SALT_ROUNDS,
    );

    createUserDTO.password = hash_password;

    const user = await this.userRepository.insert_user({
      email: createUserDTO.email,
      password: createUserDTO.password,
      first_name: createUserDTO.first_name,
      last_name: createUserDTO.last_name,
      updated_at: current_datetime(),
    });

    this.userRepository.insert_profile({
      phone_number: createUserDTO.phone_number,
      date_of_birth: createUserDTO.date_of_birth,
      gender: createUserDTO.gender,
      user_id: user.id,
      updated_at: current_datetime(),
    });

    const data = await this.mailService.generate_mail_data({
      sub: user.id.toString(),
      aud: user.email,
    });

    await this.mailQueue.add('send-verify-mail', data);
  }

  async generate_token(user_id: number): Promise<TokenDTO> {
    const payload: JwtPayload = {
      sub: user_id.toString(),
    };

    const access_token = await this.generate_access_token(payload);
    const refresh_token = await this.generate_refresh_token(payload);

    return plainToInstance(TokenDTO, {
      ...access_token,
      ...refresh_token,
      token_type: BEARER,
    });
  }

  async save_token(user_id: number): Promise<void> {
    const access_token_expire_time = forward_current_datetime(
      this.jwtConfigService.getAccessTokenExpireTime(),
    );

    const refresh_token_expire_time = forward_current_datetime(
      this.jwtConfigService.getRefreshTokenExpireTime(),
    );

    const access_token = await this.authRepository.insert_access_token({
      user_id: user_id,
      expired_at: access_token_expire_time,
    });

    this.authRepository.insert_refresh_token({
      user_id: user_id,
      access_token_id: access_token.id,
      expired_at: refresh_token_expire_time,
    });
  }

  async generate_access_token(payload: JwtPayload): Promise<object> {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.getAccessTokenSecret(),
      expiresIn: this.jwtConfigService.getAccessTokenExpireTime(),
    });

    return {
      access_token: access_token,
      access_token_expire_time:
        this.jwtConfigService.getAccessTokenExpireTime(),
    };
  }

  async generate_refresh_token(payload: JwtPayload): Promise<object> {
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfigService.getRefreshTokenSecret(),
      expiresIn: this.jwtConfigService.getRefreshTokenExpireTime(),
    });

    return {
      refresh_token: refresh_token,
      refresh_token_expire_time:
        this.jwtConfigService.getRefreshTokenExpireTime(),
    };
  }
}
