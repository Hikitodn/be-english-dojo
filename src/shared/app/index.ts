import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AppConfigService } from '@configs/app/app.service';
import { I18nMiddleware } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(I18nMiddleware);
  app.use(helmet());
  app.setGlobalPrefix('api');

  const port =
    process.env.NODE_ENV === 'production'
      ? process.env.PORT
      : app.get(AppConfigService).getAppPort();

  await app.listen(port || 3000);
}
bootstrap();
