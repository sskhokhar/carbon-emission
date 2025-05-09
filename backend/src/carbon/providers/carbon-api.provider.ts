import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CarbonInterfaceElectricityResponse,
  CarbonInterfaceVehicleResponse,
  CarbonInterfaceFlightResponse,
  CarbonEstimationResult,
  CarbonEmissionProvider,
  ElectricityEmissionInput,
  VehicleEmissionInput,
  FlightEmissionInput,
  EmissionTypeEnum,
  VehicleMakesResponse,
  VehicleModelsResponse,
} from '../types/carbon.types';

@Injectable()
export class CarbonApiProvider implements CarbonEmissionProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.carboninterface.com/api/v1';
  private readonly PROVIDER_NAME = 'CarbonInterface';

  constructor(private configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('CARBON_INTERFACE_API', {
        infer: true,
      }) ?? '';
  }

  async estimateElectricityEmissions(
    input: ElectricityEmissionInput,
  ): Promise<CarbonEstimationResult> {
    const response =
      await this.makeApiRequest<CarbonInterfaceElectricityResponse>(
        '/estimates',
        { type: EmissionTypeEnum.ELECTRICITY, ...input },
      );

    return this.transformResponse(
      response.data.attributes,
      EmissionTypeEnum.ELECTRICITY,
      input,
    );
  }

  async estimateVehicleEmissions(
    input: VehicleEmissionInput,
  ): Promise<CarbonEstimationResult> {
    const response = await this.makeApiRequest<CarbonInterfaceVehicleResponse>(
      '/estimates',
      { type: EmissionTypeEnum.VEHICLE, ...input },
    );

    return this.transformResponse(
      response.data.attributes,
      EmissionTypeEnum.VEHICLE,
      input,
    );
  }

  async estimateFlightEmissions(
    input: FlightEmissionInput,
  ): Promise<CarbonEstimationResult> {
    const response = await this.makeApiRequest<CarbonInterfaceFlightResponse>(
      '/estimates',
      { type: EmissionTypeEnum.FLIGHT, ...input },
    );

    return this.transformResponse(
      response.data.attributes,
      EmissionTypeEnum.FLIGHT,
      input,
    );
  }

  // New methods for vehicle data
  async getVehicleMakes(): Promise<VehicleMakesResponse> {
    return this.makeGetRequest<VehicleMakesResponse>('/vehicle_makes');
  }

  async getVehicleModels(makeId: string): Promise<VehicleModelsResponse> {
    return this.makeGetRequest<VehicleModelsResponse>(
      `/vehicle_makes/${makeId}/vehicle_models`,
    );
  }

  private async makeApiRequest<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Carbon API error: ${res.status} - ${message}`);
    }

    return res.json() as Promise<T>;
  }

  private async makeGetRequest<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!res.ok) {
      const message = await res.text();
      throw new Error(`Carbon API error: ${res.status} - ${message}`);
    }

    return res.json() as Promise<T>;
  }

  private transformResponse(
    attributes: {
      carbon_g: number;
      carbon_lb: number;
      carbon_kg: number;
      carbon_mt: number;
      estimated_at: string;
    },
    emissionType: (typeof EmissionTypeEnum)[keyof typeof EmissionTypeEnum],
    originalInput: Record<string, unknown>,
  ): CarbonEstimationResult {
    const { carbon_g, carbon_lb, carbon_kg, carbon_mt, estimated_at } =
      attributes;
    return {
      carbonGrams: carbon_g,
      carbonLbs: carbon_lb,
      carbonKg: carbon_kg,
      carbonMt: carbon_mt,
      estimatedAt: new Date(estimated_at),
      source: this.PROVIDER_NAME,
      emissionType,
      originalInput,
    };
  }
}
