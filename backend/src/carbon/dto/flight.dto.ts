import { z } from 'zod';

export const legSchema = z.object({
  departure_airport: z.string().min(3).max(4),
  destination_airport: z.string().min(3).max(4),
});

export const flightSchema = z.object({
  passengers: z
    .number()
    .int()
    .min(1, { message: 'At least one passenger is required' }),
  legs: z.array(legSchema).min(1, { message: 'At least one leg is required' }),
});

export type FlightDto = z.infer<typeof flightSchema>;
export type FlightLeg = z.infer<typeof legSchema>;
