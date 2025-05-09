import { Module } from '@nestjs/common';
import { CARBON_API_PROVIDER, CarbonApiProvider } from './providers';
import { ElectricityService, FlightService, VehicleService } from './services';
import { CarbonService } from './carbon.service';

@Module({
  controllers: [],
  providers: [
    CarbonService,
    ElectricityService,
    VehicleService,
    FlightService,
    {
      provide: CARBON_API_PROVIDER,
      useClass: CarbonApiProvider,
    },
  ],
  exports: [CarbonService],
})
export class CarbonModule {}
