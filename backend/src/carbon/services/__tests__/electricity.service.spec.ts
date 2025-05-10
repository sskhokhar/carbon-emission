import { Test, TestingModule } from '@nestjs/testing';
import { ElectricityService } from '../electricity.service';
import { CARBON_API_PROVIDER } from '../../providers/tokens';
import { ElectricityDto } from '../../dto';

describe('ElectricityService', () => {
  let service: ElectricityService;

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
        ElectricityService,
        {
          provide: CARBON_API_PROVIDER,
          useValue: mockCarbonEmissionProvider,
        },
      ],
    }).compile();

    service = module.get<ElectricityService>(ElectricityService);

    jest.clearAllMocks();
  });

  describe('estimateEmissions', () => {
    // Arrange
    const mockElectricityDto: ElectricityDto = {
      country: 'us',
      state: 'ca',
      electricity_value: 100,
      electricity_unit: 'kwh',
    };

    const mockEmissionResult = {
      carbonGrams: 1000,
      carbonLbs: 2.2,
      carbonKg: 1,
      carbonMt: 0.001,
      estimatedAt: new Date('2023-01-01T00:00:00Z'),
      source: 'CarbonInterface',
      emissionType: 'electricity',
      originalInput: {
        country: 'us',
        state: 'ca',
        electricity_value: 100,
        electricity_unit: 'kwh',
      },
    };

    it('should call the provider with correct input', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateElectricityEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      await service.estimateEmissions(mockElectricityDto);

      // Assert
      expect(
        mockCarbonEmissionProvider.estimateElectricityEmissions,
      ).toHaveBeenCalledWith({
        country: 'us',
        state: 'ca',
        electricity_value: 100,
        electricity_unit: 'kwh',
      });
    });

    it('should return the result from the provider', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateElectricityEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      const result = await service.estimateEmissions(mockElectricityDto);

      // Assert
      expect(result).toEqual(mockEmissionResult);
    });

    it('should pass through errors from the provider', async () => {
      // Arrange
      const mockError = new Error('Provider error');
      mockCarbonEmissionProvider.estimateElectricityEmissions.mockRejectedValueOnce(
        mockError,
      );

      // Act & Assert
      await expect(
        service.estimateEmissions(mockElectricityDto),
      ).rejects.toThrow('Provider error');
    });
  });
});
