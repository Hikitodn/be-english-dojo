import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { PaginationDTO } from '@common/dto/pagination.dto';
import { StudentDTO } from './dto/student.dto';
import { PaginationMetaDTO } from '@common/dto/pagination_meta.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import { JwtPayload } from '@common/intefaces';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async find_all(
    payload: JwtPayload,
    pagination: PaginationOptionsDTO,
  ): Promise<PaginationDTO<StudentDTO>> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    const students = await this.studentRepository.find_all_student_by_user_id(
      +payload.sub,
      pagination,
    );

    const meta = new PaginationMetaDTO({
      item_count: students.length,
      paginationOptionsDTO: pagination,
    });

    const items = students.map((data) => plainToInstance(StudentDTO, data));

    return new PaginationDTO(items, meta);
  }
}
