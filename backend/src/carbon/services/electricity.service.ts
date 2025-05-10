import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import { CarbonEstimationResult } from '../types/emission-types';
import { CarbonEmissionProvider } from '../providers/provider.interface';
import { ElectricityDto } from '../dto';

@Injectable()
export class ElectricityService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(
    data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    return this.carbonEmissionProvider.estimateElectricityEmissions(data);
  }
}
