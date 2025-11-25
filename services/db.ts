
import { 
  collection, getDocs, doc, setDoc, addDoc, updateDoc, writeBatch, query, where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { Role, Customer, Site, Equipment, AMCContract, JobCard, Project, Item, Account, JournalEntry, Invoice, Report, Expense, TeamMember } from '../types';
import { 
  MOCK_CUSTOMERS, MOCK_SITES, MOCK_EQUIPMENT, MOCK_AMC_CONTRACTS, MOCK_JOBS, 
  MOCK_PROJECTS, MOCK_ITEMS, MOCK_ACCOUNTS, MOCK_JOURNALS, MOCK_INVOICES,
  MOCK_REPORTS, MOCK_EXPENSES, MOCK_TEAM
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

// --- User Role Sync ---
export const syncUser = async (user: User): Promise<Role> => {
  return Role.ADMIN; // Default for prototype
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

  await seed('customers', MOCK_CUSTOMERS);
  await seed('sites', MOCK_SITES);
  await seed('equipment', MOCK_EQUIPMENT);
  await seed('amc_contracts', MOCK_AMC_CONTRACTS);
  await seed('job_cards', MOCK_JOBS);
  await seed('projects', MOCK_PROJECTS);
  await seed('items', MOCK_ITEMS);
  await seed('accounts', MOCK_ACCOUNTS);
  await seed('journals', MOCK_JOURNALS);
  await seed('invoices', MOCK_INVOICES);
  await seed('reports', MOCK_REPORTS);
  await seed('expenses', MOCK_EXPENSES);
  await seed('team', MOCK_TEAM);

  await batch.commit();
  console.log("Database seeded with Enterprise schema!");
};

// --- Module Fetchers ---
export const getCustomers = () => fetchCollection<Customer>('customers');
export const getSites = () => fetchCollection<Site>('sites');
export const getEquipment = () => fetchCollection<Equipment>('equipment');
export const getAMCContracts = () => fetchCollection<AMCContract>('amc_contracts');
export const getJobs = () => fetchCollection<JobCard>('job_cards');
export const getProjects = () => fetchCollection<Project>('projects');
export const getInventory = () => fetchCollection<Item>('items');
export const getAccounts = () => fetchCollection<Account>('accounts');
export const getJournals = () => fetchCollection<JournalEntry>('journals');
export const getInvoices = () => fetchCollection<Invoice>('invoices');
export const getReports = () => fetchCollection<Report>('reports');
export const getExpenses = () => fetchCollection<Expense>('expenses');
export const getTeam = () => fetchCollection<TeamMember>('team');

// --- Helper: Create Job ---
export const createJobCard = async (job: JobCard) => {
  if (job.id) await setDoc(doc(db, 'job_cards', job.id), job);
  else await addDoc(collection(db, 'job_cards'), job);
};
