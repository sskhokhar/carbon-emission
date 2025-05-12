"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Calendar } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { EmissionsOverTimeChart } from "@/components/charts/emissions-over-time-chart";
import { EmissionsBySourceChart } from "@/components/charts/emissions-by-source-chart";
import { MonthlyComparisonChart } from "@/components/charts/monthly-comparison-chart";
import { EmissionsTrendChart } from "@/components/charts/emissions-trend-chart";

interface EmissionsAnalyticsProps {
  chartData: any[];
  isLoading: boolean;
  timeRange: string;
  dateRange: DateRange | undefined;
  setTimeRange: (value: string) => void;
  handleDateRangeChange: (range: DateRange | undefined) => void;
}

export function EmissionsAnalytics({
  chartData,
  isLoading,
  timeRange,
  dateRange,
  setTimeRange,
  handleDateRangeChange,
}: EmissionsAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Carbon Emissions Analytics</CardTitle>
            <CardDescription>Visualize and analyze your carbon footprint over time</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Select time range" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="by-source"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
            >
              By Source
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
            >
              Monthly Comparison
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
            >
              Trends
            </TabsTrigger>
          </TabsList>

          <div className="h-[500px]">
            <TabsContent value="overview" className="h-full mt-0">
              <EmissionsOverTimeChart data={chartData} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="by-source" className="h-full mt-0">
              <EmissionsBySourceChart data={chartData} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="monthly" className="h-full mt-0">
              <MonthlyComparisonChart data={chartData} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="trends" className="h-full mt-0">
              <EmissionsTrendChart data={chartData} isLoading={isLoading} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
