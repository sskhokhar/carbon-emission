const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isDevelopment = process.env.NEXT_PUBLIC_ENV === "development";

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

// Vehicle makes and models
export interface VehicleMake {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      number_of_models: number;
    };
  };
}

export interface VehicleModel {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      year: number;
      make_id: string;
    };
  };
}

// Response type
export interface CarbonEstimationResult {
  carbonGrams: number;
  carbonLbs: number;
  carbonKg: number;
  carbonMt: number;
  estimatedAt: Date;
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

// Vehicle Make and Model API functions
export async function getVehicleMakes(): Promise<VehicleMake[]> {
  const endpoint = `/vehicle/makes`;
  const url = getApiUrl(endpoint);
  logApiCall("GET", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch vehicle makes: ${errorText}`);
  }

  return await response.json();
}

export async function getVehicleModels(
  makeId: string
): Promise<VehicleModel[]> {
  const endpoint = `/vehicle/makes/${makeId}/models`;
  const url = getApiUrl(endpoint);
  logApiCall("GET", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch vehicle models: ${errorText}`);
  }

  return await response.json();
}

// API Functions
export async function estimateVehicleEmissions(
  data: VehicleEmissionRequest
): Promise<CarbonEstimationResult> {
  const endpoint = `/vehicle/estimate`;
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
  const endpoint = `/flight/estimate`;
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
  const endpoint = `/electricity/estimate`;
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

/**
 * Fetch all estimation history records
 */
export async function getEstimationHistory(): Promise<EstimationRecord[]> {
  const endpoint = `/history`;
  const url = getApiUrl(endpoint);
  logApiCall("GET", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch estimation history: ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch a specific estimation record by ID
 */
export async function getEstimationById(id: string): Promise<EstimationRecord> {
  const endpoint = `/history/${id}`;
  const url = getApiUrl(endpoint);
  logApiCall("GET", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch estimation record: ${errorText}`);
  }

  return response.json();
}

// Add the EstimationRecord type
export interface EstimationRecord {
  id: string;
  timestamp: string;
  estimation: CarbonEstimationResult;
}
