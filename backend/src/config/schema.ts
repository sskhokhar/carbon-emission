import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).optional(),
  CARBON_INTERFACE_API: z.string(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
