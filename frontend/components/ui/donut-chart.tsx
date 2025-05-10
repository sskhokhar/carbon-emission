"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom color palette for the chart
const COLORS = ["#8884d8", "#82ca9d", "#ff7300"];

export interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  className?: string;
}

export function DonutChart({ data, className }: DonutChartProps) {
  return (
    <div className={`w-full h-[300px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} kg CO₂`, name]} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
