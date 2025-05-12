import { useMutation } from "@tanstack/react-query";
import { estimateElectricityEmissions } from "@/lib/services";
import type { ElectricityEmissionRequest, CarbonEstimationResult } from "@/lib/interfaces";

export function useElectricityEmissionEstimation() {
  return useMutation({
    mutationFn: async (data: ElectricityEmissionRequest): Promise<CarbonEstimationResult> => {
      return await estimateElectricityEmissions(data);
    },
  });
}
