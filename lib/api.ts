export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<{ ok: boolean; status: number; body: T }> {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as T;
  return { ok: response.ok, status: response.status, body: payload };
}
