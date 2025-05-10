import { z } from 'zod';
import { carbonValuesSchema } from './emission-types';
import { legSchema } from '../dto/flight.dto';

const electricityAttributes = carbonValuesSchema.extend({
  country: z.string(),
  state: z.string().optional(),
  electricity_unit: z.string(),
  electricity_value: z.string(),
});
export const carbonInterfaceElectricityResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: electricityAttributes,
  }),
});
export type CarbonInterfaceElectricityResponse = z.infer<
  typeof carbonInterfaceElectricityResponseSchema
>;

const flightAttributes = carbonValuesSchema.extend({
  passengers: z.number(),
  legs: z.array(legSchema),
  distance_unit: z.string(),
  distance_value: z.number(),
});
export const carbonInterfaceFlightResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: flightAttributes,
  }),
});
export type CarbonInterfaceFlightResponse = z.infer<
  typeof carbonInterfaceFlightResponseSchema
>;

const vehicleAttributes = carbonValuesSchema.extend({
  distance_value: z.number(),
  distance_unit: z.string(),
  vehicle_make: z.string().optional(),
  vehicle_model: z.string().optional(),
  vehicle_year: z.number().optional(),
  vehicle_model_id: z.string().optional(),
});
export const carbonInterfaceVehicleResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    attributes: vehicleAttributes,
  }),
});
export type CarbonInterfaceVehicleResponse = z.infer<
  typeof carbonInterfaceVehicleResponseSchema
>;

export const carbonInterfaceResponseSchema = z.union([
  carbonInterfaceElectricityResponseSchema,
  carbonInterfaceFlightResponseSchema,
  carbonInterfaceVehicleResponseSchema,
]);
export type CarbonInterfaceResponse = z.infer<
  typeof carbonInterfaceResponseSchema
>;

export interface VehicleMakesResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      name: string;
    };
  }>;
}

export interface VehicleModelsResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      name: string;
      year: number;
      make_id: string;
    };
  }>;
}
