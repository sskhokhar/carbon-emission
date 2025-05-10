import { z } from 'zod';

export const EmissionTypeEnum = {
  ELECTRICITY: 'electricity',
  VEHICLE: 'vehicle',
  FLIGHT: 'flight',
} as const;

export type EmissionType = keyof typeof EmissionTypeEnum;

export const emissionTypeSchema = z.enum([
  EmissionTypeEnum.ELECTRICITY,
  EmissionTypeEnum.VEHICLE,
  EmissionTypeEnum.FLIGHT,
]);

export const carbonValuesSchema = z.object({
  carbon_g: z.number(),
  carbon_lb: z.number(),
  carbon_kg: z.number(),
  carbon_mt: z.number(),
  estimated_at: z.string(),
});

export const carbonEstimationResultSchema = z.object({
  carbonGrams: z.number(),
  carbonLbs: z.number(),
  carbonKg: z.number(),
  carbonMt: z.number(),
  estimatedAt: z.date(),
  emissionType: emissionTypeSchema,
  originalInput: z.record(z.string(), z.unknown()).optional(),
});

export type CarbonEstimationResult = z.infer<
  typeof carbonEstimationResultSchema
>;

export interface EmissionEstimator<T> {
  estimate(input: T): Promise<CarbonEstimationResult>;
}
