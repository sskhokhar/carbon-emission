"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl">CarbonCalc</span>
        </Link>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
