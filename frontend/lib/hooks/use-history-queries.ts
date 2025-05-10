import { useQuery } from "@tanstack/react-query";
import { getEstimationHistory, getEstimationById } from "@/lib/api";

export function useEstimationHistory() {
  return useQuery({
    queryKey: ["estimationHistory"],
    queryFn: async () => {
      return await getEstimationHistory();
    },
  });
}

export function useEstimationById(id: string | null) {
  return useQuery({
    queryKey: ["estimation", id],
    queryFn: async () => {
      if (!id) return null;
      return await getEstimationById(id);
    },
    enabled: !!id,
  });
}
