import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('send_password_email')
  async sendPasswordEmail(@Payload() data: SendEmailDto): Promise<boolean> {
    try {
      return await this.emailService.sendPasswordEmail(data);
    } catch (error) {
      console.error(`Error sending password email: ${error.message}`);
      return false;
    }
  }
}