import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import { CarbonEstimationResult } from '../types/emission-types';
import { CarbonEmissionProvider } from '../providers/provider.interface';
import { FlightDto } from '../dto';

@Injectable()
export class FlightService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(data: FlightDto): Promise<CarbonEstimationResult> {
    return this.carbonEmissionProvider.estimateFlightEmissions(data);
  }
}
