import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthRepository } from './auth.repository';
import { MailModule } from '../mail/mail.module';
import { AuthStrategy } from './strategies/auth.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [UserModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy, RefreshStrategy, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
