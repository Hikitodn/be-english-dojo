import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginDTO } from './dto/login.dto';
import { JwtPayload } from '@common/intefaces';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@configs/jwt/jwt.service';
import { TokenDTO } from './dto/token.dto';
import { plainToInstance } from 'class-transformer';
import { BEARER } from '@common/constants';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async login(loginDTO: LoginDTO): Promise<TokenDTO> {
    const user = await this.userRepository.find_user_by_email(loginDTO.email);

    if (!user) throw new UnauthorizedException();

    if (!(await bcrypt.compare(loginDTO.password, user.password)))
      throw new UnauthorizedException();

    this.save_token(user.id);

    return await this.generate_token(user.id);
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
    const access_token_expire_time = new Date(
      Date.now() + this.jwtConfigService.getAccessTokenExpireTime() * 1000,
    );

    const refresh_token_expire_time = new Date(
      Date.now() + this.jwtConfigService.getRefreshTokenExpireTime() * 1000,
    );

    const access_token = await this.authRepository.insert_access_token(
      user_id,
      access_token_expire_time,
    );

    this.authRepository.insert_refresh_token(
      user_id,
      access_token.id,
      refresh_token_expire_time,
    );
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
