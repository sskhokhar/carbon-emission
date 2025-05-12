"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

export function CalculationProgress() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing calculation...")

  useEffect(() => {
    const statuses = [
      "Initializing calculation...",
      "Fetching emission factors...",
      "Processing input data...",
      "Applying regional adjustments...",
      "Calculating carbon footprint...",
      "Finalizing results...",
    ]

    let currentStep = 0

    const interval = setInterval(() => {
      if (currentStep < statuses.length) {
        setStatus(statuses[currentStep])
        currentStep++
      }
    }, 300)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">{status}</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
