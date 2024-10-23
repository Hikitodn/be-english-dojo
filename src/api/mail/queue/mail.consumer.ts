import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail-queue')
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'send-verify-mail': {
        const { data } = job;

        try {
          await this.mailerService.sendMail(data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}
