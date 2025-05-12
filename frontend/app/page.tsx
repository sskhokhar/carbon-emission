"use client";

import { HomeView } from "@/views/home/home.view";
import { Header } from "@/components/shared/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-[#0a1a33] dark:to-gray-950">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Header currentPage="home" />
        <HomeView />
      </div>
    </main>
  );
}
