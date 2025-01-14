import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '@common/decorator/current_user.decorator';
import { JwtPayload } from '@common/intefaces';
import { Public } from '@common/decorator/public.decorator';
import { RefreshGuard } from '@common/guard/refresh.guard';
import { AuthDTO, LoginDTO, RefreshDTO, RegisterDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<AuthDTO> {
    return await this.authService.login(loginDTO);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    return await this.authService.register(registerDTO);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@CurrentUser() payload: JwtPayload): Promise<RefreshDTO> {
    return await this.authService.refresh(payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@CurrentUser() payload: JwtPayload): Promise<void> {
    return await this.authService.logout(payload);
  }
}
