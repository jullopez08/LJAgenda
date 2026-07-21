const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Error ${response.status} al consumir ${endpoint}`,
    );
  }

  return response.json();
}