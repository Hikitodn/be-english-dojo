import { registerAs } from '@nestjs/config';

export default registerAs('groq', () => ({
  api_key: process.env.GROQ_API_KEY,
}));
