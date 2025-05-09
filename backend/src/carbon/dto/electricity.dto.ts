import { z } from 'zod';

export const ElectricityUnit = {
  KWH: 'kwh',
  MWH: 'mwh',
} as const;

export const electricitySchema = z.object({
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().optional(),
  electricity_value: z
    .number()
    .min(0, { message: 'Value must be greater than or equal to 0' }),
  electricity_unit: z.enum([ElectricityUnit.KWH, ElectricityUnit.MWH]),
});

export type ElectricityDto = z.infer<typeof electricitySchema>;
