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
