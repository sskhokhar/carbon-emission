import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CarbonApiProvider } from '../carbon-api.provider';
import { EmissionTypeEnum } from '../../types/emission-types';
import { ElectricityUnit } from '../../dto/electricity.dto';
import { DistanceUnit } from '../../dto/vehicle.dto';

describe('CarbonApiProvider', () => {
  let provider: CarbonApiProvider;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key'),
  };

  const mockFetchResponse = {
    ok: true,
    json: jest.fn(),
    text: jest.fn(),
    status: 0,
  };

  global.fetch = jest.fn().mockResolvedValue(mockFetchResponse);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarbonApiProvider,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    provider = module.get<CarbonApiProvider>(CarbonApiProvider);

    jest.clearAllMocks();
  });

  describe('estimateElectricityEmissions', () => {
    const mockElectricityInput = {
      country: 'us',
      state: 'ca',
      electricity_value: 100,
      electricity_unit: ElectricityUnit.KWH,
    };

    const mockElectricityResponse = {
      data: {
        id: 'mock-id',
        type: 'electricity',
        attributes: {
          carbon_g: 1000,
          carbon_lb: 2.2,
          carbon_kg: 1,
          carbon_mt: 0.001,
          estimated_at: '2023-01-01T00:00:00Z',
          country: 'us',
          state: 'ca',
          electricity_unit: 'kwh',
          electricity_value: '100',
        },
      },
    };

    it('should call the API with correct parameters', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockElectricityResponse);

      // Act
      await provider.estimateElectricityEmissions(mockElectricityInput);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://www.carboninterface.com/api/v1/estimates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-api-key',
          },
          body: JSON.stringify({
            type: EmissionTypeEnum.ELECTRICITY,
            ...mockElectricityInput,
          }),
        },
      );
    });

    it('should transform the API response correctly', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockElectricityResponse);

      // Act
      const result =
        await provider.estimateElectricityEmissions(mockElectricityInput);

      // Assert
      expect(result).toEqual({
        carbonGrams: 1000,
        carbonLbs: 2.2,
        carbonKg: 1,
        carbonMt: 0.001,
        estimatedAt: new Date('2023-01-01T00:00:00Z'),
        emissionType: EmissionTypeEnum.ELECTRICITY,
        originalInput: mockElectricityInput,
      });
    });

    it('should throw an error if the API call fails', async () => {
      // Arrange
      mockFetchResponse.ok = false;
      mockFetchResponse.text.mockResolvedValueOnce('API Error');
      mockFetchResponse.status = 400;

      // Act & Assert
      await expect(
        provider.estimateElectricityEmissions(mockElectricityInput),
      ).rejects.toThrow('Carbon API error: 400 - API Error');

      // Cleanup
      mockFetchResponse.ok = true;
      mockFetchResponse.status = 0;
    });
  });

  describe('estimateVehicleEmissions', () => {
    // Arrange - common test data
    const mockVehicleInput = {
      distance_unit: DistanceUnit.MI,
      distance_value: 100,
      vehicle_model_id: 'mock-model-id',
    };

    const mockVehicleResponse = {
      data: {
        id: 'mock-id',
        type: 'vehicle',
        attributes: {
          carbon_g: 2000,
          carbon_lb: 4.4,
          carbon_kg: 2,
          carbon_mt: 0.002,
          estimated_at: '2023-01-01T00:00:00Z',
          distance_value: 100,
          distance_unit: 'mi',
          vehicle_make: 'Toyota',
          vehicle_model: 'Camry',
          vehicle_year: 2020,
          vehicle_model_id: 'mock-model-id',
        },
      },
    };

    it('should call the API with correct parameters', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockVehicleResponse);

      // Act
      await provider.estimateVehicleEmissions(mockVehicleInput);

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://www.carboninterface.com/api/v1/estimates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-api-key',
          },
          body: JSON.stringify({
            type: EmissionTypeEnum.VEHICLE,
            ...mockVehicleInput,
          }),
        },
      );
    });

    it('should transform the API response correctly', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockVehicleResponse);

      // Act
      const result = await provider.estimateVehicleEmissions(mockVehicleInput);

      // Assert
      expect(result).toEqual({
        carbonGrams: 2000,
        carbonLbs: 4.4,
        carbonKg: 2,
        carbonMt: 0.002,
        estimatedAt: new Date('2023-01-01T00:00:00Z'),
        emissionType: EmissionTypeEnum.VEHICLE,
        originalInput: mockVehicleInput,
      });
    });
  });

  describe('getVehicleMakes', () => {
    const mockMakesResponse = {
      data: [
        {
          id: 'make-1',
          type: 'vehicle_make',
          attributes: {
            name: 'Toyota',
          },
        },
      ],
    };

    it('should call the API with correct parameters', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockMakesResponse);

      // Act
      await provider.getVehicleMakes();

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://www.carboninterface.com/api/v1/vehicle_makes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-api-key',
          },
        },
      );
    });

    it('should return the API response', async () => {
      // Arrange
      mockFetchResponse.json.mockResolvedValueOnce(mockMakesResponse);

      // Act
      const result = await provider.getVehicleMakes();

      // Assert
      expect(result).toEqual(mockMakesResponse);
    });
  });
});
