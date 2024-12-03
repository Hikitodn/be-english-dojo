import { registerAs } from '@nestjs/config';

export default registerAs('paypal', () => ({
  client_id: process.env.PAYPAL_CLIENT_ID,
  secret_key: process.env.PAYPAL_SECRET_KEY,
  url: process.env.PAYPAL_URL,
}));
