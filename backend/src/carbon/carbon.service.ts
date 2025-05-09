import { Injectable } from '@nestjs/common';
import { ElectricityService, VehicleService, FlightService } from './services';
import { CarbonEstimationResult } from './types';
import { ElectricityDto, VehicleDto, FlightDto } from './dto';

@Injectable()
export class CarbonService {
  constructor(
    private readonly electricityService: ElectricityService,
    private readonly vehicleService: VehicleService,
    private readonly flightService: FlightService,
  ) {}

  async estimateElectricityEmissions(
    data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    return this.electricityService.estimateEmissions(data);
  }

  async estimateVehicleEmissions(
    data: VehicleDto,
  ): Promise<CarbonEstimationResult> {
    return this.vehicleService.estimateEmissions(data);
  }

  async estimateFlightEmissions(
    data: FlightDto,
  ): Promise<CarbonEstimationResult> {
    return this.flightService.estimateEmissions(data);
  }
}
