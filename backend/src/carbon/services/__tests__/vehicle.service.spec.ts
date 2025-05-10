import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from '../vehicle.service';
import { CARBON_API_PROVIDER } from '../../providers/tokens';
import { VehicleDto } from '../../dto';

describe('VehicleService', () => {
  let service: VehicleService;

  const mockCarbonEmissionProvider = {
    estimateElectricityEmissions: jest.fn(),
    estimateVehicleEmissions: jest.fn(),
    estimateFlightEmissions: jest.fn(),
    getVehicleMakes: jest.fn(),
    getVehicleModels: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: CARBON_API_PROVIDER,
          useValue: mockCarbonEmissionProvider,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);

    jest.clearAllMocks();
  });

  describe('estimateEmissions', () => {
    // Arrange - common test data
    const mockVehicleDto: VehicleDto = {
      distance_value: 100,
      distance_unit: 'mi',
      vehicle_model_id: 'mock-model-id',
    };

    const mockEmissionResult = {
      carbonGrams: 2000,
      carbonLbs: 4.4,
      carbonKg: 2,
      carbonMt: 0.002,
      estimatedAt: new Date('2023-01-01T00:00:00Z'),
      source: 'CarbonInterface',
      emissionType: 'vehicle',
      originalInput: {
        distance_value: 100,
        distance_unit: 'mi',
        vehicle_model_id: 'mock-model-id',
      },
    };

    it('should call the provider with correct input', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateVehicleEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      await service.estimateEmissions(mockVehicleDto);

      // Assert
      expect(
        mockCarbonEmissionProvider.estimateVehicleEmissions,
      ).toHaveBeenCalledWith({
        distance_value: 100,
        distance_unit: 'mi',
        vehicle_model_id: 'mock-model-id',
      });
    });

    it('should return the result from the provider', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateVehicleEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      const result = await service.estimateEmissions(mockVehicleDto);

      // Assert
      expect(result).toEqual(mockEmissionResult);
    });

    it('should pass through errors from the provider', async () => {
      // Arrange
      const mockError = new Error('Provider error');
      mockCarbonEmissionProvider.estimateVehicleEmissions.mockRejectedValueOnce(
        mockError,
      );

      // Act & Assert
      await expect(service.estimateEmissions(mockVehicleDto)).rejects.toThrow(
        'Provider error',
      );
    });

    it('should handle missing vehicle_model_id', async () => {
      // Arrange
      const dtoWithoutModelId: VehicleDto = {
        distance_value: 100,
        distance_unit: 'km',
      };

      const expectedInput = {
        distance_value: 100,
        distance_unit: 'km',
        vehicle_model_id: undefined,
      };

      mockCarbonEmissionProvider.estimateVehicleEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      await service.estimateEmissions(dtoWithoutModelId);

      // Assert
      expect(
        mockCarbonEmissionProvider.estimateVehicleEmissions,
      ).toHaveBeenCalledWith(expectedInput);
    });
  });
});
