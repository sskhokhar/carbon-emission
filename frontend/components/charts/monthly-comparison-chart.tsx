"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

interface MonthlyComparisonChartProps {
  data: any[];
  isLoading: boolean;
}

export function MonthlyComparisonChart({
  data,
  isLoading,
}: MonthlyComparisonChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Process data for monthly comparison
  const monthlyData = processMonthlyData(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <ChartContainer className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d4d4d8"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip
              content={({
                active,
                payload,
                label,
              }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="flex flex-col gap-2 mt-2">
                        {payload.map((entry: any, index: number) => (
                          <div
                            key={`tooltip-${index}`}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs font-medium">
                              {entry.name}:
                            </span>
                            <span className="text-xs font-bold">
                              {entry.value} kg CO₂
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium">Total:</span>
                          <span className="text-xs font-bold">
                            {payload
                              .reduce(
                                (sum: number, entry: any) =>
                                  sum + (entry.value as number),
                                0
                              )
                              .toFixed(2)}{" "}
                            kg CO₂
                          </span>
                        </div>
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
              formatter={(value) => (
                <span className="text-xs font-medium">{value}</span>
              )}
            />
            <Bar
              dataKey="electricity"
              name="Electricity"
              fill="#eab308"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="vehicle"
              name="Vehicle"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="flight"
              name="Flight"
              fill="#a855f7"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
}

function processMonthlyData(data: any[]) {
  const monthlyMap = new Map<
    string,
    { month: string; electricity: number; vehicle: number; flight: number }
  >();

  data.forEach((entry) => {
    const date = new Date(entry.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyMap.has(monthYear)) {
      monthlyMap.set(monthYear, {
        month: monthYear,
        electricity: 0,
        vehicle: 0,
        flight: 0,
      });
    }

    const monthData = monthlyMap.get(monthYear)!;
    monthData.electricity += entry.electricity;
    monthData.vehicle += entry.vehicle;
    monthData.flight += entry.flight;
  });

  return Array.from(monthlyMap.values());
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
        <div className="col-span-11 flex items-end space-x-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 flex items-end space-x-1">
              <Skeleton
                className="w-full"
                style={{ height: `${Math.random() * 70 + 30}%` }}
              />
              <Skeleton
                className="w-full"
                style={{ height: `${Math.random() * 70 + 30}%` }}
              />
              <Skeleton
                className="w-full"
                style={{ height: `${Math.random() * 70 + 30}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="h-8 flex justify-between mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-16" />
        ))}
      </div>
    </div>
  );
}
