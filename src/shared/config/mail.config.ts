import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
  url: process.env.MAIL_URL,
  secret: process.env.MAIL_SECRET,
  expire_time: process.env.MAIL_EXPIRE_TIME,
}));
