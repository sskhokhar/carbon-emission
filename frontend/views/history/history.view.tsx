"use client";

import { useState } from "react";
import {
  useEstimationHistory,
  useEstimationById,
  useClearHistory,
} from "@/lib/hooks";
import { EmissionsHistoryTable } from "./components/emissions-history-table";
import { EmissionsSummaryChart } from "./components/emissions-summary-chart";
import { EmissionDetailsDialog } from "./components/emission-details-dialog";
import { ClearHistoryButton } from "./components/clear-history-button";

export default function HistoryView() {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    data: historyRecords = [],
    isLoading: isLoadingHistory,
    error: historyError,
  } = useEstimationHistory();

  const { data: selectedRecord } = useEstimationById(selectedRecordId);

  const { mutateAsync: clearHistory } = useClearHistory();

  const handleClearHistory = async () => {
    setSelectedRecordId(null);

    await clearHistory();
  };

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
            <ClearHistoryButton onClearHistory={handleClearHistory} />
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
