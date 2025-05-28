import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { PasswordResetCodeDto } from './dto/password-reset-code.dto';

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

  @MessagePattern('send_password_reset_code')
  async sendPasswordResetCode(@Payload() data: PasswordResetCodeDto): Promise<boolean> {
    try {
      return await this.emailService.sendPasswordResetCode(data);
    } catch (error) {
      console.error(`Error sending password reset code email: ${error.message}`);
      return false;
    }
  }
}