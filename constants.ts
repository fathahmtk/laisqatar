

import { Contract, ContractStatus, WorkOrder, WorkOrderPriority, WorkOrderStatus, Asset, Translation, Role, Client, Report, Notification, Invoice, InventoryItem, TeamMember, Account, JournalEntry, Project, BOQItem, ProjectCost, Expense } from './types';

export const TEXTS: Translation = {
  brand: { en: "Lais Qatar", ar: "ليس قطر" },
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About Us", ar: "من نحن" },
  services: { en: "Services", ar: "خدماتنا" },
  projects: { en: "Projects", ar: "المشاريع" },
  contact: { en: "Contact Us", ar: "اتصل بنا" },
  login: { en: "Sign In", ar: "تسجيل الدخول" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  
  heroTitle: { en: "Advanced Fire & Safety Solutions", ar: "حلول متقدمة للأمن والسلامة" },
  heroSubtitle: {
    en: "Qatar’s premier provider of fire protection systems, installation, and AMC services.",
    ar: "المزود الرائد في قطر لأنظمة الحماية من الحريق والتركيب وعقود الصيانة."
  },
  getQuote: { en: "Request Quote", ar: "اطلب عرض سعر" },
  learnMore: { en: "Learn More", ar: "المزيد" },

  dashboard_nav: { en: "Dashboard", ar: "لوحة التحكم" },
  accounts_nav: { en: "Finance", ar: "المالية" },
  inventory_nav: { en: "Inventory", ar: "المخزون" },
  team_nav: { en: "HR & Team", ar: "الموارد البشرية" },
  contracts_nav: { en: "AMC Contracts", ar: "عقود الصيانة" },
  clients_nav: { en: "CRM", ar: "العملاء" },
  assets_nav: { en: "Assets", ar: "الأصول" },
  workOrders_nav: { en: "Jobs", ar: "الوظائف" },
  projects_nav: { en: "Projects", ar: "المشاريع" },
  reports_nav: { en: "Reports", ar: "التقارير" },
  settings_nav: { en: "Settings", ar: "الإعدادات" },
  
  faqTitle: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  testimonials: { en: "Trusted by Leaders", ar: "موثوق من قبل القادة" },
  statsClients: { en: "Active Clients", ar: "عملاء نشطين" },
  statsProjects: { en: "Projects Completed", ar: "مشاريع مكتملة" },
  statsTechs: { en: "Certified Technicians", ar: "فنيين معتمدين" },
  ctaTitle: { en: "Ready to Secure Your Facility?", ar: "هل أنت مستعد لتأمين منشأتك؟" },
  ctaSubtitle: { en: "Get a free site survey today.", ar: "احصل على مسح مجاني للموقع اليوم." },
};

// --- MOCK DATA ---

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1000', code: '1000', name: 'Cash on Hand', type: 'Asset', balance: 5000 },
  { id: '1010', code: '1010', name: 'Qatar National Bank', type: 'Asset', balance: 150000 },
  { id: '1100', code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 45000 },
  { id: '1200', code: '1200', name: 'Inventory Asset', type: 'Asset', balance: 75000 },
  { id: '1500', code: '1500', name: 'Vehicles & Equipment', type: 'Asset', balance: 200000 },
  { id: '2000', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 30000 },
  { id: '2100', code: '2100', name: 'VAT Payable', type: 'Liability', balance: 4500 },
  { id: '3000', code: '3000', name: 'Owner Equity', type: 'Equity', balance: 100000 },
  { id: '4000', code: '4000', name: 'Sales Revenue - Projects', type: 'Revenue', balance: 0 },
  { id: '4100', code: '4100', name: 'Sales Revenue - AMC', type: 'Revenue', balance: 0 },
  { id: '5000', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 0 },
  { id: '6000', code: '6000', name: 'Salaries & Wages', type: 'Expense', balance: 0 },
  { id: '6100', code: '6100', name: 'Rent Expense', type: 'Expense', balance: 0 },
  { id: '6200', code: '6200', name: 'Vehicle Fuel', type: 'Expense', balance: 0 },
];

