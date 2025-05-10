import { useEstimationHistory } from "./use-history-queries";
import { EstimationRecord } from "@/lib/api";
import { DataPoint } from "@/components/ui/bar-chart";

export function useEmissionsChartData() {
  const {
    data: historyRecords = [],
    isLoading,
    error,
  } = useEstimationHistory();

  // Process the data for the chart
  const chartData: DataPoint[] = [];

  if (historyRecords.length > 0) {
    // Create a lookup of dates to make it easier to merge data points on the same day
    const dateMap = new Map<string, DataPoint>();

    // Process each history record
    historyRecords.forEach((record: EstimationRecord) => {
      // Format the date (without time) to group by day
      const date = new Date(record.timestamp);
      const dateKey = date.toISOString().split("T")[0];

      // Get or create a data point for this date
      let dataPoint = dateMap.get(dateKey);
      if (!dataPoint) {
        // Use the date portion only for the timestamp to ensure consistent positioning
        dataPoint = { timestamp: dateKey };
        dateMap.set(dateKey, dataPoint);
      }

      // Add the emission value based on type
      const emissionType = record.estimation.emissionType;
      const carbonValue = record.estimation.carbonKg;

      if (emissionType === "vehicle") {
        dataPoint.vehicle = (dataPoint.vehicle || 0) + carbonValue;
      } else if (emissionType === "electricity") {
        dataPoint.electricity = (dataPoint.electricity || 0) + carbonValue;
      } else if (emissionType === "flight") {
        dataPoint.flight = (dataPoint.flight || 0) + carbonValue;
      }
    });

    // Convert the map to an array and sort by date
    const sortedData = Array.from(dateMap.values()).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    chartData.push(...sortedData);

    // Log the processed data for debugging
    console.log("Chart data:", chartData);
  }

  return {
    chartData,
    isLoading,
    error,
  };
}
