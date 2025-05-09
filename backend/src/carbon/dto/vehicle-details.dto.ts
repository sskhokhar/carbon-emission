import { z } from 'zod';

// DTO for vehicle make response
export const vehicleMakeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type VehicleMakeDto = z.infer<typeof vehicleMakeSchema>;

// DTO for vehicle model response
export const vehicleModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number(),
  make_id: z.string(),
});

export type VehicleModelDto = z.infer<typeof vehicleModelSchema>;
