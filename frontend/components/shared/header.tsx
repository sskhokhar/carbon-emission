"use client";

import { ArrowLeft, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentPage: "home" | "insights";
}

export function Header({ currentPage }: HeaderProps) {
  const router = useRouter();

  const navigateToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const navigateToInsights = useCallback(() => {
    router.push("/insights");
  }, [router]);

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1a33] to-[#29a7df]">
            Carbon Footprint Calculator
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Measure and track your carbon emissions from various activities
        </p>
      </div>
      <div className="flex items-center gap-4">
        {currentPage === "home" ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={navigateToInsights}
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Insights</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={navigateToHome}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Calculator</span>
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
