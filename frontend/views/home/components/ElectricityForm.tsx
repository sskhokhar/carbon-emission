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
import { CountryDropdown, Country } from "@/components/ui/country-dropdown";
import { toast } from "sonner";
import { useElectricityEmissionEstimation } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CARBON_RESULT_KEY } from "../home.view";
import { countries } from "country-data-list";

const SUPPORTED_COUNTRIES = [
  "US",
  "CA",
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
];

const supportedCountryOptions = countries.all.filter(
  (country) =>
    country.emoji &&
    country.status !== "deleted" &&
    SUPPORTED_COUNTRIES.includes(country.alpha2)
);

const electricityFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().optional(),
  electricity_value: z.coerce
    .number({
      required_error: "Please enter electricity value.",
      invalid_type_error: "Value must be a number.",
    })
    .min(0, { message: "Value must be greater than or equal to 0" }),
  electricity_unit: z.enum(["kwh", "mwh"], {
    required_error: "Please select a unit.",
  }),
});

export type ElectricityFormValues = z.infer<typeof electricityFormSchema>;

interface ElectricityFormProps {
  onSubmit: (data: ElectricityFormValues) => void;
  isSubmitting?: boolean;
}

export default function ElectricityForm({
  onSubmit,
  isSubmitting = false,
}: ElectricityFormProps) {
  const estimateMutation = useElectricityEmissionEstimation();
  const queryClient = useQueryClient();

  const form = useForm<ElectricityFormValues>({
    resolver: zodResolver(electricityFormSchema),
    defaultValues: {
      country: "",
      state: "",
      electricity_value: undefined,
      electricity_unit: "kwh",
    },
  });

  const hasStateOptions = ["US"];

  const selectedCountry = form.watch("country");
  const showStateField = hasStateOptions.includes(
    selectedCountry?.toUpperCase() || ""
  );

  const handleSubmit = async (data: ElectricityFormValues) => {
    try {
      const result = await estimateMutation.mutateAsync(data);

      queryClient.setQueryData(CARBON_RESULT_KEY, result);

      queryClient.invalidateQueries({ queryKey: ["estimationHistory"] });

      onSubmit(data);
    } catch (error) {
      console.error("Failed to estimate electricity emissions:", error);
      toast.error(
        "Failed to calculate electricity emissions. Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountryDropdown
                  defaultValue={field.value}
                  onChange={(country: Country) => {
                    field.onChange(country.alpha2.toLowerCase());

                    if (!hasStateOptions.includes(country.alpha2)) {
                      form.setValue("state", "");
                    }
                  }}
                  placeholder="Select a country"
                  options={supportedCountryOptions}
                />
              </FormControl>
              <FormDescription>
                Select the country where electricity is consumed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showStateField && (
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter state or province"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  For countries like US, enter the state for more accurate
                  calculations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="electricity_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energy Consumption</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter energy consumption amount"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the amount of electricity consumed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="electricity_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energy Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select energy unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="kwh">Kilowatt Hours (kWh)</SelectItem>
                  <SelectItem value="mwh">Megawatt Hours (mWh)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the unit of energy consumption.
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
            : "Calculate Electricity Emissions"}
        </Button>
      </form>
    </Form>
  );
}
