
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Helper to get auth headers with a token
const getAuthHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // For production, this token would come from localStorage or HttpOnly cookie
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanBase = API_BASE.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${cleanBase}/${cleanEndpoint}/`; // Django REST Framework often uses trailing slashes
  
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
      // If auth fails, redirect to login
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

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
  // Auth
  login: (credentials: { username: string, password: string }) => 
    apiFetch<{ access: string, refresh: string }>('token/', { method: 'POST', body: JSON.stringify(credentials) }),

  // Masters
  listCustomers: () => apiFetch<any[]>('customers'),
  createCustomer: (data: any) => apiFetch<any>('customers', { method: 'POST', body: JSON.stringify(data) }),
  listSites: () => apiFetch<any[]>('sites'),
  createSite: (data: any) => apiFetch<any>('sites', { method: 'POST', body: JSON.stringify(data) }),
  listEquipment: () => apiFetch<any[]>('equipment'),
  
  // AMC
  listAMC: () => apiFetch<any[]>('amc-contracts'),
  createAMC: (data: any) => apiFetch<any>('amc-contracts', { method: 'POST', body: JSON.stringify(data) }),
  
  // Jobs
  listJobs: () => apiFetch<any[]>('job-cards'),
  createJob: (data: any) => apiFetch<any>('job-cards', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id: string, data: any) => apiFetch<any>(`job-cards/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  
  // Projects
  listProjects: () => apiFetch<any[]>('projects'),
  
  // Finance
  listInvoices: () => apiFetch<any[]>('sales-invoices'),
  listAccounts: () => apiFetch<any[]>('accounts'),
  listJournals: () => apiFetch<any[]>('journal-entries'),
  listExpenses: () => apiFetch<any[]>('purchase-invoices'),

  // Inventory
  listInventory: () => apiFetch<any[]>('items'),

  // Team
  listTeam: () => apiFetch<any[]>('technicians'),
  
  // Reports (Placeholder)
  listReports: () => Promise.resolve([]),
};
