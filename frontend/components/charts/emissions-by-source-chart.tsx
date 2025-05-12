"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface EmissionsBySourceChartProps {
  data: any[];
  isLoading: boolean;
}

export function EmissionsBySourceChart({ data, isLoading }: EmissionsBySourceChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Process data for pie chart
  const pieData = [
    {
      name: "Electricity",
      value: data.reduce((sum, entry) => sum + entry.electricity, 0),
      color: "#eab308",
    },
    {
      name: "Vehicle",
      value: data.reduce((sum, entry) => sum + entry.vehicle, 0),
      color: "#3b82f6",
    },
    {
      name: "Flight",
      value: data.reduce((sum, entry) => sum + entry.flight, 0),
      color: "#a855f7",
    },
  ];

  const totalEmissions = pieData.reduce((sum, entry) => sum + entry.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <ChartContainer className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              innerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              animationEasing="ease-out"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    className="text-xs font-medium"
                    fill="currentColor"
                  >
                    {`${pieData[index].name} (${(percent * 100).toFixed(0)}%)`}
                  </text>
                );
              }}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  strokeWidth={activeIndex === index ? 2 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium text-sm">{data.name}</div>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center justify-between gap-8">
                          <span className="text-xs">Total Emissions:</span>
                          <span className="text-xs font-bold">{data.value.toFixed(2)} kg CO₂</span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                          <span className="text-xs">Percentage:</span>
                          <span className="text-xs font-bold">
                            {((data.value / totalEmissions) * 100).toFixed(1)}%
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
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs font-medium">
                  {value}: {entry.payload.value.toFixed(2)} kg CO₂
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        <Skeleton className="absolute inset-0 rounded-full" />
        <Skeleton className="absolute inset-[25%] rounded-full bg-background" />
      </div>
    </div>
  );
}
