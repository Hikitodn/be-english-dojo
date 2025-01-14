import { JwtPayload } from '@common/intefaces';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { plainToInstance } from 'class-transformer';
import { CurrentUserDTO } from './dto/current_user.dto';
import { UserDTO } from './dto/user.dto';
import { format_datetime } from '@common/helper';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { UploadFileServiceS3 } from 'src/shared/infra/aws/aws.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly classroomRepository: ClassroomRepository,
    private readonly upload: UploadFileServiceS3,
  ) {}

  async current_user(payload: JwtPayload): Promise<CurrentUserDTO> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    const user = await this.userRepository.find_user_by_id(+payload.sub);

    const role = await this.userRepository.find_user_role(+payload.sub);

    if (!user) throw new UnauthorizedException('ED-0504');

    if (user.is_verified === false) throw new UnauthorizedException('ED-0502');

    return plainToInstance(CurrentUserDTO, { ...user, role: role?.name });
  }

  async find_one(id: number): Promise<UserDTO> {
    const profile = await this.userRepository.find_user_profile_by_user_id(id);

    if (!profile) throw new NotFoundException();

    const classrooms =
      await this.classroomRepository.find_user_classroom_name_by_user_id(id);

    return plainToInstance(UserDTO, {
      ...profile,
      date_of_birth: format_datetime(profile.date_of_birth),
      classrooms: classrooms.map(({ name }) => name),
    });
  }

  async update(id: number, file: Express.Multer.File) {
    console.log(
      await this.upload.uploadFileToPublicBucket('public', {
        file: file,
        file_name: file.originalname,
      }),
    );
  }
}
