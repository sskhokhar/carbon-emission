"use client";

import { InsightsView } from "@/views/insights/insights.view";
import { Header } from "@/components/shared/header";

export default function Insights() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-[#1a2942] dark:to-[#0f1724]">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Header currentPage="insights" />
        <InsightsView />
      </div>
    </div>
  );
}
