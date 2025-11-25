
---

## 3️⃣ API client scaffold – so you can plug into your backend

Create a new file **`services/api.ts`** (or replace if already exists) with this:

```ts
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // if you use cookie-based auth; remove if token-based
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const Api = {
  // Customers
  listCustomers: () => apiFetch("/customers/"),
  getCustomer: (id: number | string) => apiFetch(`/customers/${id}/`),
  createCustomer: (data: any) =>
    apiFetch("/customers/", { method: "POST", body: JSON.stringify(data) }),

  // Sites
  listSites: () => apiFetch("/sites/"),

  // AMC
  listAmcContracts: () => apiFetch("/amc-contracts/"),
  getAmcContract: (id: number | string) => apiFetch(`/amc-contracts/${id}/`),
  listAmcSchedules: (params?: string) =>
    apiFetch(`/amc-schedules/${params ? `?${params}` : ""}`),

  // Job Cards
  listJobCards: (params?: string) =>
    apiFetch(`/job-cards/${params ? `?${params}` : ""}`),
  getJobCard: (id: number | string) => apiFetch(`/job-cards/${id}/`),

  // Projects
  listProjects: () => apiFetch("/projects/"),
  getProject: (id: number | string) => apiFetch(`/projects/${id}/`),

  // Inventory
  listItems: () => apiFetch("/items/"),
  listWarehouses: () => apiFetch("/warehouses/"),

  // Finance sample endpoints
  listSalesInvoices: () => apiFetch("/sales-invoices/"),
  listPurchaseInvoices: () => apiFetch("/purchase-invoices/"),

  // Auth placeholder
  login: (payload: { username: string; password: string }) =>
    apiFetch("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
