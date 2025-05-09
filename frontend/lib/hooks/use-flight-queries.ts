import { useMutation } from "@tanstack/react-query";
import {
  estimateFlightEmissions,
  FlightEmissionRequest,
  CarbonEstimationResult,
} from "@/lib/api";

// Hook for estimating flight emissions
export function useFlightEmissionEstimation() {
  return useMutation({
    mutationFn: async (
      data: FlightEmissionRequest
    ): Promise<CarbonEstimationResult> => {
      return await estimateFlightEmissions(data);
    },
  });
}
