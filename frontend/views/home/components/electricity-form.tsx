"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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

export const electricityEmissionSchema = z.object({
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  electricity_value: z.number().positive("Energy consumption must be positive"),
  electricity_unit: z.enum(["kwh", "mwh"], {
    required_error: "Unit is required",
    invalid_type_error: "Unit must be kwh or mwh",
  }),
});

export type ElectricityEmissionFormValues = z.infer<typeof electricityEmissionSchema>;

interface ElectricityFormProps {
  onCalculate: (formData: ElectricityEmissionFormValues, details: string) => Promise<any>;
}

export function ElectricityForm({ onCalculate }: ElectricityFormProps) {
  const { isCalculating } = useFormContext();
  const [showCountryHelp, setShowCountryHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SUPPORTED_COUNTRIES = useMemo(
    () => [
      { code: "US", name: "United States" },
      { code: "CA", name: "Canada" },
      { code: "AT", name: "Austria" },
      { code: "BE", name: "Belgium" },
      { code: "BG", name: "Bulgaria" },
      { code: "HR", name: "Croatia" },
      { code: "CY", name: "Cyprus" },
      { code: "CZ", name: "Czech Republic" },
      { code: "DK", name: "Denmark" },
      { code: "EE", name: "Estonia" },
      { code: "FI", name: "Finland" },
      { code: "FR", name: "France" },
      { code: "DE", name: "Germany" },
      { code: "GR", name: "Greece" },
      { code: "HU", name: "Hungary" },
      { code: "IE", name: "Ireland" },
      { code: "IT", name: "Italy" },
      { code: "LV", name: "Latvia" },
      { code: "LT", name: "Lithuania" },
      { code: "LU", name: "Luxembourg" },
      { code: "MT", name: "Malta" },
      { code: "NL", name: "Netherlands" },
      { code: "PL", name: "Poland" },
      { code: "PT", name: "Portugal" },
      { code: "RO", name: "Romania" },
      { code: "SK", name: "Slovakia" },
      { code: "SI", name: "Slovenia" },
      { code: "ES", name: "Spain" },
      { code: "SE", name: "Sweden" },
      { code: "GB", name: "United Kingdom" },
    ],
    []
  );

  const form = useForm<ElectricityEmissionFormValues>({
    resolver: zodResolver(electricityEmissionSchema),
    defaultValues: {
      country: "",
      electricity_value: undefined,
      electricity_unit: "kwh",
    },
  });

  const toggleCountryHelp = useCallback(() => {
    setShowCountryHelp((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: ElectricityEmissionFormValues) => {
      setError(null);

      try {
        const details = `${data.electricity_value} ${data.electricity_unit.toUpperCase()} in ${
          SUPPORTED_COUNTRIES.find((c) => c.code.toLowerCase() === data.country.toLowerCase())
            ?.name || data.country.toUpperCase()
        }`;

        const result = await onCalculate(data, details);

        if (result) {
          form.reset();
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to calculate emissions");
      }
    },
    [SUPPORTED_COUNTRIES, form, onCalculate]
  );

  const sortedCountries = useMemo(() => {
    return [...SUPPORTED_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  }, [SUPPORTED_COUNTRIES]);

  return (
    <FormLayout
      icon={Zap}
      title="Electricity Consumption"
      description="Calculate carbon emissions from electricity usage."
      error={error}
      iconColor="text-yellow-600"
      iconBgColor="bg-yellow-100 dark:bg-yellow-900"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center">
                        Country <span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-gray-500"
                        onClick={toggleCountryHelp}
                        type="button"
                      >
                        {showCountryHelp ? "Hide help" : "Why is this needed?"}
                      </Button>
                    </div>
                    <FormControl>
                      <Select
                        disabled={isCalculating}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="country" className="w-full">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortedCountries.map((country) => (
                            <SelectItem key={country.code} value={country.code.toLowerCase()}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showCountryHelp && (
              <div className="text-xs bg-green-50 dark:bg-green-900/30 p-3 rounded-md mt-2 text-gray-600 dark:text-gray-300">
                Different countries have different electricity generation methods and carbon
                intensities. For example, countries with more renewable energy will have lower
                carbon emissions per kWh.
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the country where electricity is consumed.
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
              name="electricity_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Energy Consumption <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter energy consumption amount"
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
              Enter the amount of electricity consumed.
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
              name="electricity_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measurement</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isCalculating}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id="unit" className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kwh">Kilowatt-hours (kWh)</SelectItem>
                        <SelectItem value="mwh">Megawatt-hours (MWh)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the unit of measurement for your electricity consumption.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isCalculating}
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
