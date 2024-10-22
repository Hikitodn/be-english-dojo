import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigModule } from '@configs/jwt/jwt.module';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [JwtModule, UserModule, JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
