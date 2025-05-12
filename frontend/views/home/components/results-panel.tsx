"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  Zap,
  Car,
  PlaneTakeoff,
  TrendingDown,
  TrendingUp,
  Info,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClearHistory,
  useEstimationHistory,
} from "@/lib/hooks/use-history-queries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmissionDetailsDialog } from "./emission-detail-dialog";
import { EstimationRecord } from "@/lib/interfaces/emissions";
import { ClearHistoryButton } from "./clear-history-button";
import { useFormContext } from "@/lib/contexts/form-context";

interface ResultsPanelProps {
  className?: string;
}

export function ResultsPanel({ className }: ResultsPanelProps) {
  const [impactScore, setImpactScore] = useState(0);
  const [showImpactDetails, setShowImpactDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    EstimationRecord | undefined
  >(undefined);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const {
    setCalculatedRecord,
    setDetailsDialogOpen: setContextDetailsDialogOpen,
  } = useFormContext();

  const { data: historyData, isLoading } = useEstimationHistory();
  const { mutateAsync: clearHistory } = useClearHistory();

  const sortedHistoryData = useMemo(() => {
    if (!historyData) return [];
    return [...historyData].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [historyData]);

  const displayHistory = useMemo(() => {
    return sortedHistoryData?.slice(0, 5) || [];
  }, [sortedHistoryData]);

  useEffect(() => {
    if (sortedHistoryData?.length) {
      setImpactScore(0);
      const targetScore = 65;

      const interval = setInterval(() => {
        setImpactScore((prev) => {
          if (prev >= targetScore) {
            clearInterval(interval);
            return targetScore;
          }
          return prev + 1;
        });
      }, 20);

      return () => clearInterval(interval);
    }
  }, [sortedHistoryData]);

  const getIcon = useCallback((type: string) => {
    switch (type) {
      case "electricity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "vehicle":
        return <Car className="h-5 w-5 text-blue-500" />;
      case "flight":
        return <PlaneTakeoff className="h-5 w-5 text-purple-500" />;
      default:
        return <Leaf className="h-5 w-5 text-green-500" />;
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case "electricity":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "vehicle":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "flight":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  }, []);

  const handleViewDetails = useCallback(
    (record: EstimationRecord) => {
      setSelectedRecord(record);
      setCalculatedRecord(record);
      setDetailsDialogOpen(true);
      setContextDetailsDialogOpen(true);
    },
    [setCalculatedRecord, setContextDetailsDialogOpen]
  );

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Latest Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-lg h-full ${className || ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Estimations
          </div>
          <ClearHistoryButton onClearHistory={clearHistory} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayHistory.length ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {displayHistory.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  index === 0
                    ? "bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800"
                    : "bg-white dark:bg-gray-950"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ rotate: 15 }}>
                        {getIcon(result.estimation.emissionType)}
                      </motion.div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                          result.estimation.emissionType
                        )}`}
                      >
                        {result.estimation.emissionType}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(result.timestamp), "dd MMM yyyy HH:mm")}
                    </span>
                  </div>
                  {index === 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        delay: 0.2,
                      }}
                      className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full"
                    >
                      Latest
                    </motion.span>
                  )}
                </div>
                <motion.div
                  className="flex items-end gap-1 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <span className="text-2xl font-bold">
                    {result.estimation.carbonKg.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">
                    kg CO₂
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => handleViewDetails(result)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </motion.div>

                {index === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Compared to average:
                      </span>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingDown className="h-3 w-3" />
                        <span>35% lower</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Leaf className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No emissions calculated yet
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mt-2">
              Use the calculators to estimate your carbon emissions from various
              activities.
            </p>
          </div>
        )}

        {displayHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Carbon Footprint Impact</h3>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowImpactDetails(!showImpactDetails)}
              >
                {showImpactDetails ? "Hide details" : "Show details"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-green-600 h-2.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${impactScore}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Low Impact</span>
                <span>Average</span>
                <span>High Impact</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Your carbon footprint is 35% lower than the average person in your
              region.
            </p>

            {showImpactDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-md"
              >
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Electricity</span>
                    <span className="font-medium">Good</span>
                  </div>
                  <Progress value={75} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Transportation</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <Progress value={90} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Air Travel</span>
                    <span className="font-medium">Average</span>
                  </div>
                  <Progress value={50} className="h-1.5" />
                </div>
                <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span>Your electricity usage is 25% below average</span>
                  </p>
                  <p className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span>Your air travel is 10% below average</span>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <EmissionDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          record={selectedRecord}
        />
      </CardContent>
    </Card>
  );
}
