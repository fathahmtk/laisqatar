
export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  OPERATIONS = 'OPERATIONS',
  TECHNICIAN = 'TECHNICIAN',
  ACCOUNTS = 'ACCOUNTS',
  CLIENT = 'CLIENT',
  PUBLIC = 'PUBLIC'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

// --- AMC & CONTRACTS ---
export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  type: 'AMC Gold' | 'AMC Silver' | 'Emergency Only';
  startDate: string;
  endDate: string;
  status: ContractStatus;
  value: number;
  paymentTerms: string;
  visitsPerYear: number;
  slaResponseTimeHours: number;
  assetsCount: number;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  contractStatus: ContractStatus;
  balance: number; // AR Balance
}

// --- JOBS & TECH ---
export enum WorkOrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum WorkOrderStatus {
  OPEN = 'OPEN',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BILLED = 'BILLED'
}

export interface WorkOrder {
  id: string;
  projectId?: string; // Link to project if applicable
  contractId?: string; // Link to AMC if applicable
  title: string;
  type: 'Preventive' | 'Corrective' | 'Installation' | 'Emergency';
  location: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  date: string;
  assignedTo?: string;
  checklist?: { item: string; checked: boolean }[];
  findings?: string;
  partsUsed?: { itemId: string; name: string; qty: number }[];
  customerSignature?: string; // Base64
  photos?: string[];
  startTime?: string;
  endTime?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  lastInspection: string;
  nextInspection: string;
  status: 'Operational' | 'Maintenance Required' | 'Defective';
}

// --- INVENTORY ---
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  unitPrice: number; // Cost Price
  salesPrice: number; // Selling Price
  location: string;
}

// --- ACCOUNTING ---
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  parentAccount?: string;
}

export interface JournalEntryLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  lines: JournalEntryLine[];
  status: 'Posted' | 'Draft';
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  approvedBy: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  items: { description: string; amount: number }[]; 
}

// --- PROJECTS ---
export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  budget: number;
  totalCost: number; // Calculated
  manager: string;
  progress: number;
}

export interface BOQItem {
  id: string;
  projectId: string;
  description: string;
  unit: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface ProjectCost {
  id: string;
  projectId: string;
  date: string;
  type: 'Material' | 'Labor' | 'Subcontractor' | 'Overhead';
  description: string;
  amount: number;
}

// --- GENERAL ---
export interface Report {
  id: string;
  title: string;
  type: 'Compliance' | 'Audit' | 'Financial' | 'Maintenance';
  date: string;
  status: 'Ready' | 'Processing';
  size: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Operations' | 'Sales' | 'Management' | 'Field Service' | 'Accounts';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

export type NotificationType = 'SLA_BREACH' | 'INFO' | 'WARNING' | 'SUCCESS';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

export type Language = 'en' | 'ar';

export interface Translation {
  [key: string]: {
    en: string;
    ar: string;
  };
}