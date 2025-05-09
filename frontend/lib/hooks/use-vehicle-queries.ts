import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getVehicleMakes,
  getVehicleModels,
  estimateVehicleEmissions,
  VehicleEmissionRequest,
  CarbonEstimationResult,
} from "@/lib/api";

// Hook for fetching vehicle makes
export function useVehicleMakes() {
  return useQuery({
    queryKey: ["vehicleMakes"],
    queryFn: async () => {
      const response = await getVehicleMakes();
      // Sort makes alphabetically
      return response.sort((a, b) =>
        a.data.attributes.name.localeCompare(b.data.attributes.name)
      );
    },
  });
}

// Hook for fetching vehicle models by make ID
export function useVehicleModels(makeId: string | null) {
  return useQuery({
    queryKey: ["vehicleModels", makeId],
    queryFn: async () => {
      if (!makeId) return [];
      return await getVehicleModels(makeId);
    },
    enabled: !!makeId, // Only run if makeId is provided
  });
}

// Hook for estimating vehicle emissions
export function useVehicleEmissionEstimation() {
  return useMutation({
    mutationFn: async (
      data: VehicleEmissionRequest
    ): Promise<CarbonEstimationResult> => {
      return await estimateVehicleEmissions(data);
    },
  });
}
