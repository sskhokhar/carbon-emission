"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Plane, Zap } from "lucide-react";
import { toast } from "sonner";
import ElectricityForm from "./forms/ElectricityForm";
import VehicleForm from "./forms/VehicleForm";
import FlightForm from "./forms/FlightForm";
import {
  estimateElectricityEmissions,
  estimateVehicleEmissions,
  estimateFlightEmissions,
  CarbonEstimationResult,
  ElectricityEmissionRequest,
  VehicleEmissionRequest,
  FlightEmissionRequest,
} from "@/lib/api";

export default function HomeView() {
  const [activeTab, setActiveTab] = useState<string>("electricity");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<CarbonEstimationResult | null>(null);

  // Handle electricity form submission
  const handleElectricitySubmit = async (data: ElectricityEmissionRequest) => {
    try {
      setIsSubmitting(true);
      const result = await estimateElectricityEmissions(data);
      setResult(result);
      toast.success("Electricity emissions calculated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to calculate electricity emissions. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle vehicle form submission
  const handleVehicleSubmit = async (data: VehicleEmissionRequest) => {
    try {
      setIsSubmitting(true);
      const result = await estimateVehicleEmissions(data);
      setResult(result);
      toast.success("Vehicle emissions calculated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate vehicle emissions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle flight form submission
  const handleFlightSubmit = async (data: FlightEmissionRequest) => {
    try {
      setIsSubmitting(true);
      const result = await estimateFlightEmissions(data);
      setResult(result);
      toast.success("Flight emissions calculated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate flight emissions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Carbon Calculator</h1>

          {result && (
            <div className="w-full md:w-auto p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-400">
                Latest Result
              </h3>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-sm flex justify-between gap-4">
                  <span className="text-muted-foreground">CO₂:</span>
                  <span className="font-medium">
                    {result.carbonKg.toFixed(2)} kg
                  </span>
                </p>
                <p className="text-sm flex justify-between gap-4">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">
                    {result.emissionType}
                  </span>
                </p>
                <p className="text-sm flex justify-between gap-4">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{result.source}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="electricity"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>Electricity</span>
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span>Vehicle</span>
            </TabsTrigger>
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              <span>Flight</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="electricity" className="mt-6">
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <CardTitle>Electricity Consumption</CardTitle>
                </div>
                <CardDescription>
                  Calculate carbon emissions from electricity usage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ElectricityForm
                  onSubmit={handleElectricitySubmit}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vehicle" className="mt-6">
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <CardTitle>Vehicle Emissions</CardTitle>
                </div>
                <CardDescription>
                  Calculate carbon emissions from vehicle transportation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VehicleForm
                  onSubmit={handleVehicleSubmit}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="flight" className="mt-6">
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-600" />
                  <CardTitle>Flight Emissions</CardTitle>
                </div>
                <CardDescription>
                  Calculate carbon emissions from air travel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlightForm
                  onSubmit={handleFlightSubmit}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
