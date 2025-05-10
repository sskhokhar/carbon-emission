import { useQuery } from "@tanstack/react-query";
import { getEstimationHistory, getEstimationById } from "@/lib/api";

// Hook for fetching all estimation history
export function useEstimationHistory() {
  return useQuery({
    queryKey: ["estimationHistory"],
    queryFn: async () => {
      return await getEstimationHistory();
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // Consider data stale after 30 seconds
  });
}

// Hook for fetching a specific estimation by ID
export function useEstimationById(id: string | null) {
  return useQuery({
    queryKey: ["estimation", id],
    queryFn: async () => {
      if (!id) return null;
      return await getEstimationById(id);
    },
    enabled: !!id, // Only run if id is provided
  });
}
