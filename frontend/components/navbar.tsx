"use client";

import Link from "next/link";
import { Clock, Home, Sprout } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Sprout className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl">Carbon Footprint Calculator</span>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Calculator</span>
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm">
              <Link href="/history" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>History</span>
              </Link>
            </Button>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
