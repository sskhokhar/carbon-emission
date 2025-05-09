import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ElectricityService } from '../services/electricity.service';
import { CarbonEstimationResult } from '../types/carbon.types';
import { electricitySchema, ElectricityDto } from '../dto/electricity.dto';

@Controller('electricity')
export class ElectricityController {
  constructor(private readonly electricityService: ElectricityService) {}

  @Post('estimate')
  @UsePipes(new ZodValidationPipe(electricitySchema))
  async estimateElectricityEmissions(
    @Body() data: ElectricityDto,
  ): Promise<CarbonEstimationResult> {
    try {
      return await this.electricityService.estimateEmissions(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Failed to estimate electricity emissions',
      );
    }
  }
}
