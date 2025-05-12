import { useMutation } from "@tanstack/react-query";

import type { CarbonEstimationResult,FlightEmissionRequest } from "@/lib/interfaces";
import { estimateFlightEmissions } from "@/lib/services";

export function useFlightEmissionEstimation() {
  return useMutation({
    mutationFn: async (data: FlightEmissionRequest): Promise<CarbonEstimationResult> => {
      return await estimateFlightEmissions(data);
    },
  });
}
