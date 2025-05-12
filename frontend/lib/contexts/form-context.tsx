"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { EstimationRecord } from "@/lib/interfaces/emissions";

interface FormContextType {
  isCalculating: boolean;
  setIsCalculating: (value: boolean) => void;
  setCalculatedRecord: (record: EstimationRecord | undefined) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  handleCalculationSuccess: (result: any) => Promise<boolean>;
  handleCalculationError: (error: unknown) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedRecord, setCalculatedRecord] = useState<EstimationRecord | undefined>(undefined);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCalculationSuccess = async (result: any) => {
    toast({
      title: "Calculation Complete",
      description: `${result.carbonKg.toFixed(2)} kg CO₂ emissions calculated.`,
      variant: "success",
    });

    await queryClient.invalidateQueries({ queryKey: ["estimationHistory"] });
    await queryClient.refetchQueries({ queryKey: ["estimationHistory"] });

    return true;
  };

  const handleCalculationError = (error: unknown) => {
    toast({
      title: "Calculation Failed",
      description: error instanceof Error ? error.message : "Failed to calculate emissions",
      variant: "destructive",
    });
  };

  return (
    <FormContext.Provider
      value={{
        isCalculating,
        setIsCalculating,
        setCalculatedRecord,
        setDetailsDialogOpen,
        handleCalculationSuccess,
        handleCalculationError,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
