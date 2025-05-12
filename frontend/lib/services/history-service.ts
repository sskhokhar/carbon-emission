import type { EstimationRecord } from "../interfaces";
import { makeDeleteRequest,makeGetRequest } from "./api-helpers";

export async function getEstimationHistory(): Promise<EstimationRecord[]> {
  return makeGetRequest<EstimationRecord[]>("/history");
}

export async function getEstimationById(id: string): Promise<EstimationRecord> {
  return makeGetRequest<EstimationRecord>(`/history/${id}`);
}

export async function clearEstimationHistory(): Promise<void> {
  return makeDeleteRequest("/history/clear");
}
