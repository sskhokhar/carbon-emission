import { useMutation } from "@tanstack/react-query";
import { estimateFlightEmissions } from "@/lib/services";
import type { FlightEmissionRequest, CarbonEstimationResult } from "@/lib/interfaces";

export function useFlightEmissionEstimation() {
  return useMutation({
    mutationFn: async (data: FlightEmissionRequest): Promise<CarbonEstimationResult> => {
      return await estimateFlightEmissions(data);
    },
  });
}
