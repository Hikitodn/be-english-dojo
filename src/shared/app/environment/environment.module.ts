import { EnvironmentConfigModule } from '@configs/environment.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EnvironmentConfigModule],
})
export class EnvironmentModule {}
