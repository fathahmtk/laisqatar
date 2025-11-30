// #####################################################################
// # DEPRECATED - DO NOT USE
// # This application has been migrated to use the Django REST API.
// # All new data fetching logic should be added to `services/api.ts`.
// # This file is kept for historical reference only and will be removed.
// #####################################################################

import { 
  collection, getDocs, doc, setDoc, addDoc, updateDoc, writeBatch, query, where
} from 'firebase/firestore';
// Fix: Commented out unused import from a non-existent module.
// import { db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { Role, Customer, Site, Equipment, AMCContract, JobCard, Project, Item, Account, JournalEntry, Invoice, Report, Expense, TeamMember } from '../types';
import { 
  MOCK_CUSTOMERS, MOCK_SITES, MOCK_EQUIPMENT, MOCK_AMC_CONTRACTS, MOCK_JOBS, 
  MOCK_PROJECTS, MOCK_ITEMS, MOCK_ACCOUNTS, MOCK_JOURNALS, MOCK_INVOICES,
  MOCK_REPORTS, MOCK_EXPENSES, MOCK_TEAM
} from '../constants';

export const fetchCollection = async <T>(collectionName: string): Promise<T[]> => { return []; };
export const updateDocument = async (collectionName: string, id: string, data: any) => { return true; };
export const syncUser = async (user: User): Promise<Role> => { return Role.ADMIN; };
export const seedDatabase = async () => {};
export const getCustomers = () => Promise.resolve([]);
export const getSites = () => Promise.resolve([]);
export const getEquipment = () => Promise.resolve([]);
export const getAMCContracts = () => Promise.resolve([]);
export const getJobs = () => Promise.resolve([]);
export const getProjects = () => Promise.resolve([]);
export const getInventory = () => Promise.resolve([]);
export const getAccounts = () => Promise.resolve([]);
export const getJournals = () => Promise.resolve([]);
export const getInvoices = () => Promise.resolve([]);
export const getReports = () => Promise.resolve([]);
export const getExpenses = () => Promise.resolve([]);
export const getTeam = () => Promise.resolve([]);
export const createJobCard = async (job: JobCard) => {};
export const updateJobStatus = (id: string, status: string, data?: any) => {};
export const createCustomer = async (customer: Omit<Customer, 'id'>) => { return {} as Customer };
export const createSite = async (site: Omit<Site, 'id'>) => { return {} as Site };