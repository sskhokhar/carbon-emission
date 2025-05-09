// src/config/validation.ts
import { configSchema } from './schema';

export const validate = (config: Record<string, unknown>) => {
  const parsed = configSchema.safeParse(config);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};
