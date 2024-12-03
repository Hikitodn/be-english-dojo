import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { MailConfigService } from '@configs/mail/mail.service';
import { JwtPayload } from '@common/intefaces';
import { UserRepository } from '../user/user.repository';
import { convert_ms_to_sec } from '@common/helper';

@Injectable()
export class MailService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailConfigService: MailConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async generate_mail_data(payload: JwtPayload): Promise<ISendMailOptions> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.mailConfigService.getMailSecret(),
      expiresIn: convert_ms_to_sec(this.mailConfigService.getMailExpireTime()),
    });

    return {
      to: payload.aud,
      subject: 'Account Verification',
      context: {
        link_verification:
          this.mailConfigService.getMailURL() + `?token=${token}`,
      },
      template: 'mail-verification',
    };
  }

  async verify(token: string): Promise<void> {
    let sub;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.mailConfigService.getMailSecret(),
      });

      sub = payload.sub;
    } catch (error) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.find_user_by_id(sub);

    if (!user) throw new UnauthorizedException();

    if (user.is_verified) throw new BadRequestException();

    this.userRepository.update_user_mail_verify(sub);
  }
}
