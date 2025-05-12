"use client";

import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface EmissionsTrendChartProps {
  data: any[];
  isLoading: boolean;
}

export function EmissionsTrendChart({ data, isLoading }: EmissionsTrendChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Process data for trend analysis
  const trendData = processTrendData(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <ChartContainer className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" strokeOpacity={0.4} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip
              content={({ active, payload, label }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium text-sm">
                        {new Date(label).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex flex-col gap-2 mt-2">
                        {payload.map((entry: any, index: number) => (
                          <div key={`tooltip-${index}`} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs font-medium">{entry.name}:</span>
                            <span className="text-xs font-bold">{entry.value} kg CO₂</span>
                          </div>
                        ))}
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => <span className="text-xs font-medium">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Emissions"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="trend"
              name="Trend Line"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="average"
              name="Average"
              stroke="#6b7280"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
}

function processTrendData(data: any[]) {
  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate total emissions for each day
  const processedData = sortedData.map((entry) => {
    const total = entry.electricity + entry.vehicle + entry.flight;
    return {
      date: entry.date,
      total,
    };
  });

  // Calculate average
  const average = processedData.reduce((sum, entry) => sum + entry.total, 0) / processedData.length;

  // Simple linear regression for trend line
  const n = processedData.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = processedData.map((entry) => entry.total);

  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Add trend line and average to data
  return processedData.map((entry, i) => ({
    ...entry,
    trend: intercept + slope * i,
    average,
  }));
}

function ChartSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center mb-6">
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="flex-1 grid grid-cols-12 gap-2">
        <div className="col-span-1 flex flex-col justify-between">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="col-span-11 flex flex-col justify-between">
          <div className="h-full flex items-end space-x-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <Skeleton
                  className="h-2 w-full"
                  style={{ marginBottom: `${Math.random() * 70 + 30}%` }}
                />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
