export interface CarbonEstimationResult {
  carbonGrams: number
  carbonLbs: number
  carbonKg: number
  carbonMt: number
  estimatedAt: Date
  emissionType: string
  originalInput: Record<string, unknown>
}

export interface EstimationRecord {
  id: string
  timestamp: string
  estimation: CarbonEstimationResult
}
