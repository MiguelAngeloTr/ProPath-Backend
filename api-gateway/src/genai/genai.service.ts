import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AIService {
  constructor(
    @Inject('AI-Service') private readonly client: ClientProxy
  ) {}

  async recommendPath(currentPath: any): Promise<any> {
    return firstValueFrom(
      this.client.send({ cmd: 'recommend_path' }, currentPath)
    );
  }
}