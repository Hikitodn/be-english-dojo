import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  url: process.env.APP_URL,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
}));
