import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { FlightService } from '../services';
import { CarbonEstimationResult } from '../types';
import { flightSchema, FlightDto } from '../dto';
import { DatabaseService } from '../../database/database.service';

@Controller('flight')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Post('estimate')
  @UsePipes(new ZodValidationPipe(flightSchema))
  async estimateFlightEmissions(
    @Body() data: FlightDto,
  ): Promise<CarbonEstimationResult> {
    try {
      const result = await this.flightService.estimateEmissions(data);
      await this.databaseService.saveEstimation(result);

      return result;
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate flight emissions',
      );
    }
  }
}
