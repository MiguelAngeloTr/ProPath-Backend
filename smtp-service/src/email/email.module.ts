import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TemplateEngineService } from './templates/template-engine.service';

@Module({
  providers: [EmailService, TemplateEngineService],
  controllers: [EmailController],
  exports: [EmailService]
})
export class EmailModule {}
