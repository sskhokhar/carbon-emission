import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import { CarbonEstimationResult, FlightEmissionInput } from '../types';
import { CarbonEmissionProvider } from '../providers/provider.interface';
import { FlightDto } from '../dto';

@Injectable()
export class FlightService {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
  ) {}

  async estimateEmissions(data: FlightDto): Promise<CarbonEstimationResult> {
    const input: FlightEmissionInput = {
      passengers: data.passengers,
      legs: data.legs,
    };

    return this.carbonEmissionProvider.estimateFlightEmissions(input);
  }
}
