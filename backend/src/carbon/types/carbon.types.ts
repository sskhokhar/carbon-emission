import { z } from 'zod';

/**
 * Emission Type Enum & Schema
 */
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

/**
 * Common Result Schema
 */
const carbonValuesSchema = z.object({
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

  source: z.string(),
  emissionType: emissionTypeSchema,

  originalInput: z.record(z.string(), z.unknown()).optional(),
});

export type CarbonEstimationResult = z.infer<
  typeof carbonEstimationResultSchema
>;

/**
 * Input Schemas
 */
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

/**
 * Interface Definitions
 */
export interface EmissionEstimator<T> {
  estimate(input: T): Promise<CarbonEstimationResult>;
}

export interface CarbonEmissionProvider {
  estimateElectricityEmissions(
    data: ElectricityEmissionInput,
  ): Promise<CarbonEstimationResult>;
  estimateVehicleEmissions(
    data: VehicleEmissionInput,
  ): Promise<CarbonEstimationResult>;
  estimateFlightEmissions(
    data: FlightEmissionInput,
  ): Promise<CarbonEstimationResult>;
}

/**
 * Carbon Interface API Response Schemas
 */
// Electricity
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

// Flight
const flightAttributes = carbonValuesSchema.extend({
  passengers: z.number(),
  legs: z.array(flightLegSchema),
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

// Vehicle
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
