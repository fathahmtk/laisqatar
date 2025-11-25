
import { 
  Customer, Site, Equipment, Technician, AMCContract, AMCSchedule, 
  JobCard, Project, Item, Account, JournalEntry, Translation, Notification, Invoice,
  Report, Expense, TeamMember
} from './types';

export const TEXTS: Translation = {
  brand: { en: "Lais Qatar", ar: "ليس قطر" },
  home: { en: "Home", ar: "الرئيسية" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  login: { en: "Sign In", ar: "تسجيل الدخول" },
  about: { en: "About Us", ar: "من نحن" },
  services: { en: "Services", ar: "خدماتنا" },
  contact: { en: "Contact Us", ar: "اتصل بنا" },
  getQuote: { en: "Request Quote", ar: "اطلب عرض سعر" },
  learnMore: { en: "Learn More", ar: "المزيد" },
  
  // Modules
  masters_nav: { en: "Master Data", ar: "البيانات الرئيسية" },
  amc_nav: { en: "AMC Contracts", ar: "عقود الصيانة" },
  jobs_nav: { en: "Job Cards", ar: "أوامر العمل" },
  projects_nav: { en: "Projects", ar: "المشاريع" },
  inventory_nav: { en: "Inventory", ar: "المخزون" },
  finance_nav: { en: "Finance", ar: "المالية" },
  revenue: { en: "Revenue", ar: "الإيرادات" },
  
  heroTitle: { en: "Advanced Fire & Safety Solutions", ar: "حلول متقدمة للأمن والسلامة" },
  heroSubtitle: { en: "Qatar’s premier provider of fire protection systems.", ar: "المزود الرائد في قطر لأنظمة الحماية من الحريق." },
  faqTitle: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
  testimonials: { en: "Trusted by Leaders", ar: "موثوق من قبل القادة" },
  statsClients: { en: "Active Clients", ar: "عملاء نشطين" },
  statsProjects: { en: "Projects Completed", ar: "مشاريع مكتملة" },
  statsTechs: { en: "Certified Technicians", ar: "فنيين معتمدين" },
  ctaTitle: { en: "Ready to Secure Your Facility?", ar: "هل أنت مستعد لتأمين منشأتك؟" },
  ctaSubtitle: { en: "Get a free site survey today.", ar: "احصل على مسح مجاني للموقع اليوم." },
};

// --- SEED DATA ---

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', code: 'C001', name: 'Al Hamad Towers', type: 'Corporate', email: 'info@alhamad.qa', phone: '44001111', address: 'West Bay, Doha', paymentTermsDays: 30, creditLimit: 50000 },
  { id: 'CUST-002', code: 'C002', name: 'Doha Logistics Hub', type: 'Industrial', email: 'ops@dohalog.qa', phone: '44002222', address: 'Industrial Area, St 41', paymentTermsDays: 45, creditLimit: 100000 },
];

export const MOCK_SITES: Site[] = [
  { id: 'SITE-001', customerId: 'CUST-001', code: 'S001', name: 'Al Hamad Tower A', address: 'West Bay', category: 'Commercial', contactPerson: 'Mr. Khalid', contactMobile: '55551234' },
  { id: 'SITE-002', customerId: 'CUST-002', code: 'S002', name: 'Warehouse 4', address: 'Industrial Area', category: 'Industrial', contactPerson: 'Mr. John', contactMobile: '66669876' },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'EQ-001', siteId: 'SITE-001', code: 'EQ-FA-01', category: 'Fire Alarm Panel', brand: 'Simplex', model: '4100ES', serialNumber: 'SN-998877', installDate: '2022-01-01', nextServiceDue: '2024-06-01', isUnderAmc: true },
  { id: 'EQ-002', siteId: 'SITE-002', code: 'EQ-PUMP-01', category: 'Pump', brand: 'Grundfos', model: 'FireSet', serialNumber: 'SN-112233', installDate: '2023-05-15', nextServiceDue: '2024-05-15', isUnderAmc: true },
];

export const MOCK_AMC_CONTRACTS: AMCContract[] = [
  { id: 'AMC-2024-001', code: 'AMC-001', customerId: 'CUST-001', startDate: '2024-01-01', endDate: '2024-12-31', frequency: 'Quarterly', contractValue: 45000, billingCycle: 'Quarterly', status: 'Active', sites: ['SITE-001'] },
];

