import { useMutation,useQuery } from "@tanstack/react-query";

import type { CarbonEstimationResult,VehicleEmissionRequest } from "@/lib/interfaces";
import { estimateVehicleEmissions,getVehicleMakes, getVehicleModels } from "@/lib/services";

export function useVehicleMakes() {
  return useQuery({
    queryKey: ["vehicleMakes"],
    queryFn: async () => {
      const response = await getVehicleMakes();

      return response.sort((a, b) => a.data.attributes.name.localeCompare(b.data.attributes.name));
    },
  });
}

export function useVehicleModels(makeId: string | null) {
  return useQuery({
    queryKey: ["vehicleModels", makeId],
    queryFn: async () => {
      if (!makeId) return [];
      return await getVehicleModels(makeId);
    },
    enabled: !!makeId,
  });
}

export function useVehicleEmissionEstimation() {
  return useMutation({
    mutationFn: async (data: VehicleEmissionRequest): Promise<CarbonEstimationResult> => {
      return await estimateVehicleEmissions(data);
    },
  });
}
