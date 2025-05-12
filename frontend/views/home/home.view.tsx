"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ElectricityForm,
  ElectricityEmissionFormValues,
  electricityEmissionSchema,
} from "./components/electricity-form";
import {
  VehicleForm,
  VehicleEmissionFormValues,
  vehicleEmissionSchema,
} from "./components/vehicle-form";
import {
  FlightForm,
  FlightEmissionFormValues,
  flightEmissionSchema,
} from "./components/flight-form";
import { ResultsPanel } from "./components/results-panel";
import { Leaf, BarChart3, Zap, Car, Plane } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { CalculationProgress } from "@/components/calculation-progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EstimationRecord } from "@/lib/interfaces/emissions";
import {
  useElectricityEmissionEstimation,
  useVehicleEmissionEstimation,
  useFlightEmissionEstimation,
} from "@/lib/hooks";
import { EmissionDetailsDialog } from "./components/emission-detail-dialog";
import { FormProvider, useFormContext } from "@/lib/contexts/form-context";

export type CalculationResult = {
  co2: number;
  type: "Electricity" | "Vehicle" | "Flight";
  details?: string;
  date?: Date;
};

function HomeViewContent() {
  const [activeTab, setActiveTab] = useState("electricity");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [calculatedRecord, setCalculatedRecord] = useState<EstimationRecord | undefined>(undefined);
  const router = useRouter();

  const {
    isCalculating,
    setIsCalculating,
    handleCalculationSuccess,
    handleCalculationError,
    setCalculatedRecord: setContextCalculatedRecord,
    setDetailsDialogOpen: setContextDetailsDialogOpen,
  } = useFormContext();

  const electricityMutation = useElectricityEmissionEstimation();
  const vehicleMutation = useVehicleEmissionEstimation();
  const flightMutation = useFlightEmissionEstimation();

  const createCalculationHandler = useCallback(
    (mutation: any, schema: any, emissionType: "electricity" | "vehicle" | "flight") => {
      return async (formData: any, formattedDetails: string) => {
        setIsCalculating(true);

        try {
          const validatedData = schema.parse(formData);

          const result = await mutation.mutateAsync(validatedData);

          const record: EstimationRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            estimation: {
              carbonGrams: result.carbonKg * 1000,
              carbonKg: result.carbonKg,
              carbonLbs: result.carbonKg * 2.20462,
              carbonMt: result.carbonKg / 1000,
              estimatedAt: new Date(result.estimatedAt),
              emissionType,
              originalInput: validatedData,
            },
          };

          setCalculatedRecord(record);
          setContextCalculatedRecord(record);
          setDetailsDialogOpen(true);
          setContextDetailsDialogOpen(true);

          await handleCalculationSuccess(result);

          return result;
        } catch (error) {
          handleCalculationError(error);
          throw error;
        } finally {
          setIsCalculating(false);
        }
      };
    },
    [
      setIsCalculating,
      handleCalculationSuccess,
      handleCalculationError,
      setContextCalculatedRecord,
      setContextDetailsDialogOpen,
    ]
  );

  const handleCalculateElectricity = useCallback(
    (formData: ElectricityEmissionFormValues, details: string) => {
      return createCalculationHandler(
        electricityMutation,
        electricityEmissionSchema,
        "electricity"
      )(formData, details);
    },
    [createCalculationHandler, electricityMutation]
  );

  const handleCalculateVehicle = useCallback(
    (formData: VehicleEmissionFormValues, details: string) => {
      return createCalculationHandler(
        vehicleMutation,
        vehicleEmissionSchema,
        "vehicle"
      )(formData, details);
    },
    [createCalculationHandler, vehicleMutation]
  );

  const handleCalculateFlight = useCallback(
    (formData: FlightEmissionFormValues, details: string) => {
      return createCalculationHandler(
        flightMutation,
        flightEmissionSchema,
        "flight"
      )(formData, details);
    },
    [createCalculationHandler, flightMutation]
  );

  const navigateToInsights = useCallback(() => {
    router.push("/insights");
  }, [router]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="electricity"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger
                value="electricity"
                className="flex items-center gap-2"
                data-state={activeTab === "electricity" ? "active" : ""}
              >
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="hidden sm:inline">Electricity</span>
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="flex items-center gap-2"
                data-state={activeTab === "vehicle" ? "active" : ""}
              >
                <Car className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline">Vehicle</span>
              </TabsTrigger>
              <TabsTrigger
                value="flight"
                className="flex items-center gap-2"
                data-state={activeTab === "flight" ? "active" : ""}
              >
                <Plane className="h-4 w-4 text-purple-600 " />
                <span className="hidden sm:inline">Flight</span>
              </TabsTrigger>
            </TabsList>

            <Card className="border-0 shadow-lg dark:bg-[#1e2c40] dark:border dark:border-[#2a3a52]">
              <CardContent className="p-6">
                <TabsContent value="electricity" className="mt-0">
                  <ElectricityForm onCalculate={handleCalculateElectricity} />
                </TabsContent>
                <TabsContent value="vehicle" className="mt-0">
                  <VehicleForm onCalculate={handleCalculateVehicle} />
                </TabsContent>
                <TabsContent value="flight" className="mt-0">
                  <FlightForm onCalculate={handleCalculateFlight} />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <ResultsPanel />
        </div>
      </div>

      {isCalculating && <CalculationProgress />}

      <EmissionDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        record={calculatedRecord}
      />
    </>
  );
}

export function HomeView() {
  return (
    <FormProvider>
      <HomeViewContent />
    </FormProvider>
  );
}
