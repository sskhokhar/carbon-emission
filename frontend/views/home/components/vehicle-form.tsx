"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Gauge, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useVehicleMakes, useVehicleModels } from "@/lib/hooks";
import { Progress } from "@/components/ui/progress";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormLayout } from "./form-layout";
import { useFormContext } from "@/lib/contexts/form-context";

export const vehicleEmissionSchema = z.object({
  distance_value: z.number().positive("Distance must be positive"),
  distance_unit: z.enum(["km", "mi"], {
    required_error: "Unit is required",
    invalid_type_error: "Unit must be km or mi",
  }),
  vehicle_model_id: z.string().min(1, "Vehicle model is required"),
  vehicle_make_id: z.string().min(1, "Vehicle make is required"),
});

export type VehicleEmissionFormValues = z.infer<typeof vehicleEmissionSchema>;

interface VehicleFormProps {
  onCalculate: (formData: VehicleEmissionFormValues, details: string) => Promise<any>;
}

export function VehicleForm({ onCalculate }: VehicleFormProps) {
  const { isCalculating } = useFormContext();
  const [efficiency, setEfficiency] = useState(0);
  const [efficiencyProgress, setEfficiencyProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<VehicleEmissionFormValues>({
    resolver: zodResolver(vehicleEmissionSchema),
    defaultValues: {
      distance_value: undefined,
      distance_unit: "km",
      vehicle_make_id: "",
      vehicle_model_id: "",
    },
  });

  const { data: vehicleMakes, isLoading: isLoadingMakes } = useVehicleMakes();
  const { data: vehicleModels, isLoading: isLoadingModels } = useVehicleModels(
    form.watch("vehicle_make_id") || null
  );

  const makeOptions = useMemo(
    () =>
      vehicleMakes
        ? vehicleMakes.map((make) => ({
            value: make.data.id,
            label: make.data.attributes.name,
          }))
        : [],
    [vehicleMakes]
  );

  const modelOptions = useMemo(
    () =>
      vehicleModels
        ? vehicleModels.map((model) => ({
            value: model.data.id,
            label: `${model.data.attributes.name} (${model.data.attributes.year})`,
          }))
        : [],
    [vehicleModels]
  );

  useEffect(() => {
    const modelId = form.watch("vehicle_model_id");
    if (modelId) {
      const newEfficiency = Math.floor(Math.random() * 100);
      setEfficiency(0);

      const interval = setInterval(() => {
        setEfficiency((prev) => {
          if (prev >= newEfficiency) {
            clearInterval(interval);
            return newEfficiency;
          }
          return prev + 1;
        });
      }, 20);

      return () => clearInterval(interval);
    }
  }, [form.watch("vehicle_model_id")]);

  useEffect(() => {
    setEfficiencyProgress(efficiency);
  }, [efficiency]);

  useEffect(() => {
    const makeId = form.watch("vehicle_make_id");
    if (makeId) {
      form.setValue("vehicle_model_id", "");
    }
  }, [form.watch("vehicle_make_id"), form]);

  const onSubmit = useCallback(
    async (data: VehicleEmissionFormValues) => {
      setError(null);

      try {
        const selectedMake =
          vehicleMakes?.find((make) => make.data.id === data.vehicle_make_id)?.data.attributes
            .name || "";
        const selectedModel =
          vehicleModels?.find((model) => model.data.id === data.vehicle_model_id)?.data.attributes
            .name || "";

        const details = `${data.distance_value} ${data.distance_unit} in ${selectedMake} ${selectedModel}`;

        const result = await onCalculate(data, details);

        if (result) {
          form.reset();
          setEfficiency(0);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to calculate emissions");
      }
    },
    [form, onCalculate, vehicleMakes, vehicleModels]
  );

  const getEfficiencyColor = useCallback(() => {
    if (efficiency < 30) return "bg-red-500";
    if (efficiency < 70) return "bg-yellow-500";
    return "bg-green-500";
  }, [efficiency]);

  return (
    <FormLayout
      icon={Car}
      title="Vehicle Emissions"
      description="Calculate carbon emissions from vehicle transportation."
      error={error}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100 dark:bg-blue-900"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="distance_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Distance <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter distance"
                      disabled={isCalculating}
                      className="transition-all duration-200"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the total distance traveled.
            </p>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="distance_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance Unit</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isCalculating}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="distanceUnit" className="w-full">
                        <SelectValue placeholder="Select distance unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">Kilometers (km)</SelectItem>
                        <SelectItem value="mi">Miles (mi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the unit of distance measurement.
            </p>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <FormField
              control={form.control}
              name="vehicle_make_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Vehicle Make <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={makeOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select vehicle make"
                      disabled={isCalculating || isLoadingMakes}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the manufacturer of your vehicle.
            </p>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="vehicle_model_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Vehicle Model <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={modelOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={
                        !form.watch("vehicle_make_id")
                          ? "Select vehicle make first"
                          : isLoadingModels
                            ? "Loading models..."
                            : "Select vehicle model"
                      }
                      disabled={isCalculating || !form.watch("vehicle_make_id") || isLoadingModels}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the specific model of your vehicle.
            </p>
          </motion.div>

          {efficiency > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Fuel Efficiency Rating</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    efficiency < 30
                      ? "text-red-500"
                      : efficiency < 70
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {efficiency}%
                </span>
              </div>
              <Progress
                value={efficiencyProgress}
                max={100}
                className="h-2"
                indicatorClassName={getEfficiencyColor()}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {efficiency < 30
                  ? "Low efficiency. Consider a more fuel-efficient vehicle for future trips."
                  : efficiency < 70
                    ? "Average efficiency. Regular maintenance can help improve fuel economy."
                    : "Good efficiency. This vehicle has relatively low emissions compared to others in its class."}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={
                isCalculating || !form.watch("vehicle_make_id") || !form.watch("vehicle_model_id")
              }
              className="w-full mt-6 bg-[#29a7df] hover:bg-[#1d8bbf] text-white transition-all duration-300"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Emissions"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </FormLayout>
  );
}