export const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: 'JE-001', date: '2024-05-01', description: 'Opening Balance', reference: 'OB-2024', status: 'Posted',
    lines: [
      { accountId: '1010', accountName: 'Qatar National Bank', debit: 150000, credit: 0 },
      { accountId: '3000', accountName: 'Owner Equity', debit: 0, credit: 150000 }
    ]
  },
  {
    id: 'JE-002', date: '2024-05-02', description: 'Project Material Purchase', reference: 'INV-SUP-99', status: 'Posted',
    lines: [
      { accountId: '1200', accountName: 'Inventory Asset', debit: 5000, credit: 0 },
      { accountId: '2000', accountName: 'Accounts Payable', debit: 0, credit: 5000 }
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'PRJ-2024-01', name: 'Mall of Qatar Fire System Upgrade', clientId: 'CL-001', clientName: 'Mall of Qatar', status: 'In Progress', startDate: '2024-01-10', endDate: '2024-08-30', budget: 500000, totalCost: 125000, manager: 'Eng. Karim', progress: 35 },
  { id: 'PRJ-2024-02', name: 'Pearl Tower B Installation', clientId: 'CL-003', clientName: 'Pearl Residency', status: 'Planning', startDate: '2024-06-01', endDate: '2024-12-01', budget: 850000, totalCost: 5000, manager: 'Eng. John', progress: 5 }
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'AMC-2024-001', clientId: 'CL-001', clientName: 'Al Hamad Towers', type: 'AMC Gold', startDate: '2024-01-01', endDate: '2025-01-01', status: ContractStatus.ACTIVE, value: 45000, assetsCount: 120, paymentTerms: 'Quarterly', visitsPerYear: 4, slaResponseTimeHours: 2 },
  { id: 'AMC-2024-002', clientId: 'CL-002', clientName: 'Doha Logistics Hub', type: 'AMC Silver', startDate: '2024-02-15', endDate: '2025-02-15', status: ContractStatus.ACTIVE, value: 25000, assetsCount: 45, paymentTerms: 'Bi-Annual', visitsPerYear: 2, slaResponseTimeHours: 4 },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-1023', title: 'Fire Alarm Loop Failure', type: 'Corrective', location: 'Al Hamad Towers - Floor 3', priority: WorkOrderPriority.CRITICAL, status: WorkOrderStatus.OPEN, date: '2024-05-10', assignedTo: 'Ahmed Ali' },
  { id: 'WO-1024', title: 'Quarterly Sprinkler Check', type: 'Preventive', contractId: 'AMC-2024-002', location: 'Doha Logistics Hub', priority: WorkOrderPriority.MEDIUM, status: WorkOrderStatus.IN_PROGRESS, date: '2024-05-11', assignedTo: 'John Doe', checklist: [{item: 'Pressure Gauge', checked: true}, {item: 'Valve Status', checked: false}] },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'CL-001', name: 'Al Hamad Towers', contactPerson: 'Mr. Khalid', email: 'khalid@alhamad.qa', phone: '+974 5555 1234', location: 'West Bay', contractStatus: ContractStatus.ACTIVE, balance: 12500 },
  { id: 'CL-002', name: 'Doha Logistics Hub', contactPerson: 'Ms. Sarah', email: 'sarah@dohalog.qa', phone: '+974 6666 9876', location: 'Industrial Area', contractStatus: ContractStatus.ACTIVE, balance: 0 },
  { id: 'CL-003', name: 'Pearl Residency', contactPerson: 'Mr. John', email: 'john@pearlres.qa', phone: '+974 3333 4567', location: 'The Pearl', contractStatus: ContractStatus.PENDING, balance: 45000 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', clientId: 'CL-001', clientName: 'Al Hamad Towers', issueDate: '2024-04-25', dueDate: '2024-05-25', amount: 12500, status: 'PENDING', items: [{description: 'Q2 AMC Payment', amount: 12000}, {description: 'Spare Parts', amount: 500}] },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '2024-05-15', description: 'Office Supplies', category: 'Office', amount: 450, approvedBy: 'John Smith' },
  { id: 'EXP-002', date: '2024-05-18', description: 'Vehicle Maintenance', category: 'Transport', amount: 1200, approvedBy: 'Ahmed Ali' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'PART-001', sku: 'SD-OPT-01', name: 'Optical Smoke Detector', category: 'Sensors', quantity: 150, minLevel: 50, unitPrice: 80, salesPrice: 150, location: 'Warehouse A-12' },
  { id: 'PART-002', sku: 'EXT-CO2-5KG', name: '5KG CO2 Extinguisher', category: 'Extinguishers', quantity: 12, minLevel: 20, unitPrice: 200, salesPrice: 450, location: 'Showroom' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'EMP-001', name: 'John Smith', role: 'Operations Manager', department: 'Management', email: 'john.s@laisqatar.com', phone: '+974 3333 1111', status: 'Active', joinDate: '2019-03-15' },
  { id: 'EMP-002', name: 'Ahmed Ali', role: 'Technician', department: 'Field Service', email: 'ahmed.a@laisqatar.com', phone: '+974 5555 2222', status: 'Active', joinDate: '2020-06-01' },
];

export const MOCK_REPORTS: Report[] = [
  { id: 'RPT-2024-001', title: 'Q1 Compliance Audit', type: 'Compliance', date: '2024-03-31', status: 'Ready', size: '2.4 MB' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N-001', title: 'SLA Breach Warning', message: 'Critical Response Time exceeded for WO-1023', type: 'SLA_BREACH', timestamp: '15 mins ago', read: false },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-001', name: 'Pump Room Main Panel', type: 'Control Panel', location: 'Al Hamad Towers - B1', lastInspection: '2024-04-01', nextInspection: '2024-07-01', status: 'Operational' },
];

export const FAQ_ITEMS = [
  {
    question: { en: "What does a Fire Safety AMC cover?", ar: "ماذا يغطي عقد الصيانة السنوي؟" },
    answer: { en: "Quarterly maintenance, 24/7 support, and QCDD certification.", ar: "صيانة ربع سنوية ودعم على مدار الساعة وشهادة الدفاع المدني." }
  },
];