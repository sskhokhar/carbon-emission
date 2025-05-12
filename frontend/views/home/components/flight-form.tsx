"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlaneTakeoff,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  Info,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLayout } from "./form-layout";
import { useFormContext } from "@/lib/contexts/form-context";

const flightLegSchema = z.object({
  departure_airport: z.string().min(1, "Departure airport is required"),
  destination_airport: z.string().min(1, "Destination airport is required"),
  validDeparture: z.boolean().optional(),
  validDestination: z.boolean().optional(),
  distance: z.number().optional(),
});

export const flightEmissionSchema = z.object({
  passengers: z
    .number()
    .int()
    .positive("Number of passengers must be positive"),
  legs: z.array(flightLegSchema).min(1, "At least one flight leg is required"),
  cabin_class: z
    .enum(["economy", "premium", "business", "first"], {
      required_error: "Cabin class is required",
    })
    .optional(),
  round_trip: z.boolean().optional(),
});

export type FlightEmissionFormValues = z.infer<typeof flightEmissionSchema>;

interface FlightFormProps {
  onCalculate: (
    formData: FlightEmissionFormValues,
    details: string
  ) => Promise<any>;
}

export function FlightForm({ onCalculate }: FlightFormProps) {
  const { isCalculating } = useFormContext();
  const [totalDistance, setTotalDistance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validatingAirports, setValidatingAirports] = useState<
    Record<string, boolean>
  >({});

  const form = useForm<FlightEmissionFormValues>({
    resolver: zodResolver(flightEmissionSchema),
    defaultValues: {
      passengers: 1,
      legs: [{ departure_airport: "", destination_airport: "" }],
      cabin_class: "economy",
      round_trip: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "legs",
  });

  const legs = useWatch({
    control: form.control,
    name: "legs",
  });

  const cabinClassOptions = useMemo(
    () => [
      { value: "economy", label: "Economy" },
      { value: "premium", label: "Premium Economy" },
      { value: "business", label: "Business" },
      { value: "first", label: "First Class" },
    ],
    []
  );

  const addFlightLeg = useCallback(() => {
    append({ departure_airport: "", destination_airport: "" });
  }, [append]);

  const removeFlightLeg = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const validateAirport = useCallback(
    (
      index: number,
      field: "departure_airport" | "destination_airport",
      value: string
    ) => {
      const fieldId = `${index}-${field}`;

      setValidatingAirports((prev) => ({ ...prev, [fieldId]: true }));

      const validationTimerId = setTimeout(() => {
        const isValid = /^[A-Z]{3}$/.test(value.toUpperCase());

        form.setValue(
          `legs.${index}.${
            field === "departure_airport"
              ? "validDeparture"
              : "validDestination"
          }`,
          isValid
        );

        setValidatingAirports((prev) => ({ ...prev, [fieldId]: false }));

        const currentLeg = form.getValues(`legs.${index}`);

        if (
          currentLeg.departure_airport &&
          currentLeg.destination_airport &&
          currentLeg.validDeparture &&
          currentLeg.validDestination
        ) {
          const distanceTimerId = setTimeout(() => {
            const distance = Math.floor(Math.random() * 5000) + 500;

            form.setValue(`legs.${index}.distance`, distance);

            const newTotalDistance = form
              .getValues("legs")
              .reduce((sum, leg) => sum + (leg.distance || 0), 0);

            setTotalDistance(newTotalDistance);
          }, 500);

          return () => clearTimeout(distanceTimerId);
        }
      }, 800);

      return () => clearTimeout(validationTimerId);
    },
    [form]
  );

  const handleAirportChange = useCallback(
    (
      index: number,
      field: "departure_airport" | "destination_airport",
      value: string
    ) => {
      const upperValue = value.toUpperCase();

      form.setValue(`legs.${index}.${field}`, upperValue);
      form.setValue(
        `legs.${index}.${
          field === "departure_airport" ? "validDeparture" : "validDestination"
        }`,
        undefined
      );

      if (upperValue.length === 3) {
        validateAirport(index, field, upperValue);
      }
    },
    [form, validateAirport]
  );

  const onSubmit = useCallback(
    async (data: FlightEmissionFormValues) => {
      setError(null);

      try {
        const firstLeg = data.legs[0];
        const details = `${firstLeg.departure_airport.toUpperCase()} to ${firstLeg.destination_airport.toUpperCase()} (${
          data.cabin_class
        } class, ${data.round_trip ? "round trip" : "one way"}, ${
          data.passengers
        } passenger${data.passengers > 1 ? "s" : ""})`;

        const result = await onCalculate(data, details);

        if (result) {
          form.reset({
            passengers: 1,
            legs: [{ departure_airport: "", destination_airport: "" }],
            cabin_class: "economy",
            round_trip: false,
          });
          setTotalDistance(0);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to calculate emissions"
        );
      }
    },
    [form, onCalculate]
  );

  const hasValidAirports = useMemo(() => {
    if (!legs) return false;

    return !legs.some(
      (leg) =>
        !leg.departure_airport ||
        !leg.destination_airport ||
        leg.validDeparture === false ||
        leg.validDestination === false
    );
  }, [legs]);

  useEffect(() => {
    return () => {
      Object.keys(validatingAirports).forEach((key) => {
        if (validatingAirports[key]) {
        }
      });
    };
  }, [validatingAirports]);

  return (
    <FormLayout
      icon={PlaneTakeoff}
      title="Flight Emissions"
      description="Calculate carbon emissions from air travel."
      error={error}
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
              name="cabin_class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Cabin Class <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isCalculating}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue="economy"
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select cabin class" />
                      </SelectTrigger>
                      <SelectContent>
                        {cabinClassOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-xs text-gray-400 dark:text-gray-400">
              <Info className="h-4 w-4 inline-block mr-1" /> Higher cabin
              classes have more space and thus higher emissions per passenger.
            </p>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Number of Passengers{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="500"
                      disabled={isCalculating}
                      className="w-full"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-400 dark:text-gray-400">
              Enter the total number of passengers for this flight.
            </p>
          </motion.div>

          <motion.div
            className="space-y-2 mt-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="round_trip"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isCalculating}
                      className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-600"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Round Trip
                  </FormLabel>
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 pl-6">
              Round trips double the emissions of a one-way flight.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4 mt-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <div className="flex items-center justify-between">
              <FormLabel className="flex items-center">
                Flight Legs <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <Button
                variant="outline"
                size="sm"
                onClick={addFlightLeg}
                disabled={isCalculating}
                className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-950"
                type="button"
              >
                <Plus className="h-4 w-4" /> Add Leg
              </Button>
            </div>

            <AnimatePresence>
              {fields.map((field, index) => {
                const leg = legs?.[index] || {
                  departure_airport: "",
                  destination_airport: "",
                };

                return (
                  <motion.div
                    key={field.id}
                    className="p-4 border rounded-lg bg-white dark:bg-gray-950 space-y-4 relative overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Leg {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFlightLeg(index)}
                          disabled={isCalculating}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove leg</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel
                          htmlFor={`departure-${index}`}
                          className="flex items-center gap-2"
                        >
                          Departure Airport{" "}
                          <span className="text-red-500 ml-1">*</span>
                          {validatingAirports[`${index}-departure_airport`] && (
                            <Badge variant="outline" className="animate-pulse">
                              Checking...
                            </Badge>
                          )}
                          {leg.validDeparture === true && (
                            <Badge className="bg-green-500">Valid</Badge>
                          )}
                          {leg.validDeparture === false && (
                            <Badge variant="destructive">Invalid</Badge>
                          )}
                        </FormLabel>
                        <div className="relative">
                          <Input
                            id={`departure-${index}`}
                            placeholder="Enter airport code (e.g., NYC, london)"
                            value={leg.departure_airport || ""}
                            onChange={(e) =>
                              handleAirportChange(
                                index,
                                "departure_airport",
                                e.target.value
                              )
                            }
                            disabled={isCalculating}
                            maxLength={3}
                            className={`uppercase ${
                              leg.validDeparture === false
                                ? "border-red-500 focus-visible:ring-red-500"
                                : leg.validDeparture === true
                                ? "border-green-500 focus-visible:ring-green-500"
                                : ""
                            }`}
                          />
                          {validatingAirports[`${index}-departure_airport`] && (
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FormLabel
                          htmlFor={`destination-${index}`}
                          className="flex items-center gap-2"
                        >
                          Destination Airport{" "}
                          <span className="text-red-500 ml-1">*</span>
                          {validatingAirports[
                            `${index}-destination_airport`
                          ] && (
                            <Badge variant="outline" className="animate-pulse">
                              Checking...
                            </Badge>
                          )}
                          {leg.validDestination === true && (
                            <Badge className="bg-green-500">Valid</Badge>
                          )}
                          {leg.validDestination === false && (
                            <Badge variant="destructive">Invalid</Badge>
                          )}
                        </FormLabel>
                        <div className="relative">
                          <Input
                            id={`destination-${index}`}
                            placeholder="Enter airport code (e.g., LAX, paris)"
                            value={leg.destination_airport || ""}
                            onChange={(e) =>
                              handleAirportChange(
                                index,
                                "destination_airport",
                                e.target.value
                              )
                            }
                            disabled={isCalculating}
                            maxLength={3}
                            className={`uppercase ${
                              leg.validDestination === false
                                ? "border-red-500 focus-visible:ring-red-500"
                                : leg.validDestination === true
                                ? "border-green-500 focus-visible:ring-green-500"
                                : ""
                            }`}
                          />
                          {validatingAirports[
                            `${index}-destination_airport`
                          ] && (
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>

                    {leg.distance && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded text-sm flex justify-between items-center"
                      >
                        <span>Estimated flight distance:</span>
                        <Badge variant="outline" className="font-mono">
                          {leg.distance.toLocaleString()} km
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {totalDistance > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Total flight distance:
                </span>
                <Badge className="bg-green-600">
                  {totalDistance.toLocaleString()} km
                </Badge>
              </div>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {totalDistance > 10000
                  ? "Long-haul flights have a significant carbon impact. Consider carbon offsets."
                  : totalDistance > 3000
                  ? "Medium-distance flights. Look into more sustainable travel options when possible."
                  : "Shorter flights. For future trips, consider train travel for similar distances."}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
              type="submit"
              disabled={isCalculating || !hasValidAirports}
            >
              {isCalculating
                ? "Calculating flight emissions..."
                : "Calculate Flight Emissions"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </FormLayout>
  );
}
