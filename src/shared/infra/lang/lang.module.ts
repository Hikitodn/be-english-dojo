import { LangConfigService } from '@configs/lang/lang.service';
import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (langConfigService: LangConfigService) => ({
        fallbackLanguage: langConfigService.getFallbackLang(),
        fallbacks: {
          en: 'en',
        },
        loaderOptions: {
          path: path.join(__dirname, '../../../i18n/'),
          watch: true,
        },
      }),
      resolvers: [AcceptLanguageResolver],
      inject: [LangConfigService],
    }),
  ],
})
export class LangModule {}
