"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import {
  useVehicleMakes,
  useVehicleModels,
  useVehicleEmissionEstimation,
} from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CARBON_RESULT_KEY } from "../home.view";

// This schema matches the backend vehicle.dto.ts requirements
const vehicleFormSchema = z.object({
  distance_value: z.coerce
    .number({
      required_error: "Please enter a distance value.",
      invalid_type_error: "Distance must be a number.",
    })
    .min(0, { message: "Distance must be greater than or equal to 0" }),
  distance_unit: z.enum(["mi", "km"], {
    required_error: "Please select a distance unit.",
  }),
  vehicle_model_id: z.string().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  onSubmit: (data: VehicleFormValues) => void;
  isSubmitting?: boolean;
}

export default function VehicleForm({
  onSubmit,
  isSubmitting = false,
}: VehicleFormProps) {
  const [selectedMakeId, setSelectedMakeId] = useState<string>("");

  // React Query hooks
  const {
    data: vehicleMakes = [],
    isLoading: isLoadingMakes,
    error: makesError,
  } = useVehicleMakes();

  const {
    data: vehicleModels = [],
    isLoading: isLoadingModels,
    error: modelsError,
  } = useVehicleModels(selectedMakeId || null);

  const estimateMutation = useVehicleEmissionEstimation();

  const queryClient = useQueryClient();

  // Show toast on errors
  if (makesError) {
    toast.error("Failed to load vehicle makes. Please try again.");
  }

  if (modelsError) {
    toast.error("Failed to load vehicle models. Please try again.");
  }

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      distance_value: undefined,
      distance_unit: "km",
      vehicle_model_id: undefined,
    },
  });

  // Handle make selection
  const handleMakeChange = (makeId: string) => {
    setSelectedMakeId(makeId);
    // Reset the model selection when make changes
    form.setValue("vehicle_model_id", undefined);
  };

  // Convert vehicle makes to combobox options
  const makeOptions: ComboboxOption[] = vehicleMakes.map((make) => ({
    value: make?.data?.id,
    label: `${make?.data?.attributes?.name} (${make?.data?.attributes?.number_of_models} models)`,
  }));

  // Convert vehicle models to combobox options
  const modelOptions: ComboboxOption[] = vehicleModels.map((model) => ({
    value: model?.data?.id,
    label: `${model?.data?.attributes?.name} (${model?.data?.attributes?.year})`,
  }));

  // Handle form submission with React Query
  const handleSubmit = async (data: VehicleFormValues) => {
    try {
      const result = await estimateMutation.mutateAsync(data);

      // Store the result in the React Query cache
      queryClient.setQueryData(CARBON_RESULT_KEY, result);

      // Invalidate the estimation history query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["estimationHistory"] });

      onSubmit(data);
    } catch (error) {
      console.error("Failed to estimate vehicle emissions:", error);
      toast.error("Failed to calculate vehicle emissions. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="distance_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter distance" {...field} />
              </FormControl>
              <FormDescription>
                Enter the total distance traveled.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distance_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="mi">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the unit of distance.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Make Dropdown */}
        <FormItem>
          <FormLabel>Vehicle Make</FormLabel>
          <Combobox
            options={makeOptions}
            value={selectedMakeId}
            onValueChange={handleMakeChange}
            placeholder={
              isLoadingMakes ? "Loading makes..." : "Select vehicle make"
            }
            searchPlaceholder="Search vehicle makes..."
            emptyText="No vehicle makes found."
            disabled={isLoadingMakes || makeOptions.length === 0}
          />
          <FormDescription>Select the make of your vehicle.</FormDescription>
        </FormItem>

        {/* Vehicle Model Dropdown */}
        <FormField
          control={form.control}
          name="vehicle_model_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Model</FormLabel>
              <Combobox
                options={modelOptions}
                value={field.value || ""}
                onValueChange={field.onChange}
                placeholder={
                  isLoadingModels
                    ? "Loading models..."
                    : !selectedMakeId
                    ? "Select a make first"
                    : "Select vehicle model"
                }
                searchPlaceholder="Search vehicle models..."
                emptyText="No vehicle models found."
                disabled={
                  isLoadingModels ||
                  !selectedMakeId ||
                  modelOptions.length === 0
                }
              />
              <FormDescription>
                Select the specific model of your vehicle.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || estimateMutation.isPending}
        >
          {isSubmitting || estimateMutation.isPending
            ? "Calculating..."
            : "Calculate Vehicle Emissions"}
        </Button>
      </form>
    </Form>
  );
}
