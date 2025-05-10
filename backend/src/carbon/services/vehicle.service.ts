import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import { CarbonEstimationResult } from '../types/emission-types';
import { CarbonEmissionProvider } from '../providers/provider.interface';
import { VehicleDto } from '../dto';

@Injectable()
export class VehicleService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(data: VehicleDto): Promise<CarbonEstimationResult> {
    return this.carbonEmissionProvider.estimateVehicleEmissions(data);
  }
}
