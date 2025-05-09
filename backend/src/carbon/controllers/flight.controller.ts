import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { FlightService } from '../services/flight.service';
import { CarbonEstimationResult } from '../types/carbon.types';
import { flightSchema, FlightDto } from '../dto/flight.dto';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post('estimate')
  @UsePipes(new ZodValidationPipe(flightSchema))
  async estimateFlightEmissions(
    @Body() data: FlightDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.flightService.estimateEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate flight emissions',
      );
    }
  }
}
