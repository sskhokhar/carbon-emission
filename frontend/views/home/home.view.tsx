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
import ElectricityForm from "./components/ElectricityForm";
import VehicleForm from "./components/VehicleForm";
import FlightForm from "./components/FlightForm";
import { CarbonEstimationResult } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Key for storing carbon estimation results
export const CARBON_RESULT_KEY = ["carbonEstimation"];

export default function HomeView() {
  const [activeTab, setActiveTab] = useState<string>("electricity");

  // Use React Query for storing the latest calculation result
  const { data: result } = useQuery<CarbonEstimationResult | null>({
    queryKey: CARBON_RESULT_KEY,
    queryFn: () => null,
    enabled: false, // Don't run on mount
  });

  // Handle form submissions - just show success message
  const handleElectricitySubmit = () => {
    toast.success("Electricity emissions calculated successfully!");
  };

  const handleVehicleSubmit = () => {
    toast.success("Vehicle emissions calculated successfully!");
  };

  const handleFlightSubmit = () => {
    toast.success("Flight emissions calculated successfully!");
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
                  isSubmitting={false}
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
                  isSubmitting={false}
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
                  isSubmitting={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
