import { useMutation } from "@tanstack/react-query";
import {
  estimateElectricityEmissions,
  ElectricityEmissionRequest,
  CarbonEstimationResult,
} from "@/lib/api";

export function useElectricityEmissionEstimation() {
  return useMutation({
    mutationFn: async (
      data: ElectricityEmissionRequest
    ): Promise<CarbonEstimationResult> => {
      return await estimateElectricityEmissions(data);
    },
  });
}
