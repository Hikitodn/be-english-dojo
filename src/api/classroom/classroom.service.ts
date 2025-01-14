import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClassroomRepository } from './classroom.repository';
import { PaginationOptionsDTO } from '@common/dto/pagination_options.dto';
import { PaginationDTO } from '@common/dto/pagination.dto';
import { PaginationMetaDTO } from '@common/dto/pagination_meta.dto';
import { plainToInstance } from 'class-transformer';
import {
  compare_date,
  current_datetime,
  format_currency,
  generate_uuid,
  get_day,
} from '@common/helper';
import { GroqConfigService } from '@configs/groq/groq.service';
import Groq from 'groq-sdk';
import officeParser from 'officeparser';
import { PaypalService } from '../payment/paypal/paypal.service';
import { CreateOrderDTO } from '../payment/dto/create_order.dto';
import {
  AttendanceStatus,
  PaymentMethod,
  PaymentStatus,
  StudentStatus,
} from '@common/types';
import {
  AttendanceDTO,
  ClassroomDetailDTO,
  ClassroomDTO,
  CreateClassroomDTO,
  OrderDTO,
  QuestionBankDTO,
  UpdateClassroomDTO,
} from './dto';
import { JwtPayload } from '@common/intefaces';
import { UserRepository } from '../user/user.repository';
import BulkStudentDTO from './dto/bulk_student.dto';

