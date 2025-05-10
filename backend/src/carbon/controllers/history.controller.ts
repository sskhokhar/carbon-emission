import {
  Controller,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  DatabaseService,
  EstimationRecord,
} from '../../database/database.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getAllEstimations(): Promise<EstimationRecord[]> {
    return this.databaseService.getAllEstimations();
  }

  @Get(':id')
  async getEstimationById(@Param('id') id: string): Promise<EstimationRecord> {
    const record = await this.databaseService.getEstimationById(id);

    if (!record) {
      throw new NotFoundException(`Estimation with ID ${id} not found`);
    }

    return record;
  }

  @Delete('clear')
  async clearHistory(): Promise<{ success: boolean; message: string }> {
    await this.databaseService.clearAllEstimations();
    return {
      success: true,
      message: 'All estimation records cleared successfully',
    };
  }
}
