"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, BarChart, Trash } from "lucide-react";
import { useEstimationHistory, useEstimationById } from "@/lib/hooks";
import { EstimationRecord } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function HistoryView() {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: historyRecords = [],
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useEstimationHistory();

  const { data: selectedRecord, isLoading: isLoadingRecord } =
    useEstimationById(selectedRecordId);

  // Function to clear all history by invalidating the query cache
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

      // Close the dialog
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
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
            <AlertDialog
              open={confirmDialogOpen}
              onOpenChange={setConfirmDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear History</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to clear all calculation history? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory}>
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* History Table */}
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <CardTitle>Recent Estimations</CardTitle>
              <CardDescription>
                View and select your recent carbon emission estimations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyRecords.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No estimations found. Try calculating some emissions first.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>CO₂ (kg)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords.map((record: EstimationRecord) => (
                      <TableRow
                        key={record.id}
                        className={
                          selectedRecordId === record.id
                            ? "bg-muted hover:bg-muted"
                            : undefined
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(record.timestamp), "PPP 'at' p")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {record.estimation.emissionType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BarChart className="h-4 w-4 text-green-600" />
                            {record.estimation.carbonKg.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecordId(record.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Details Panel */}
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle>Estimation Details</CardTitle>
              <CardDescription>
                Detailed information about the selected estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedRecord ? (
                <p className="text-center py-4 text-muted-foreground">
                  Select an estimation from the table to view details
                </p>
              ) : isLoadingRecord ? (
                <p className="text-center py-4">Loading details...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2 capitalize">
                      {selectedRecord.estimation.emissionType} Emission
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Calculated on{" "}
                      {format(new Date(selectedRecord.timestamp), "PPP 'at' p")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-muted">
                      <p className="text-xs text-muted-foreground">CO₂ (g)</p>
                      <p className="font-medium">
                        {selectedRecord.estimation.carbonGrams.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted">
                      <p className="text-xs text-muted-foreground">CO₂ (kg)</p>
                      <p className="font-medium">
                        {selectedRecord.estimation.carbonKg.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted">
                      <p className="text-xs text-muted-foreground">CO₂ (lb)</p>
                      <p className="font-medium">
                        {selectedRecord.estimation.carbonLbs.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted">
                      <p className="text-xs text-muted-foreground">CO₂ (mt)</p>
                      <p className="font-medium">
                        {selectedRecord.estimation.carbonMt.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Source</p>
                    <p className="text-sm">
                      {selectedRecord.estimation.source}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
