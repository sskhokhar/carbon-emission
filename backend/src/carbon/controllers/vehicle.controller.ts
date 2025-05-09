import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CARBON_API_PROVIDER } from '../providers/tokens';
import {
  CarbonEmissionProvider,
  VehicleMakesResponse,
  VehicleModelsResponse,
  CarbonEstimationResult,
} from '../types/carbon.types';
import { vehicleSchema, VehicleDto } from '../dto/vehicle.dto';
import { VehicleService } from '../services/vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(
    @Inject(CARBON_API_PROVIDER)
    private readonly carbonEmissionProvider: CarbonEmissionProvider,
    private readonly vehicleService: VehicleService,
  ) {}

  /**
   * Fetch all available vehicle makes
   */
  @Get('makes')
  async getVehicleMakes(): Promise<VehicleMakesResponse> {
    try {
      return await this.carbonEmissionProvider.getVehicleMakes();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch vehicle makes',
      );
    }
  }

  /**
   * Fetch all models for a specific vehicle make
   */
  @Get('makes/:makeId/models')
  async getVehicleModels(
    @Param('makeId') makeId: string,
  ): Promise<VehicleModelsResponse> {
    try {
      return await this.carbonEmissionProvider.getVehicleModels(makeId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch vehicle models',
      );
    }
  }

  /**
   * Estimate carbon emissions for a vehicle
   */
  @Post('estimate')
  @UsePipes(new ZodValidationPipe(vehicleSchema))
  async estimateVehicleEmissions(
    @Body() data: VehicleDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.vehicleService.estimateEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate vehicle emissions',
      );
    }
  }
}
