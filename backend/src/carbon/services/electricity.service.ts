import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import {
  CarbonEstimationResult,
  CarbonEmissionProvider,
  ElectricityEmissionInput,
} from '../types/carbon.types';
import { ElectricityDto } from '../dto/electricity.dto';

@Injectable()
export class ElectricityService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(
    data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    const input: ElectricityEmissionInput = {
      country: data.country,
      state: data.state,
      electricity_value: data.electricity_value,
      electricity_unit: data.electricity_unit,
    };
    return this.carbonEmissionProvider.estimateElectricityEmissions(input);
  }
}
