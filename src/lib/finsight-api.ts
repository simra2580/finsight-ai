const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

let token: string | null = null;

export type ApiResponse<T> = { success: boolean; data?: T; error?: { code: string; message: string } };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || body.success === false) {
    throw new Error(body.error?.message || `FinSight API error (${response.status})`);
  }
  return body.data as T;
}

export async function finsightDemoLogin(email = "demo@finsight.local") {
  const data = await request<{ token: string; user: { id: string; business_id: string; role: string; email: string } }>(
    "/auth/demo-login",
    { method: "POST", body: JSON.stringify({ email, business_id: "demo-business" }) },
  );
  token = data.token;
  if (typeof window !== "undefined") localStorage.setItem("finsight_api_token", token);
  return data;
}

export async function finsightHealth() {
  const response = await fetch(`${API_BASE.replace(/\/api$/, "")}/health`);
  return response.ok;
}

export async function analyzePayment(input: {
  amount: number;
  currency: string;
  destination_account: string;
  due_date?: string;
}) {
  if (!token && typeof window !== "undefined") token = localStorage.getItem("finsight_api_token");
  if (!token) await finsightDemoLogin();
  return request<{ risk_score: number; risk_level: string; reasons: string[]; signals: unknown[] }>(
    "/risk/analyze",
    { method: "POST", body: JSON.stringify(input) },
  );
}
