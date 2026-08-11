import { API_BASE_URL } from "@/constants";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("ascend_session") : null;
    const customHeaders = (options?.headers || {}) as Record<string, string>;

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...customHeaders,
      },
    });

    if (!res.ok) {
      console.warn(`API error for ${endpoint}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`Failed to connect to API endpoint ${endpoint}:`, err);
    return null;
  }
}
