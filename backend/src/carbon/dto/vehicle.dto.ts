import { z } from 'zod';

export const DistanceUnit = {
  MI: 'mi',
  KM: 'km',
} as const;

export const vehicleSchema = z.object({
  distance_value: z
    .number()
    .min(0, { message: 'Distance must be greater than or equal to 0' }),
  distance_unit: z.enum([DistanceUnit.MI, DistanceUnit.KM]),
  vehicle_model_id: z.string().optional(),
});

export type VehicleDto = z.infer<typeof vehicleSchema>;
