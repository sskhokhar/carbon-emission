import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEstimationHistory,
  getEstimationById,
  clearEstimationHistory,
} from "@/lib/api";
import { toast } from "sonner";

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

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearEstimationHistory,
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ["estimationHistory"] });
      toast.success("History cleared successfully");
    },
    onError: (error) => {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    },
  });
}
