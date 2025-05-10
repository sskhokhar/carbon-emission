"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonutChart } from "@/components/ui/donut-chart";
import { EstimationRecord } from "@/lib/api";

interface EmissionsSummaryChartProps {
  historyRecords: EstimationRecord[];
}

export function EmissionsSummaryChart({
  historyRecords,
}: EmissionsSummaryChartProps) {
  // Prepare data for donut chart
  const chartData = useMemo(() => {
    if (!historyRecords.length) return [];

    // Group emissions by type
    const emissionsByType: Record<string, number> = {};

    historyRecords.forEach((record: EstimationRecord) => {
      const type = record.estimation.emissionType;
      const value = record.estimation.carbonKg;

      if (!emissionsByType[type]) {
        emissionsByType[type] = 0;
      }

      emissionsByType[type] += value;
    });

    // Map to chart format
    const colorMap: Record<string, string> = {
      vehicle: "#8884d8",
      electricity: "#82ca9d",
      flight: "#ff7300",
    };

    return Object.entries(emissionsByType).map(([type, value]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value,
      color: colorMap[type] || "#999999",
    }));
  }, [historyRecords]);

  // Calculate total emissions
  const totalEmissions = useMemo(() => {
    return chartData.reduce((total, item) => total + item.value, 0);
  }, [chartData]);

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Emissions Summary</CardTitle>
        <CardDescription>
          Breakdown of your carbon footprint by source
        </CardDescription>
      </CardHeader>
      <CardContent>
        {historyRecords.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            No data to visualize. Try calculating some emissions first.
          </p>
        ) : (
          <div className="space-y-4">
            <DonutChart data={chartData} />

            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="text-2xl font-bold">
                  {totalEmissions.toFixed(2)} kg CO₂
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
