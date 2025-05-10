import { z } from 'zod';

export const electricityEmissionInputSchema = z.object({
  country: z.string(),
  state: z.string().optional(),
  electricity_value: z.number(),
  electricity_unit: z.string(),
});
export type ElectricityEmissionInput = z.infer<
  typeof electricityEmissionInputSchema
>;

export const vehicleEmissionInputSchema = z.object({
  distance_unit: z.string(),
  distance_value: z.number(),
  vehicle_model_id: z.string().optional(),
});
export type VehicleEmissionInput = z.infer<typeof vehicleEmissionInputSchema>;

export const flightLegSchema = z.object({
  departure_airport: z.string(),
  destination_airport: z.string(),
});

export const flightEmissionInputSchema = z.object({
  passengers: z.number(),
  legs: z.array(flightLegSchema),
});
export type FlightEmissionInput = z.infer<typeof flightEmissionInputSchema>;
