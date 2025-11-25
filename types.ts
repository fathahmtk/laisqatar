

export enum Role {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
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

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED'
}

export interface Contract {
  id: string;
  clientName: string;
  type: 'AMC Gold' | 'AMC Silver' | 'Emergency Only';
  startDate: string;
  endDate: string;
  status: ContractStatus;
  value: number;
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
}

export interface Report {
  id: string;
  title: string;
  type: 'Compliance' | 'Audit' | 'Financial' | 'Maintenance';
  date: string;
  status: 'Ready' | 'Processing';
  size: string;
}

export enum WorkOrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum WorkOrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface WorkOrder {
  id: string;
  title: string;
  location: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  date: string;
  assignedTo?: string;
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

export type NotificationType = 'SLA_BREACH' | 'INFO' | 'WARNING' | 'SUCCESS';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  items: string[]; 
}

export interface Expense {
  id: string;
  category: 'Materials' | 'Logistics' | 'Salaries' | 'Utilities';
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  unitPrice: number;
  location: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Operations' | 'Sales' | 'Management' | 'Field Service';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  avatar?: string;
}

export type Language = 'en' | 'ar';

export interface Translation {
  [key: string]: {
    en: string;
    ar: string;
  };
}