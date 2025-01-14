import { registerAs } from '@nestjs/config';

export default registerAs('lang', () => ({
  fallback_language: process.env.FALLBACK_LANGUAGE,
}));
