import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import {
  CarbonEstimationResult,
  CarbonEmissionProvider,
  VehicleEmissionInput,
} from '../types/carbon.types';
import { VehicleDto } from '../dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(data: VehicleDto): Promise<CarbonEstimationResult> {
    const input: VehicleEmissionInput = {
      distance_unit: data.distance_unit,
      distance_value: data.distance_value,
      vehicle_model_id: data.vehicle_model_id,
    };

    return this.carbonEmissionProvider.estimateVehicleEmissions(input);
  }
}
