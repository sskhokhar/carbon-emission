import type {
  CarbonEstimationResult,
  ElectricityEmissionRequest,
  FlightEmissionRequest,
  VehicleEmissionRequest,
  VehicleMake,
  VehicleModel,
} from "../interfaces";
import { makeEstimationRequest,makeGetRequest } from "./api-helpers";

export async function getVehicleMakes(): Promise<VehicleMake[]> {
  return makeGetRequest<VehicleMake[]>("/vehicle/makes");
}

export async function getVehicleModels(makeId: string): Promise<VehicleModel[]> {
  return makeGetRequest<VehicleModel[]>(`/vehicle/makes/${makeId}/models`);
}

export async function estimateVehicleEmissions(
  data: VehicleEmissionRequest
): Promise<CarbonEstimationResult> {
  return makeEstimationRequest<VehicleEmissionRequest, CarbonEstimationResult>(
    "/vehicle/estimate",
    data
  );
}

export async function estimateFlightEmissions(
  data: FlightEmissionRequest
): Promise<CarbonEstimationResult> {
  return makeEstimationRequest<FlightEmissionRequest, CarbonEstimationResult>(
    "/flight/estimate",
    data
  );
}

export async function estimateElectricityEmissions(
  data: ElectricityEmissionRequest
): Promise<CarbonEstimationResult> {
  return makeEstimationRequest<ElectricityEmissionRequest, CarbonEstimationResult>(
    "/electricity/estimate",
    data
  );
}
