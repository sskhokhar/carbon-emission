import { Test, TestingModule } from '@nestjs/testing';
import {
  EmissionTypeEnum,
  CarbonEstimationResult,
  ElectricityEmissionInput,
  VehicleEmissionInput,
  FlightEmissionInput,
  VehicleMakesResponse,
  VehicleModelsResponse,
} from '../../types';
import { CarbonEmissionProvider } from '../provider.interface';

class MockCarbonProvider implements CarbonEmissionProvider {
  private readonly PROVIDER_NAME = 'MockProvider';

  public calls = {
    electricity: 0,
    vehicle: 0,
    flight: 0,
    makes: 0,
    models: 0,
  };

  estimateElectricityEmissions(
    input: ElectricityEmissionInput,
  ): Promise<CarbonEstimationResult> {
    this.calls.electricity++;
    return Promise.resolve(
      this.createMockResponse(EmissionTypeEnum.ELECTRICITY, input),
    );
  }

  estimateVehicleEmissions(
    input: VehicleEmissionInput,
  ): Promise<CarbonEstimationResult> {
    this.calls.vehicle++;
    return Promise.resolve(
      this.createMockResponse(EmissionTypeEnum.VEHICLE, input),
    );
  }

  estimateFlightEmissions(
    input: FlightEmissionInput,
  ): Promise<CarbonEstimationResult> {
    this.calls.flight++;
    return Promise.resolve(
      this.createMockResponse(EmissionTypeEnum.FLIGHT, input),
    );
  }

  getVehicleMakes(): Promise<VehicleMakesResponse> {
    this.calls.makes++;
    return Promise.resolve({
      data: [
        {
          id: 'mock-make-1',
          type: 'vehicle_make',
          attributes: {
            name: 'MockBrand',
          },
        },
      ],
    });
  }

  getVehicleModels(makeId: string): Promise<VehicleModelsResponse> {
    this.calls.models++;
    return Promise.resolve({
      data: [
        {
          id: 'mock-model-1',
          type: 'vehicle_model',
          attributes: {
            name: 'MockModel',
            year: 2023,
            make_id: makeId,
          },
        },
      ],
    });
  }

  private createMockResponse(
    emissionType: (typeof EmissionTypeEnum)[keyof typeof EmissionTypeEnum],
    originalInput: Record<string, unknown>,
  ): CarbonEstimationResult {
    const carbonValue =
      emissionType === EmissionTypeEnum.ELECTRICITY
        ? 1000
        : emissionType === EmissionTypeEnum.VEHICLE
          ? 2000
          : 3000;

    return {
      carbonGrams: carbonValue,
      carbonLbs: carbonValue * 0.0022,
      carbonKg: carbonValue / 1000,
      carbonMt: carbonValue / 1000000,
      estimatedAt: new Date(),
      emissionType,
      originalInput,
    };
  }
}

describe('MockCarbonProvider (Adapter Pattern)', () => {
  let provider: MockCarbonProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MOCK_CARBON_PROVIDER',
          useClass: MockCarbonProvider,
        },
      ],
    }).compile();

    provider = module.get<MockCarbonProvider>('MOCK_CARBON_PROVIDER');
  });

  it('should implement all methods required by the CarbonEmissionProvider interface', () => {
    expect(typeof provider.estimateElectricityEmissions).toBe('function');
    expect(typeof provider.estimateVehicleEmissions).toBe('function');
    expect(typeof provider.estimateFlightEmissions).toBe('function');
    expect(typeof provider.getVehicleMakes).toBe('function');
    expect(typeof provider.getVehicleModels).toBe('function');
  });

  describe('estimateElectricityEmissions', () => {
    it('should return a standardized response structure', async () => {
      // Arrange
      const input: ElectricityEmissionInput = {
        country: 'us',
        electricity_value: 100,
        electricity_unit: 'kwh',
      };

      // Act
      const result = await provider.estimateElectricityEmissions(input);

      // Assert - test adapter pattern's uniform response structure
      expect(result).toHaveProperty('carbonGrams');
      expect(result).toHaveProperty('carbonLbs');
      expect(result).toHaveProperty('carbonKg');
      expect(result).toHaveProperty('carbonMt');
      expect(result).toHaveProperty('estimatedAt');
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('emissionType');
      expect(result).toHaveProperty('originalInput');

      // Assert - test specific values
      expect(result.emissionType).toBe(EmissionTypeEnum.ELECTRICITY);
      expect(result.originalInput).toEqual(input);
      expect(provider.calls.electricity).toBe(1);
    });
  });

  describe('estimateVehicleEmissions', () => {
    it('should return a standardized response structure', async () => {
      // Arrange
      const input: VehicleEmissionInput = {
        distance_value: 100,
        distance_unit: 'mi',
      };

      // Act
      const result = await provider.estimateVehicleEmissions(input);

      // Assert
      expect(result.carbonGrams).toBe(2000);
      expect(result.emissionType).toBe(EmissionTypeEnum.VEHICLE);
      expect(provider.calls.vehicle).toBe(1);
    });
  });

  describe('estimateFlightEmissions', () => {
    it('should return a standardized response structure', async () => {
      // Arrange
      const input: FlightEmissionInput = {
        passengers: 2,
        legs: [
          {
            departure_airport: 'SFO',
            destination_airport: 'LAX',
          },
        ],
      };

      // Act
      const result = await provider.estimateFlightEmissions(input);

      // Assert
      expect(result.carbonGrams).toBe(3000);
      expect(result.emissionType).toBe(EmissionTypeEnum.FLIGHT);
      expect(provider.calls.flight).toBe(1);
    });
  });

  describe('getVehicleMakes', () => {
    it('should return mock vehicle makes', async () => {
      // Act
      const result = await provider.getVehicleMakes();

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].attributes.name).toBe('MockBrand');
      expect(provider.calls.makes).toBe(1);
    });
  });

  describe('getVehicleModels', () => {
    it('should return mock vehicle models for a make', async () => {
      // Arrange
      const makeId = 'test-make-id';

      // Act
      const result = await provider.getVehicleModels(makeId);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.data[0].attributes.make_id).toBe(makeId);
      expect(provider.calls.models).toBe(1);
    });
  });
});
