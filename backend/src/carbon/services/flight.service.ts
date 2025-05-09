import { Injectable, Inject } from '@nestjs/common';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import {
  CarbonEstimationResult,
  CarbonEmissionProvider,
  FlightEmissionInput,
} from '../types/carbon.types';
import { FlightDto } from '../dto/flight.dto';

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
