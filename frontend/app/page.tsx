"use client";

import { HomeView } from "@/views/home/home.view";
import { Header } from "@/components/shared/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-[#1a2942] dark:to-[#0f1724]">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Header currentPage="home" />
        <HomeView />
      </div>
    </main>
  );
}
