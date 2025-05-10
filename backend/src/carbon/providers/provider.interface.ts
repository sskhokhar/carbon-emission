import { CarbonEstimationResult } from '../types/emission-types';
import {
  ElectricityEmissionInput,
  VehicleEmissionInput,
  FlightEmissionInput,
  VehicleMakesResponse,
  VehicleModelsResponse,
} from '../types';

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

  getVehicleMakes(): Promise<VehicleMakesResponse>;
  getVehicleModels(makeId: string): Promise<VehicleModelsResponse>;
}
