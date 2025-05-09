"use client";

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
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      distance_value: undefined,
      distance_unit: "km",
      vehicle_model_id: undefined,
    },
  });

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

        <FormField
          control={form.control}
          name="vehicle_model_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Model (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter vehicle model ID if known"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                If you know the specific vehicle model ID, enter it here for
                more accurate calculations.
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