@Injectable()
export class ClassroomService {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly groqConfigService: GroqConfigService,
    private readonly paypalService: PaypalService,
    private readonly userRepository: UserRepository,
  ) {}

  async find_all(
    date: Date | undefined,
    pagination: PaginationOptionsDTO,
    payload: JwtPayload,
  ): Promise<PaginationDTO<ClassroomDTO>> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    const classrooms =
      await this.classroomRepository.find_all_classrooms_today_by_user_id(
        +payload.sub,
        date ? get_day(date) : undefined,
        pagination,
      );

    const meta = new PaginationMetaDTO({
      item_count: classrooms.length,
      paginationOptionsDTO: pagination,
    });

    const items = classrooms.map((data) => plainToInstance(ClassroomDTO, data));

    return new PaginationDTO(items, meta);
  }

  async find_one(id: number): Promise<ClassroomDetailDTO> {
    const classroom =
      await this.classroomRepository.find_one_classroom_by_id(id);

    if (!classroom) throw new NotFoundException();

    return plainToInstance(ClassroomDetailDTO, {
      ...classroom,
      tuition_fee: format_currency(classroom.tuition_fee, 'en-US', 'USD'),
    });
  }

  async create_tuition(body: CreateOrderDTO, payload: JwtPayload) {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    if (!Object.values(PaymentMethod).includes(body.method))
      throw new BadRequestException('ED-0201');

    const tuition = await this.classroomRepository.insert_tuition_history({
      amount: body.amount.toString(),
      method: body.method,
      note: body.note,
      status: PaymentStatus.PENDING,
      paid_date: current_datetime(),
      classroom_id: body.classroom_id,
      user_id: +payload.sub,
    });

    let order;
    switch (body.method) {
      case PaymentMethod.PAYPAL:
        order = await this.paypalService.create_order(tuition.id, body.amount);
        break;
    }

    if (order)
      this.classroomRepository.insert_payment({
        order_id: order.id,
        tuition_history_id: tuition.id,
      });

    return {
      tuition_id: tuition.id,
      order: order,
    };
  }

  async capture_order(order_id: string): Promise<void> {
    const tuition =
      await this.classroomRepository.find_tuition_history_by_order_id(order_id);

    if (!tuition) throw new BadRequestException('ED-0202');

    let order;
    switch (tuition.method) {
      case PaymentMethod.PAYPAL:
        order = await this.paypalService.capture_order(order_id);
        break;
    }

    Promise.all([
      this.classroomRepository.update_tuition_status(
        tuition.id,
        PaymentStatus.PAID,
      ),
      this.classroomRepository.update_payment_transaction(order_id, order),
    ]);
  }

  async cancel_order(order_id: string) {
    const tuition =
      await this.classroomRepository.find_tuition_history_by_order_id(order_id);

    if (!tuition) throw new BadRequestException('ED-0202');

    switch (tuition.method) {
      case PaymentMethod.PAYPAL:
        this.classroomRepository.update_tuition_status(
          tuition.id,
          PaymentStatus.FAILED,
        );
        break;
    }
  }

  async files_convert(files: Array<Express.Multer.File>) {
    try {
      const text = await officeParser.parseOfficeAsync(files[0].buffer);

      const client = new Groq({
        apiKey: this.groqConfigService.getGroqApiKey(),
      });

      const chat = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an english examination setter.',
          },
          {
            role: 'assistant',
            content: `
            [
              { 
                "question": "question title 1", 
                "answers": [
                  {
                    "text": "answer text 1", 
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 2", 
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 3", 
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 4", 
                    "is_correct": boolean
                  }
                ] 
              },
              {
                "question": "question title 2",
                "answers": [
                  {
                    "text": "answer text 1",
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 2",
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 3",
                    "is_correct": boolean
                  },
                  {
                    "text": "answer text 4",
                    "is_correct": boolean
                  }
                ]
              }
            ]`,
          },
          {
            role: 'user',
            content: `
          Read the content below. Give me the result. Your response must be in an array JSON Object and have four answers, where you generate only a specific type of valid JSON that must be formatted for an API backend recipient. Do not return any non-json text. 
            
            ${text}`,
          },
        ],
        model: 'llama3-70b-8192',
      });

      const data = chat.choices[0].message.content;

      if (data) {
        return JSON.parse(
          data
            .split('\n')
            .filter((value) => value)
            .join(''),
        );
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }

  async question_bank(body: QuestionBankDTO[]): Promise<void> {
    if (body) {
      body.forEach(async (data) => {
        const question = await this.classroomRepository.insert_question({
          text: data.question,
        });

        data.answers.forEach((value) =>
          this.classroomRepository.insert_question_option({
            text: value.text,
            is_correct: value.is_correct,
            question_id: question.id,
          }),
        );
      });
    }
  }

  async create(payload: JwtPayload, body: CreateClassroomDTO): Promise<void> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    if (compare_date(body.end_date, body.start_date) <= 0)
      throw new BadRequestException('ED-0204');

    const classroom = await this.classroomRepository.insert_classroom({
      name: body.name,
      code: generate_uuid(6),
      capacity: body.capacity,
      background_url: '',
      tuition_fee: body.tuition_fee,
      start_date: body.start_date,
      end_date: body.end_date,
    });

    this.classroomRepository.insert_user_classroom({
      teacher_id: +payload.sub,
      classroom_id: classroom.id,
    });

    if (body.schedules) {
      body.schedules.forEach((value) => {
        this.classroomRepository.insert_schedule({
          day_of_week: value.day_of_week,
          start_time: value.start_time,
          end_time: value.end_time,
          classroom_id: classroom.id,
        });
      });
    }
  }

  async update(id: number, body: UpdateClassroomDTO): Promise<void> {
    this.classroomRepository.update_classroom_by_id(id, {
      name: body.name,
      capacity: body.capacity,
      background_url: '',
      tuition_fee: body.tuition_fee,
      start_date: body.start_date,
      end_date: body.end_date,
    });
  }

  async delete(id: number): Promise<void> {
    this.classroomRepository.delete_classroom_by_id(id);
  }

  async check_attendance(attendance: AttendanceDTO[]): Promise<void> {
    if (attendance && attendance.length > 0) {
      attendance.forEach((value) => {
        if (value.status === AttendanceStatus.ABSENT) {
          this.classroomRepository.increase_absent_count(value.student_id);
        }

        this.classroomRepository.check_attendance({
          classroom_id: value.classroom_id,
          user_id: value.student_id,
          status: value.status,
        });
      });
    }
  }

  async add_student(payload: JwtPayload, email: string): Promise<void> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    const student = await this.userRepository.find_user_by_email(email);

    if (!student) throw new BadRequestException('ED-0200');

    if (
      await this.classroomRepository.is_student_in_teacher_list(
        student.id,
        +payload.sub,
      )
    )
      throw new BadRequestException('ED-0205');

    this.classroomRepository.insert_user_classroom({
      student_id: student.id,
      teacher_id: +payload.sub,
      status: StudentStatus.PENDING,
    });
  }

  async get_all_order(
    pagination: PaginationOptionsDTO,
    payload: JwtPayload,
  ): Promise<PaginationDTO<OrderDTO>> {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');

    const order = await this.classroomRepository.get_all_order_by_user_id(
      +payload.sub,
      pagination,
    );

    const meta = new PaginationMetaDTO({
      item_count: order.length,
      paginationOptionsDTO: pagination,
    });

    const items = order.map((data) => plainToInstance(OrderDTO, data));

    return new PaginationDTO(items, meta);
  }

  async add_student_to_classroom(
    payload: JwtPayload,
    classroom_id: number,
    bulk_student: BulkStudentDTO[],
  ) {
    if (!payload.sub) throw new UnauthorizedException('ED-0503');
    let teacher_id = payload.sub;

    if (bulk_student && bulk_student.length > 0) {
      bulk_student.forEach(async (value) => {
        if (
          await this.classroomRepository.is_student_in_classroom(
            value.id,
            +teacher_id,
            classroom_id,
          )
        ) {
          console.log('update');

          this.classroomRepository.update_user_classroom({
            status: value.status,
          });
        } else {
          console.log('add');

          this.classroomRepository.insert_user_classroom({
            student_id: value.id,
            teacher_id: +teacher_id,
            classroom_id: classroom_id,
          });
        }
      });
    }
  }

  async get_test(id: number) {
    return await this.classroomRepository.get_test(id);
  }

  //async submit() {
  //  return await this.classroomRepository.
  //}
}
