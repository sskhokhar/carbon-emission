import { Test, TestingModule } from '@nestjs/testing';
import { FlightService } from '../flight.service';
import { CARBON_API_PROVIDER } from '../../providers/tokens';
import { FlightDto } from '../../dto';

describe('FlightService', () => {
  let service: FlightService;

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
        FlightService,
        {
          provide: CARBON_API_PROVIDER,
          useValue: mockCarbonEmissionProvider,
        },
      ],
    }).compile();

    service = module.get<FlightService>(FlightService);

    jest.clearAllMocks();
  });

  describe('estimateEmissions', () => {
    // Arrange - common test data
    const mockFlightDto: FlightDto = {
      passengers: 2,
      legs: [
        {
          departure_airport: 'SFO',
          destination_airport: 'LAX',
        },
        {
          departure_airport: 'LAX',
          destination_airport: 'JFK',
        },
      ],
    };

    const mockEmissionResult = {
      carbonGrams: 3000,
      carbonLbs: 6.6,
      carbonKg: 3,
      carbonMt: 0.003,
      estimatedAt: new Date('2023-01-01T00:00:00Z'),
      source: 'CarbonInterface',
      emissionType: 'flight',
      originalInput: {
        passengers: 2,
        legs: [
          {
            departure_airport: 'SFO',
            destination_airport: 'LAX',
          },
          {
            departure_airport: 'LAX',
            destination_airport: 'JFK',
          },
        ],
      },
    };

    it('should call the provider with correct input', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateFlightEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      await service.estimateEmissions(mockFlightDto);

      // Assert
      expect(
        mockCarbonEmissionProvider.estimateFlightEmissions,
      ).toHaveBeenCalledWith({
        passengers: 2,
        legs: [
          {
            departure_airport: 'SFO',
            destination_airport: 'LAX',
          },
          {
            departure_airport: 'LAX',
            destination_airport: 'JFK',
          },
        ],
      });
    });

    it('should return the result from the provider', async () => {
      // Arrange
      mockCarbonEmissionProvider.estimateFlightEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      const result = await service.estimateEmissions(mockFlightDto);

      // Assert
      expect(result).toEqual(mockEmissionResult);
    });

    it('should pass through errors from the provider', async () => {
      // Arrange
      const mockError = new Error('Provider error');
      mockCarbonEmissionProvider.estimateFlightEmissions.mockRejectedValueOnce(
        mockError,
      );

      // Act & Assert
      await expect(service.estimateEmissions(mockFlightDto)).rejects.toThrow(
        'Provider error',
      );
    });

    it('should correctly handle a flight with a single leg', async () => {
      // Arrange
      const singleLegDto: FlightDto = {
        passengers: 1,
        legs: [
          {
            departure_airport: 'LHR',
            destination_airport: 'CDG',
          },
        ],
      };

      mockCarbonEmissionProvider.estimateFlightEmissions.mockResolvedValueOnce(
        mockEmissionResult,
      );

      // Act
      await service.estimateEmissions(singleLegDto);

      // Assert
      expect(
        mockCarbonEmissionProvider.estimateFlightEmissions,
      ).toHaveBeenCalledWith({
        passengers: 1,
        legs: [
          {
            departure_airport: 'LHR',
            destination_airport: 'CDG',
          },
        ],
      });
    });
  });
});
