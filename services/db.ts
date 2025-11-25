import { 
  collection, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Asset, Contract, WorkOrder, Client, Invoice, InventoryItem, TeamMember, Expense, Report, Role, User as AppUser } from '../types';
import { User } from 'firebase/auth';
import { 
  MOCK_ASSETS, MOCK_CONTRACTS, MOCK_WORK_ORDERS, MOCK_CLIENTS, 
  MOCK_INVOICES, MOCK_INVENTORY, MOCK_TEAM, MOCK_EXPENSES, MOCK_REPORTS 
} from '../constants';

// --- Generic Fetcher ---
export const fetchCollection = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
};

// --- User Management ---
export const syncUser = async (user: User): Promise<Role> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      return snap.data().role as Role;
    } else {
      // First time login - Create profile
      // For this prototype, we default everyone to ADMIN so you can see all features immediately.
      // In a real app, you might default to CLIENT or require manual approval.
      const newRole = Role.ADMIN; 
      await setDoc(userRef, { 
        email: user.email, 
        role: newRole,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        createdAt: new Date().toISOString() 
      });
      return newRole;
    }
  } catch (e) {
    console.error("Error syncing user:", e);
    return Role.PUBLIC;
  }
};

// --- Seeding Utility ---
// This function uploads the constants.ts mock data to Firestore 
// so the user has data to work with immediately.
export const seedDatabase = async () => {
  const batch = writeBatch(db);

  const seed = async (name: string, data: any[]) => {
    const colRef = collection(db, name);
    // Check if empty to avoid duplicates (simple check)
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) return; 

    data.forEach(item => {
      const docRef = doc(colRef, item.id || undefined); // Use ID if present, else auto-ID
      batch.set(docRef, item);
    });
  };

  await seed('assets', MOCK_ASSETS);
  await seed('contracts', MOCK_CONTRACTS);
  await seed('work_orders', MOCK_WORK_ORDERS);
  await seed('clients', MOCK_CLIENTS);
  await seed('invoices', MOCK_INVOICES);
  await seed('inventory', MOCK_INVENTORY);
  await seed('team', MOCK_TEAM);
  await seed('expenses', MOCK_EXPENSES);
  await seed('reports', MOCK_REPORTS);

  await batch.commit();
  console.log("Database seeded successfully!");
};

// --- Assets ---
export const getAssets = () => fetchCollection<Asset>('assets');
export const updateAssetStatus = async (id: string, status: string) => {
  const ref = doc(db, 'assets', id);
  await updateDoc(ref, { status });
};
export const addAsset = async (asset: Omit<Asset, 'id'>) => {
  await addDoc(collection(db, 'assets'), asset);
};

// --- Work Orders ---
export const getWorkOrders = () => fetchCollection<WorkOrder>('work_orders');
export const createWorkOrder = async (wo: WorkOrder) => {
  if(wo.id) {
    await setDoc(doc(db, 'work_orders', wo.id), wo);
  } else {
    await addDoc(collection(db, 'work_orders'), wo);
  }
};

// --- Contracts ---
export const getContracts = () => fetchCollection<Contract>('contracts');
export const createContract = async (contract: Contract) => {
    await setDoc(doc(db, 'contracts', contract.id), contract);
};

// --- Clients ---
export const getClients = () => fetchCollection<Client>('clients');

// --- Inventory ---
export const getInventory = () => fetchCollection<InventoryItem>('inventory');

// --- Accounts ---
export const getInvoices = () => fetchCollection<Invoice>('invoices');
export const getExpenses = () => fetchCollection<Expense>('expenses');

// --- Team ---
export const getTeam = () => fetchCollection<TeamMember>('team');

// --- Reports ---
export const getReports = () => fetchCollection<Report>('reports');