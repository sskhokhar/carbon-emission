import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CarbonService } from './carbon/carbon.service';
import { CarbonEstimationResult } from './carbon/types';
import {
  electricitySchema,
  ElectricityDto,
  vehicleSchema,
  VehicleDto,
  flightSchema,
  FlightDto,
} from './carbon/dto';

@Controller()
export class AppController {
  constructor(private readonly carbonService: CarbonService) {}

  @Post('estimate/electricity')
  @UsePipes(new ZodValidationPipe(electricitySchema))
  async estimateElectricityEmissions(
    @Body() data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.carbonService.estimateElectricityEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate electricity emissions',
      );
    }
  }

  @Post('estimate/vehicle')
  @UsePipes(new ZodValidationPipe(vehicleSchema))
  async estimateVehicleEmissions(
    @Body() data: VehicleDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.carbonService.estimateVehicleEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate vehicle emissions',
      );
    }
  }

  @Post('estimate/flight')
  @UsePipes(new ZodValidationPipe(flightSchema))
  async estimateFlightEmissions(
    @Body() data: FlightDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.carbonService.estimateFlightEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate flight emissions',
      );
    }
  }
}
