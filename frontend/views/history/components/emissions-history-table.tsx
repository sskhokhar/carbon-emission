"use client";

import { format } from "date-fns";
import { Clock, BarChart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EstimationRecord } from "@/lib/api";

interface EmissionsHistoryTableProps {
  historyRecords: EstimationRecord[];
  selectedRecordId: string | null;
  onViewDetails: (id: string) => void;
}

export function EmissionsHistoryTable({
  historyRecords,
  selectedRecordId,
  onViewDetails,
}: EmissionsHistoryTableProps) {
  return (
    <Card className="w-full md:w-2/3">
      <CardHeader>
        <CardTitle>Recent Estimations</CardTitle>
        <CardDescription>
          View your recent carbon emission calculations
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
                      onClick={() => onViewDetails(record.id)}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
