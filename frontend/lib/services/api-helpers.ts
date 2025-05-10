const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isDevelopment = process.env.NEXT_PUBLIC_ENV === "development";

export const logApiCall = (
  method: string,
  endpoint: string,
  data?: unknown
) => {
  if (isDevelopment) {
    console.log(`🔽 API ${method} ${endpoint}`, data ? data : "");
  }
};

export const getApiUrl = (path: string): string => {
  return `${API_URL}${path}`;
};

export async function makeGetRequest<T>(endpoint: string): Promise<T> {
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
    throw new Error(`Failed to fetch data: ${errorText}`);
  }

  return await response.json();
}

export async function makeDeleteRequest(endpoint: string): Promise<void> {
  const url = getApiUrl(endpoint);
  logApiCall("DELETE", url);

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete resource: ${errorText}`);
  }
}

export async function makeEstimationRequest<T, R>(
  endpoint: string,
  data: T
): Promise<R> {
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
    throw new Error(`Failed to calculate emissions: ${errorText}`);
  }

  const result = await response.json();

  if (result.estimatedAt && typeof result.estimatedAt === "string") {
    result.estimatedAt = new Date(result.estimatedAt);
  }

  return result;
}