export const MOCK_AMC_SCHEDULES: AMCSchedule[] = [
  { id: 'SCH-001', contractId: 'AMC-2024-001', siteId: 'SITE-001', plannedDate: '2024-04-01', status: 'Completed', jobCardId: 'JOB-1001' },
  { id: 'SCH-002', contractId: 'AMC-2024-001', siteId: 'SITE-001', plannedDate: '2024-07-01', status: 'Planned' },
];

export const MOCK_JOBS: JobCard[] = [
  { id: 'JOB-1001', jobNumber: 'J-24-1001', type: 'Preventive', customerId: 'CUST-001', siteId: 'SITE-001', contractId: 'AMC-2024-001', priority: 'Normal', status: 'Completed', scheduledDate: '2024-04-01', description: 'Q1 Maintenance', isAmcCovered: true, checklist: [{item: 'Check Panel', checked: true}] },
  { id: 'JOB-1002', jobNumber: 'J-24-1002', type: 'Corrective', customerId: 'CUST-002', siteId: 'SITE-002', priority: 'High', status: 'Open', scheduledDate: '2024-05-15', description: 'Pump failure alarm', isAmcCovered: false, checklist: [{item: 'Inspect Pump', checked: false}] },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'PRJ-001', code: 'P-24-001', name: 'Mall Fire System Upgrade', customerId: 'CUST-001', siteId: 'SITE-001', startDate: '2024-02-01', endDate: '2024-08-01', value: 250000, budget: 180000, totalCost: 45000, status: 'InProgress', managerId: 'USER-001' },
];

export const MOCK_ITEMS: Item[] = [
  { id: 'ITM-001', code: 'FA-SD-01', name: 'Optical Smoke Detector', category: 'Sensors', stockQty: 150, minLevel: 50, costPrice: 80, sellingPrice: 160, location: 'Store A' },
  { id: 'ITM-002', code: 'FF-EXT-CO2', name: '5kg CO2 Extinguisher', category: 'Extinguishers', stockQty: 15, minLevel: 20, costPrice: 200, sellingPrice: 450, location: 'Showroom' },
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'ACC-1000', code: '1000', name: 'Cash', type: 'Asset', balance: 5000 },
  { id: 'ACC-1100', code: '1100', name: 'Bank - QNB', type: 'Asset', balance: 150000 },
  { id: 'ACC-1200', code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 45000 },
  { id: 'ACC-2000', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 25000 },
  { id: 'ACC-4000', code: '4000', name: 'Revenue - AMC', type: 'Revenue', balance: 90000 },
  { id: 'ACC-5000', code: '5000', name: 'Cost of Sales', type: 'Expense', balance: 35000 },
];

export const MOCK_JOURNALS: JournalEntry[] = [
  { id: 'JE-001', date: '2024-05-01', description: 'AMC Invoice Inv-001', reference: 'INV-001', status: 'Posted', lines: [
    { accountId: 'ACC-1200', accountName: 'Accounts Receivable', debit: 11250, credit: 0 },
    { accountId: 'ACC-4000', accountName: 'Revenue - AMC', debit: 0, credit: 11250 }
  ]}
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', number: 'INV-24-001', customerId: 'CUST-001', date: '2024-05-01', dueDate: '2024-05-31', totalAmount: 11250, status: 'Posted', items: [{description: 'Q2 AMC Services', amount: 11250}]}
];

export const MOCK_REPORTS: Report[] = [
  { id: 'RPT-001', title: 'Monthly Maintenance Summary', type: 'PDF', date: '2024-05-01', size: '2.5 MB', status: 'Ready' }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '2024-05-05', description: 'Fuel for Fleet', category: 'Transport', amount: 1500, approvedBy: 'Admin' }
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'EMP-001', name: 'Ahmed Ali', role: 'Technician', department: 'Field Service', status: 'Active', email: 'ahmed@lais.qa', phone: '55001122' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'AMC Schedule', message: '5 Contracts due for scheduling next month', read: false, type: 'INFO', timestamp: '2h ago' },
  { id: '2', title: 'SLA Warning', message: 'Job #1002 is overdue', read: false, type: 'SLA_BREACH', timestamp: '10m ago' },
];

export const FAQ_ITEMS = [
  { question: { en: "What does AMC cover?", ar: "ماذا يغطي العقد؟" }, answer: { en: "Preventive maintenance & emergency calls.", ar: "الصيانة الوقائية وطوارئ." } }
];
