import { Module } from '@nestjs/common';
import { ApiModule } from 'src/api/api.module';
import { InfraModule } from '../infra/infra.module';
import { ErrorModule } from '../error/error.module';

@Module({
  imports: [InfraModule, ApiModule, ErrorModule],
})
export class AppModule {}
