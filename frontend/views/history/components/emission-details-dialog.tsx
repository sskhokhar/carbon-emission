"use client";

import { format } from "date-fns";
import { BarChart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { EstimationRecord } from "@/lib/api";

interface EmissionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: EstimationRecord | undefined;
}

export function EmissionDetailsDialog({
  open,
  onOpenChange,
  record,
}: EmissionDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Emission Details</DialogTitle>
          <DialogDescription>
            Detailed information about this calculation
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {!record ? (
          <p className="text-center py-4">Loading details...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg capitalize flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-green-600" />
                {record.estimation.emissionType} Emission
              </h3>
              <p className="text-sm text-muted-foreground">
                Calculated on {format(new Date(record.timestamp), "PPP 'at' p")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded bg-muted">
                <p className="text-xs text-muted-foreground">CO₂ (g)</p>
                <p className="font-medium">{record.estimation.carbonGrams}</p>
              </div>
              <div className="p-3 rounded bg-muted">
                <p className="text-xs text-muted-foreground">CO₂ (kg)</p>
                <p className="font-medium">{record.estimation.carbonKg}</p>
              </div>
              <div className="p-3 rounded bg-muted">
                <p className="text-xs text-muted-foreground">CO₂ (lb)</p>
                <p className="font-medium">{record.estimation.carbonLbs}</p>
              </div>
              <div className="p-3 rounded bg-muted">
                <p className="text-xs text-muted-foreground">CO₂ (mt)</p>
                <p className="font-medium">{record.estimation.carbonMt}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
