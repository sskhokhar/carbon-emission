"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  error: string | null;
  children: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
}

export function FormLayout({
  icon: Icon,
  title,
  description,
  error,
  children,
  iconColor = "text-[#29a7df] dark:text-[#29a7df]",
  iconBgColor = "bg-sky-100 dark:bg-sky-900/30",
}: FormLayoutProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </motion.div>

      <p className="text-xs text-gray-500 mb-4">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {children}
    </motion.div>
  );
}
