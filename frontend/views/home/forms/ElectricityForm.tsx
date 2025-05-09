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

// This schema matches the backend electricity.dto.ts requirements
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
  const form = useForm<ElectricityFormValues>({
    resolver: zodResolver(electricityFormSchema),
    defaultValues: {
      country: "",
      state: "",
      electricity_value: undefined,
      electricity_unit: "kwh",
    },
  });

  // Get countries that have provided state field - primarily for US
  const hasStateOptions = ["US", "CA", "AU"];

  // Check if the selected country supports states
  const selectedCountry = form.watch("country");
  const showStateField = hasStateOptions.includes(
    selectedCountry?.toUpperCase() || ""
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                    // Clear state if changing country
                    if (!hasStateOptions.includes(country.alpha2)) {
                      form.setValue("state", "");
                    }
                  }}
                  placeholder="Select a country"
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Calculating..." : "Calculate Electricity Emissions"}
        </Button>
      </form>
    </Form>
  );
}
