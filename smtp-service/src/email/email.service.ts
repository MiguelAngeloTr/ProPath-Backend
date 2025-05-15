import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TemplateEngineService } from './templates/template-engine.service';
import { SendEmailDto } from './dto/send-email.dto';
import { PasswordResetCodeDto } from './dto/password-reset-code.dto';
import { envs } from '../config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly templateEngine: TemplateEngineService,
  ) {
    // Initialize the nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: envs.SMTP_HOST,
      port: envs.SMTP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: envs.SMTP_USER,
        pass: envs.SMTP_PASS,
      },
    });
  }

  async sendPasswordEmail(dto: SendEmailDto): Promise<boolean> {
    try {
      const { email, name, password } = dto;
      
      // Generate HTML content from template
      const html = await this.templateEngine.compile(
        envs.EMAIL_TEMPLATE,
        { name, password }
      );

      // Set up email data
      const mailOptions = {
        from: envs.EMAIL_FROM,
        to: email,
        subject: envs.EMAIL_SUBJECT,
        html,
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${email}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendPasswordResetCode(dto: PasswordResetCodeDto): Promise<boolean> {
    try {
      const { email, name, code, expiresIn } = dto;
      
      // Generate HTML content from template
      const html = await this.templateEngine.compile(
        'password-reset-code-template.hbs',
        { name, code, expiresIn }
      );

      // Set up email data
      const mailOptions = {
        from: envs.EMAIL_FROM,
        to: email,
        subject: 'Código de verificación para restablecer tu contraseña ProPath',
        html,
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset code email sent to ${email}: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset code email: ${error.message}`);
      return false;
    }
  }
}