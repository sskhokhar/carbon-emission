"use client";

import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { generateMockData } from "@/lib/mock-data";

import { EmissionsAnalytics } from "./components/emissions-analysis";
import { ReductionTips } from "./components/reduction-tips";
import { ImpactSummary } from "./components/impact-summary";
import { EmissionBreakdown } from "./components/emission-breakdown";

export function InsightsView() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6m");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -180),
    to: new Date(),
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockData(timeRange);
      setChartData(data);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <EmissionsAnalytics
          chartData={chartData}
          isLoading={isLoading}
          timeRange={timeRange}
          dateRange={dateRange}
          setTimeRange={setTimeRange}
          handleDateRangeChange={handleDateRangeChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReductionTips />
          <ImpactSummary />
          <EmissionBreakdown />
        </div>
      </div>
    </>
  );
}
