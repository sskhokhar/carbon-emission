"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { generateMockData } from "@/lib/mock-data";

import { EmissionsAnalytics } from "./components/emissions-analysis";
import { ReductionTips } from "./components/reduction-tips";
import { ImpactSummary } from "./components/impact-summary";
import { EmissionBreakdown } from "./components/emission-breakdown";

export function InsightsView() {
  const router = useRouter();
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
          >
            <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Carbon Footprint Insights
          </h1>
        </div>
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calculator</span>
          </Button>
        </Link>
      </motion.div>

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
    </div>
  );
}
