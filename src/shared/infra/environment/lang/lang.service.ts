import { ILangConfig } from '@configs/infra.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangConfigService implements ILangConfig {
  constructor(private readonly configService: ConfigService) {}

  public getFallbackLang(): string {
    return this.configService.getOrThrow('lang.fallback_language');
  }
}
