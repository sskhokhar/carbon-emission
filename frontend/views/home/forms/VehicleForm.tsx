"use client";

import { useEffect, useState } from "react";
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
import {
  getVehicleMakes,
  getVehicleModels,
  VehicleMake,
  VehicleModel,
} from "@/lib/api";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

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
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string>("");
  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      distance_value: undefined,
      distance_unit: "km",
      vehicle_model_id: undefined,
    },
  });

  useEffect(() => {
    async function fetchVehicleMakes() {
      try {
        setIsLoadingMakes(true);
        const response = await getVehicleMakes();
        setVehicleMakes(
          response.sort((a, b) =>
            a.data.attributes.name.localeCompare(b.data.attributes.name)
          ) || []
        );
      } catch (error) {
        console.error("Failed to fetch vehicle makes:", error);
        toast.error("Failed to load vehicle makes. Please try again.");
      } finally {
        setIsLoadingMakes(false);
      }
    }

    fetchVehicleMakes();
  }, []);

  useEffect(() => {
    async function fetchVehicleModels() {
      if (!selectedMakeId) return;

      try {
        setIsLoadingModels(true);
        const response = await getVehicleModels(selectedMakeId);
        setVehicleModels(response || []);
      } catch (error) {
        console.error("Failed to fetch vehicle models:", error);
        toast.error("Failed to load vehicle models. Please try again.");
      } finally {
        setIsLoadingModels(false);
      }
    }

    fetchVehicleModels();
  }, [selectedMakeId]);

  const handleMakeChange = (makeId: string) => {
    setSelectedMakeId(makeId);
    form.setValue("vehicle_model_id", undefined);
  };

  const makeOptions: ComboboxOption[] = vehicleMakes.map((make) => ({
    value: make?.data?.id,
    label: `${make?.data?.attributes?.name} (${make?.data?.attributes?.number_of_models} models)`,
  }));

  const modelOptions: ComboboxOption[] = vehicleModels.map((model) => ({
    value: model?.data?.id,
    label: `${model?.data?.attributes?.name} (${model?.data?.attributes?.year})`,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            disabled={isLoadingMakes || vehicleMakes?.length === 0}
          />
          <FormDescription>Select the make of your vehicle.</FormDescription>
        </FormItem>

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
                  vehicleModels.length === 0
                }
              />
              <FormDescription>
                Select the specific model of your vehicle.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Calculating..." : "Calculate Vehicle Emissions"}
        </Button>
      </form>
    </Form>
  );
}
