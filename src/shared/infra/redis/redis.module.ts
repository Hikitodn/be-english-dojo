import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RedisConfigModule } from '@configs/redis/redis.module';
import { RedisConfigService } from '@configs/redis/redis.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisConfigModule],
      inject: [RedisConfigService],
      useFactory: async (redisConfigService: RedisConfigService) => ({
        connection: {
          host: redisConfigService.getRedisHost(),
          port: redisConfigService.getRedisPort(),
        },
      }),
    }),
  ],
})
export class RedisModule {}
