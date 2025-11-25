
export enum Role {
  ADMIN = 'ADMIN',
  OPERATIONS = 'OPERATIONS',
  TECHNICIAN = 'TECHNICIAN',
  SALES = 'SALES',
  ACCOUNTS = 'ACCOUNTS',
  STOREKEEPER = 'STOREKEEPER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  PUBLIC = 'PUBLIC'
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
}

// --- 1. MASTERS ---
export interface Customer {
  id: string;
  code: string;
  name: string;
  type: 'Corporate' | 'Individual' | 'Government' | 'Industrial';
  crNumber?: string;
  email: string;
  phone: string;
  address: string;
  paymentTermsDays: number;
  creditLimit: number;
}

export interface Site {
  id: string;
  customerId: string;
  name: string;
  code: string;
  address: string;
  category: 'Commercial' | 'Industrial' | 'Residential';
  contactPerson: string;
  contactMobile: string;
}

export interface Equipment {
  id: string;
  siteId: string;
  code: string;
  category: 'Extinguisher' | 'Fire Alarm Panel' | 'Pump' | 'Sprinkler' | 'Detector';
  brand: string;
  model: string;
  serialNumber: string;
  installDate: string;
  nextServiceDue: string;
  isUnderAmc: boolean;
}

export interface Technician {
  id: string;
  userId: string; // Link to login user
  name: string;
  mobile: string;
  qualification: string;
  qidNumber: string;
}

// --- 2. AMC MODULE ---
export interface AMCContract {
  id: string;
  code: string;
  customerId: string;
  startDate: string;
  endDate: string;
  frequency: 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';
  contractValue: number;
  billingCycle: 'Monthly' | 'Quarterly' | 'Annual';
  status: 'Draft' | 'Active' | 'Expired' | 'Terminated';
  sites: string[]; // Site IDs
}

export interface AMCSchedule {
  id: string;
  contractId: string;
  siteId: string;
  plannedDate: string;
  jobCardId?: string;
  status: 'Planned' | 'JobCreated' | 'Completed' | 'Skipped';
}

// --- 3. JOB CARDS ---
export interface JobCard {
  id: string;
  jobNumber: string;
  type: 'Preventive' | 'Corrective' | 'Installation';
  customerId: string;
  siteId: string;
  contractId?: string; // If AMC
  projectId?: string; // If Project
  priority: 'Critical' | 'High' | 'Normal';
  status: 'Open' | 'InProgress' | 'Completed' | 'Verified' | 'Closed';
  scheduledDate: string;
  assignedTechnicianId?: string;
  description: string;
  findings?: string;
  customerSignature?: string;
  isAmcCovered: boolean;
  completionDate?: string;
  checklist?: { item: string; checked: boolean }[];
}

// --- 4. PROJECTS ---
export interface Project {
  id: string;
  code: string;
  name: string;
  customerId: string;
  siteId?: string;
  startDate: string;
  endDate?: string;
  value: number;
  budget: number; // Material + Labour + Subcon
  totalCost: number; // Calculated
  status: 'Planning' | 'InProgress' | 'Completed' | 'Closed';
  managerId: string;
}

export interface ProjectBOQItem {
  id: string;
  projectId: string;
  description: string;
  qtyEstimated: number;
  unitCostEstimated: number;
  unitPriceEstimated: number;
}

// --- 5. INVENTORY ---
export interface Item {
  id: string;
  code: string;
  name: string;
  category: string;
  stockQty: number;
  minLevel: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
}

export interface StockMovement {
  id: string;
  type: 'GRN' | 'ISSUE' | 'RETURN';
  itemId: string;
  qty: number;
  date: string;
  referenceType: 'Job' | 'Project' | 'PO';
  referenceId: string;
}

// --- 6. ACCOUNTING ---
export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: 'Draft' | 'Posted';
  lines: {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  status: 'Draft' | 'Posted' | 'Paid' | 'Overdue';
  items: { description: string; amount: number }[];
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  approvedBy: string;
}

// --- 7. REPORTS ---
export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
  status: 'Ready' | 'Processing';
}

// --- 8. TEAM ---
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  email: string;
  phone: string;
}

// --- GENERAL ---
export type Language = 'en' | 'ar';
export interface Translation { [key: string]: { en: string; ar: string; }; }
export interface Notification { 
  id: string; 
  title: string; 
  message: string; 
  read: boolean;
  type?: 'SLA_BREACH' | 'INFO';
  timestamp?: string;
}
