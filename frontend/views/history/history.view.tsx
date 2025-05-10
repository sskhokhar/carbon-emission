"use client";

import { useState } from "react";
import { useEstimationHistory, useEstimationById } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmissionsHistoryTable } from "./components/emissions-history-table";
import { EmissionsSummaryChart } from "./components/emissions-summary-chart";
import { EmissionDetailsDialog } from "./components/emission-details-dialog";
import { ClearHistoryButton } from "./components/clear-history-button";

export default function HistoryView() {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: historyRecords = [],
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useEstimationHistory();

  const { data: selectedRecord } = useEstimationById(selectedRecordId);

  // Function to clear all history
  const clearHistory = async () => {
    try {
      // Make DELETE request to the clear history endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/history/clear`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear history");
      }

      // Reset selected record
      setSelectedRecordId(null);

      // Reset cached data and refetch
      await queryClient.resetQueries({ queryKey: ["estimationHistory"] });
      await refetchHistory();

      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  };

  // Function to open details dialog
  const openDetailsDialog = (id: string) => {
    setSelectedRecordId(id);
    setDetailsOpen(true);
  };

  if (isLoadingHistory) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center">Loading history records...</p>
      </div>
    );
  }

  if (historyError) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-red-500">
          Error loading history records. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Estimation History</h1>

          {historyRecords.length > 0 && (
            <ClearHistoryButton onClearHistory={clearHistory} />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <EmissionsHistoryTable
            historyRecords={historyRecords}
            selectedRecordId={selectedRecordId}
            onViewDetails={openDetailsDialog}
          />

          <EmissionsSummaryChart historyRecords={historyRecords} />
        </div>
      </div>

      <EmissionDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        record={selectedRecord || undefined}
      />
    </div>
  );
}
