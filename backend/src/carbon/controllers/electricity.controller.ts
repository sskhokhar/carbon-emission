import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ElectricityService } from '../services/electricity.service';
import { CarbonEstimationResult } from '../types/emission-types';
import { electricitySchema, ElectricityDto } from '../dto/electricity.dto';
import { DatabaseService } from '../../database/database.service';

@Controller('electricity')
export class ElectricityController {
  constructor(
    private readonly electricityService: ElectricityService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('estimate')
  @UsePipes(new ZodValidationPipe(electricitySchema))
  async estimateElectricityEmissions(
    @Body() data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    try {
      const result = await this.electricityService.estimateEmissions(data);

      // Save the estimation to the database
      await this.databaseService.saveEstimation(result);

      return result;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate electricity emissions',
      );
    }
  }
}
