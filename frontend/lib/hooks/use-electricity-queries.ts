import { useMutation } from "@tanstack/react-query";

import type { CarbonEstimationResult,ElectricityEmissionRequest } from "@/lib/interfaces";
import { estimateElectricityEmissions } from "@/lib/services";

export function useElectricityEmissionEstimation() {
  return useMutation({
    mutationFn: async (data: ElectricityEmissionRequest): Promise<CarbonEstimationResult> => {
      return await estimateElectricityEmissions(data);
    },
  });
}
