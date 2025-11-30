
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const API_USER = (import.meta as any).env?.VITE_API_AUTH_USER || "admin";
const API_PASS = (import.meta as any).env?.VITE_API_AUTH_PASS || "password";

// Helper to create Basic Auth header
const getAuthHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Only add Basic Auth if credentials exist (for dev mode)
  if (API_USER && API_PASS) {
    headers['Authorization'] = 'Basic ' + btoa(`${API_USER}:${API_PASS}`);
  }
  
  return headers;
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Remove trailing slash from base if present and leading from endpoint
  const cleanBase = API_BASE.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${cleanBase}/${cleanEndpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // Return empty object for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

// --- Typed API Methods ---

export const Api = {
  // Masters
  listCustomers: () => apiFetch<any[]>('customers/'),
  getCustomer: (id: number) => apiFetch<any>(`customers/${id}/`),
  createCustomer: (data: any) => apiFetch<any>('customers/', { method: 'POST', body: JSON.stringify(data) }),
  
  listSites: () => apiFetch<any[]>('sites/'),
  createSite: (data: any) => apiFetch<any>('sites/', { method: 'POST', body: JSON.stringify(data) }),

  listEquipment: () => apiFetch<any[]>('equipment/'),
  
  // AMC
  listAMC: () => apiFetch<any[]>('amc-contracts/'),
  createAMC: (data: any) => apiFetch<any>('amc-contracts/', { method: 'POST', body: JSON.stringify(data) }),
  
  // Jobs
  listJobs: () => apiFetch<any[]>('job-cards/'),
  createJob: (data: any) => apiFetch<any>('job-cards/', { method: 'POST', body: JSON.stringify(data) }),
  
  // Projects
  listProjects: () => apiFetch<any[]>('projects/'),
  
  // Finance
  listInvoices: () => apiFetch<any[]>('sales-invoices/'),
  listAccounts: () => apiFetch<any[]>('accounts/'),
  listJournals: () => apiFetch<any[]>('journal-entries/'),
  listExpenses: () => apiFetch<any[]>('purchase-invoices/'), // Mapping expenses to Purchase Invoices for now or create a separate endpoint if model exists

  // Inventory
  listInventory: () => apiFetch<any[]>('items/'),

  // Team
  listTeam: () => apiFetch<any[]>('technicians/'),
};