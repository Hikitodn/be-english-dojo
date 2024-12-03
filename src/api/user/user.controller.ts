import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '@common/decorator/current_user.decorator';
import { JwtPayload } from '@common/intefaces';
import { UserDTO } from './dto/user.dto';
import { CurrentUserDTO } from './dto/current_user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async current(@CurrentUser() payload: JwtPayload): Promise<CurrentUserDTO> {
    return await this.userService.current_user(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async find_one(@Param('id') id: number): Promise<UserDTO> {
    return await this.userService.find_one(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update_profile(
    @Param('id') id: number,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return await this.userService.update(id, file);
  }
}
