import {
  CarbonEstimationResult,
  VehicleMakesResponse,
  VehicleModelsResponse,
} from '../types';
import { ElectricityDto, VehicleDto, FlightDto } from '../dto';

export interface CarbonEmissionProvider {
  estimateElectricityEmissions(
    data: ElectricityDto,
  ): Promise<CarbonEstimationResult>;

  estimateVehicleEmissions(data: VehicleDto): Promise<CarbonEstimationResult>;

  estimateFlightEmissions(data: FlightDto): Promise<CarbonEstimationResult>;

  getVehicleMakes(): Promise<VehicleMakesResponse>;
  getVehicleModels(makeId: string): Promise<VehicleModelsResponse>;
}
