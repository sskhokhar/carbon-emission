"use client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

interface EmissionsOverTimeChartProps {
  data: any[];
  isLoading: boolean;
}

export function EmissionsOverTimeChart({ data, isLoading }: EmissionsOverTimeChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <ChartContainer className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
                        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium">Total:</span>
                          <span className="text-xs font-bold">
                            {payload
                              .reduce((sum: number, entry: any) => sum + (entry.value as number), 0)
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
              formatter={(value) => <span className="text-xs font-medium">{value}</span>}
            />
            <defs>
              <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorVehicle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorFlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="electricity"
              name="Electricity"
              stackId="1"
              stroke="#eab308"
              fill="url(#colorElectricity)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="vehicle"
              name="Vehicle"
              stackId="1"
              stroke="#3b82f6"
              fill="url(#colorVehicle)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="flight"
              name="Flight"
              stackId="1"
              stroke="#a855f7"
              fill="url(#colorFlight)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
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
                <Skeleton className="w-full" style={{ height: `${Math.random() * 70 + 30}%` }} />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
