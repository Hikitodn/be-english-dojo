import { IGroqConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GroqConfigService implements IGroqConfig {
  constructor(private configService: ConfigService) {}

  public getGroqApiKey(): string {
    return this.configService.getOrThrow('groq.api_key');
  }
}
