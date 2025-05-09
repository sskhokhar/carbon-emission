/**
 * API utility for carbon calculation services
 */

// Base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Environment check
const isDevelopment = process.env.NEXT_PUBLIC_ENV === "development";

// Types for the API requests
export interface VehicleEmissionRequest {
  distance_value: number;
  distance_unit: "mi" | "km";
  vehicle_model_id?: string;
}

export interface FlightEmissionRequest {
  passengers: number;
  legs: Array<{
    departure_airport: string;
    destination_airport: string;
  }>;
}

export interface ElectricityEmissionRequest {
  country: string;
  state?: string;
  electricity_value: number;
  electricity_unit: "kwh" | "mwh";
}

// Response type
export interface CarbonEstimationResult {
  carbonGrams: number;
  carbonLbs: number;
  carbonKg: number;
  carbonMt: number;
  estimatedAt: Date;
  source: string;
  emissionType: string;
  originalInput: Record<string, unknown>;
}

// Log API calls in development mode
const logApiCall = (method: string, endpoint: string, data?: unknown) => {
  if (isDevelopment) {
    console.log(`🔽 API ${method} ${endpoint}`, data ? data : "");
  }
};

// Helper function to construct the full API URL
const getApiUrl = (path: string): string => {
  return `${API_URL}${path}`;
};

// API Functions
export async function estimateVehicleEmissions(
  data: VehicleEmissionRequest
): Promise<CarbonEstimationResult> {
  const endpoint = `/estimate/vehicle`;
  const url = getApiUrl(endpoint);
  logApiCall("POST", url, data);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to calculate vehicle emissions: ${errorText}`);
  }

  const result = await response.json();

  // Convert string date to Date object
  if (result.estimatedAt && typeof result.estimatedAt === "string") {
    result.estimatedAt = new Date(result.estimatedAt);
  }

  return result;
}

export async function estimateFlightEmissions(
  data: FlightEmissionRequest
): Promise<CarbonEstimationResult> {
  const endpoint = `/estimate/flight`;
  const url = getApiUrl(endpoint);
  logApiCall("POST", url, data);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to calculate flight emissions: ${errorText}`);
  }

  const result = await response.json();

  // Convert string date to Date object
  if (result.estimatedAt && typeof result.estimatedAt === "string") {
    result.estimatedAt = new Date(result.estimatedAt);
  }

  return result;
}

export async function estimateElectricityEmissions(
  data: ElectricityEmissionRequest
): Promise<CarbonEstimationResult> {
  const endpoint = `/estimate/electricity`;
  const url = getApiUrl(endpoint);
  logApiCall("POST", url, data);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to calculate electricity emissions: ${errorText}`);
  }

  const result = await response.json();

  // Convert string date to Date object
  if (result.estimatedAt && typeof result.estimatedAt === "string") {
    result.estimatedAt = new Date(result.estimatedAt);
  }

  return result;
}
