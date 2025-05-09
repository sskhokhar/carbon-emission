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
import { useState } from "react";
import { PlusCircle, Trash } from "lucide-react";

const legSchema = z.object({
  departure_airport: z.string().min(3).max(4),
  destination_airport: z.string().min(3).max(4),
});

// This schema matches the backend flight.dto.ts requirements
const flightFormSchema = z.object({
  passengers: z.coerce
    .number()
    .int()
    .min(1, { message: "At least one passenger is required" }),
  legs: z.array(legSchema).min(1, { message: "At least one leg is required" }),
});

export type LegInput = z.infer<typeof legSchema>;
export type FlightFormValues = z.infer<typeof flightFormSchema>;

interface FlightFormProps {
  onSubmit: (data: FlightFormValues) => void;
  isSubmitting?: boolean;
}

export default function FlightForm({
  onSubmit,
  isSubmitting = false,
}: FlightFormProps) {
  const [legs, setLegs] = useState<LegInput[]>([
    { departure_airport: "", destination_airport: "" },
  ]);

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      passengers: 1,
      legs: [{ departure_airport: "", destination_airport: "" }],
    },
  });

  const addLeg = () => {
    const newLegs = [
      ...form.getValues().legs,
      { departure_airport: "", destination_airport: "" },
    ];
    form.setValue("legs", newLegs);
    setLegs(newLegs);
  };

  const removeLeg = (index: number) => {
    if (legs.length > 1) {
      const newLegs = form.getValues().legs.filter((_, i) => i !== index);
      form.setValue("legs", newLegs);
      setLegs(newLegs);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="passengers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Passengers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of passengers"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the total number of passengers for this trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Flight Legs</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLeg}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Leg
            </Button>
          </div>

          {legs.map((_, index) => (
            <div key={index} className="space-y-4 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Leg {index + 1}</h4>
                {legs.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeLeg(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`legs.${index}.departure_airport`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Airport</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter IATA code (e.g., JFK)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the 3-letter IATA code for the departure airport.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`legs.${index}.destination_airport`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Airport</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter IATA code (e.g., LAX)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the 3-letter IATA code for the destination airport.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Calculating..." : "Calculate Flight Emissions"}
        </Button>
      </form>
    </Form>
  );
}
