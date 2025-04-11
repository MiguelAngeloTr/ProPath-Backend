import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class SmtpService {
  constructor(
    @Inject('SMTP-Service') private readonly smtpClient: ClientProxy
  ) {}

  async sendPasswordEmail(dto: SendEmailDto): Promise<boolean> {
    try {
      return firstValueFrom(
        this.smtpClient.emit('send_password_email', dto)
      );
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}