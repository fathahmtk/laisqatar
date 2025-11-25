

import { 
  collection, getDocs, doc, setDoc, addDoc, updateDoc, writeBatch 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Asset, Contract, WorkOrder, Client, Invoice, InventoryItem, TeamMember, Report, Role, Account, JournalEntry, Project, Expense } from '../types';
import { User } from 'firebase/auth';
import { 
  MOCK_ASSETS, MOCK_CONTRACTS, MOCK_WORK_ORDERS, MOCK_CLIENTS, 
  MOCK_INVOICES, MOCK_INVENTORY, MOCK_TEAM, MOCK_REPORTS, MOCK_ACCOUNTS, MOCK_JOURNALS, MOCK_PROJECTS, MOCK_EXPENSES 
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
  // In a real app, check DB. For prototype, assign Admin to see all features.
  return Role.ADMIN; 
};

// --- Seeding ---
export const seedDatabase = async () => {
  const batch = writeBatch(db);
  const seed = async (name: string, data: any[]) => {
    const colRef = collection(db, name);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) return; 
    data.forEach(item => {
      const docRef = doc(colRef, item.id || undefined);
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
  await seed('reports', MOCK_REPORTS);
  await seed('accounts', MOCK_ACCOUNTS);
  await seed('journals', MOCK_JOURNALS);
  await seed('projects', MOCK_PROJECTS);
  await seed('expenses', MOCK_EXPENSES);

  await batch.commit();
  console.log("Database seeded successfully!");
};

// --- Getters ---
export const getAssets = () => fetchCollection<Asset>('assets');
export const updateAssetStatus = async (id: string, status: string) => {
  const ref = doc(db, 'assets', id);
  await updateDoc(ref, { status });
};
export const addAsset = async (asset: Omit<Asset, 'id'>) => {
  await addDoc(collection(db, 'assets'), asset);
};
export const getWorkOrders = () => fetchCollection<WorkOrder>('work_orders');
export const createWorkOrder = async (wo: WorkOrder) => {
  if(wo.id) await setDoc(doc(db, 'work_orders', wo.id), wo);
  else await addDoc(collection(db, 'work_orders'), wo);
};
export const getContracts = () => fetchCollection<Contract>('contracts');
export const getClients = () => fetchCollection<Client>('clients');
export const getInventory = () => fetchCollection<InventoryItem>('inventory');
export const getInvoices = () => fetchCollection<Invoice>('invoices');
export const getTeam = () => fetchCollection<TeamMember>('team');
export const getReports = () => fetchCollection<Report>('reports');

// --- New Modules ---
export const getAccounts = () => fetchCollection<Account>('accounts');
export const getJournals = () => fetchCollection<JournalEntry>('journals');
export const getProjects = () => fetchCollection<Project>('projects');
export const getExpenses = () => fetchCollection<Expense>('expenses');