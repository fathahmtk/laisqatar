

import { Contract, ContractStatus, WorkOrder, WorkOrderPriority, WorkOrderStatus, Asset, Translation, Role, Client, Report, Notification, Invoice, Expense, InventoryItem, TeamMember } from './types';

export const TEXTS: Translation = {
  brand: { en: "Lais Qatar", ar: "ليس قطر" },
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About Us", ar: "من نحن" },
  services: { en: "Services", ar: "خدماتنا" },
  amc: { en: "AMC Packages", ar: "عقود الصيانة" },
  projects: { en: "Projects", ar: "المشاريع" },
  contact: { en: "Contact Us", ar: "اتصل بنا" },
  login: { en: "Sign In", ar: "تسجيل الدخول" },
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  
  // Hero Section
  heroTitle: { 
    en: "Advanced Fire & Safety Solutions for a Secure Future", 
    ar: "حلول متقدمة للأمن والسلامة لمستقبل آمن" 
  },
  heroSubtitle: {
    en: "Qatar’s premier provider of fire protection systems, offering end-to-end installation, 24/7 maintenance, and civil defense compliance assurance.",
    ar: "المزود الرائد في قطر لأنظمة الحماية من الحريق، نقدم خدمات التركيب المتكاملة والصيانة على مدار الساعة وضمان الامتثال للدفاع المدني."
  },
  getQuote: { en: "Request a Free Quote", ar: "اطلب عرض سعر مجاني" },
  learnMore: { en: "Learn More", ar: "المزيد" },

  // Sections
  whyChooseUs: { en: "Why Choose Lais Qatar?", ar: "لماذا تختار ليس قطر؟" },
  emergency: { en: "Emergency Support", ar: "الدعم الطارئ" },
  contracts: { en: "Contracts", ar: "العقود" },
  workOrders: { en: "Work Orders", ar: "أوامر العمل" },
  assets: { en: "Assets", ar: "الأصول" },
  technician: { en: "Technician", ar: "الفني" },
  clients: { en: "Clients", ar: "العملاء" },
  reports: { en: "Reports", ar: "التقارير" },
  accounts: { en: "Accounts", ar: "الحسابات" },
  inventory: { en: "Inventory", ar: "المخزون" },
  team: { en: "Team", ar: "الفريق" },
  settings: { en: "Settings", ar: "الإعدادات" },
  
  // Stats
  statsClients: { en: "Active Clients", ar: "عملاء نشطين" },
  statsProjects: { en: "Projects Completed", ar: "مشاريع مكتملة" },
  statsTechs: { en: "Certified Technicians", ar: "فنيين معتمدين" },

  // Testimonials & CTA
  testimonials: { en: "Trusted by Leaders", ar: "موثوق من قبل القادة" },
  ctaTitle: { en: "Ready to Secure Your Facility?", ar: "هل أنت مستعد لتأمين منشأتك؟" },
  ctaSubtitle: {
    en: "Get a free site survey and comprehensive safety assessment today.",
    ar: "احصل على مسح مجاني للموقع وتقييم شامل للسلامة اليوم."
  },

  // Dashboard
  switchRole: { en: "Switch Role Demo", ar: "تبديل الدور (تجريبي)" },
  activeContracts: { en: "Active Contracts", ar: "عقود نشطة" },
  pendingJobs: { en: "Pending Jobs", ar: "وظائف معلقة" },
  slaBreach: { en: "SLA Breaches", ar: "انتهاكات اتفاقية مستوى الخدمة" },
  revenue: { en: "Monthly Revenue", ar: "الإيرادات الشهرية" },

  // FAQ
  faqTitle: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
};

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'AMC-2024-001', clientName: 'Al Hamad Towers', type: 'AMC Gold', startDate: '2024-01-01', endDate: '2025-01-01', status: ContractStatus.ACTIVE, value: 45000, assetsCount: 120 },
  { id: 'AMC-2024-002', clientName: 'Doha Logistics Hub', type: 'AMC Silver', startDate: '2024-02-15', endDate: '2025-02-15', status: ContractStatus.ACTIVE, value: 25000, assetsCount: 45 },
  { id: 'AMC-2023-089', clientName: 'West Bay Offices', type: 'Emergency Only', startDate: '2023-05-01', endDate: '2024-05-01', status: ContractStatus.EXPIRED, value: 10000, assetsCount: 20 },
  { id: 'AMC-2024-005', clientName: 'Pearl Residency', type: 'AMC Gold', startDate: '2024-06-01', endDate: '2025-06-01', status: ContractStatus.PENDING, value: 55000, assetsCount: 200 },
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'WO-1023', title: 'Fire Alarm Loop Failure', location: 'Al Hamad Towers - Floor 3', priority: WorkOrderPriority.CRITICAL, status: WorkOrderStatus.OPEN, date: '2024-05-10', assignedTo: 'Ahmed Ali' },
  { id: 'WO-1024', title: 'Quarterly Sprinkler Check', location: 'Doha Logistics Hub', priority: WorkOrderPriority.MEDIUM, status: WorkOrderStatus.IN_PROGRESS, date: '2024-05-11', assignedTo: 'John Doe' },
  { id: 'WO-1025', title: 'Extinguisher Refill', location: 'Pearl Residency', priority: WorkOrderPriority.LOW, status: WorkOrderStatus.OPEN, date: '2024-05-12' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'CL-001', name: 'Al Hamad Towers', contactPerson: 'Mr. Khalid', email: 'khalid@alhamad.qa', phone: '+974 5555 1234', location: 'West Bay', contractStatus: ContractStatus.ACTIVE },
  { id: 'CL-002', name: 'Doha Logistics Hub', contactPerson: 'Ms. Sarah', email: 'sarah@dohalog.qa', phone: '+974 6666 9876', location: 'Industrial Area', contractStatus: ContractStatus.ACTIVE },
  { id: 'CL-003', name: 'Pearl Residency', contactPerson: 'Mr. John', email: 'john@pearlres.qa', phone: '+974 3333 4567', location: 'The Pearl', contractStatus: ContractStatus.PENDING },
];

export const MOCK_REPORTS: Report[] = [
  { id: 'RPT-2024-001', title: 'Q1 Compliance Audit - Al Hamad Towers', type: 'Compliance', date: '2024-03-31', status: 'Ready', size: '2.4 MB' },
  { id: 'RPT-2024-002', title: 'Monthly Maintenance Log - April', type: 'Maintenance', date: '2024-04-30', status: 'Ready', size: '1.1 MB' },
  { id: 'RPT-2024-003', title: 'Financial Statement - Q1', type: 'Financial', date: '2024-04-15', status: 'Processing', size: '0.5 MB' },
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'AST-001', name: 'Pump Room Main Panel', type: 'Control Panel', location: 'Al Hamad Towers - B1', lastInspection: '2024-04-01', nextInspection: '2024-07-01', status: 'Operational' },
  { id: 'AST-002', name: 'Zone 4 Smoke Detector', type: 'Detector', location: 'Al Hamad Towers - Lobby', lastInspection: '2023-12-01', nextInspection: '2024-06-01', status: 'Maintenance Required' },
  { id: 'AST-003', name: 'Jockey Pump P-03', type: 'Pump', location: 'Doha Logistics Hub - Pump Room', lastInspection: '2024-03-15', nextInspection: '2024-06-15', status: 'Operational' },
  { id: 'AST-004', name: 'Diesel Generator Gen-2', type: 'Generator', location: 'Doha Logistics Hub - External', lastInspection: '2024-02-20', nextInspection: '2024-05-20', status: 'Defective' },
  { id: 'AST-005', name: 'Main Fire Alarm Panel', type: 'Control Panel', location: 'Pearl Residency - Reception', lastInspection: '2024-01-10', nextInspection: '2024-04-10', status: 'Operational' },
  { id: 'AST-006', name: 'Hydrant H-23', type: 'Hydrant', location: 'Pearl Residency - North Gate', lastInspection: '2024-04-05', nextInspection: '2024-07-05', status: 'Operational' },
  { id: 'AST-007', name: 'Extinguisher CO2-04', type: 'Extinguisher', location: 'Al Hamad Towers - Server Room', lastInspection: '2024-03-01', nextInspection: '2024-09-01', status: 'Operational' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'N-001', title: 'SLA Breach Warning', message: 'Critical Response Time exceeded for WO-1023 at Al Hamad Towers (4h 15m).', type: 'SLA_BREACH', timestamp: '15 mins ago', read: false },
  { id: 'N-002', title: 'Contract Expiring Soon', message: 'AMC-2023-089 (West Bay Offices) expires in 3 days.', type: 'WARNING', timestamp: '2 hours ago', read: false },
  { id: 'N-003', title: 'Technician Assigned', message: 'Ahmed Ali assigned to WO-1025.', type: 'INFO', timestamp: '1 day ago', read: true },
  { id: 'N-004', title: 'Payment Received', message: 'Payment for Invoice INV-2024-55 processed successfully.', type: 'SUCCESS', timestamp: '2 days ago', read: true },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', clientId: 'CL-001', clientName: 'Al Hamad Towers', issueDate: '2024-04-25', dueDate: '2024-05-25', amount: 12500, status: 'PENDING', items: ['Q2 AMC Payment', 'Spare Parts Replacement'] },
  { id: 'INV-2024-002', clientId: 'CL-002', clientName: 'Doha Logistics Hub', issueDate: '2024-04-10', dueDate: '2024-05-10', amount: 8500, status: 'PAID', items: ['Annual Inspection Fee'] },
  { id: 'INV-2024-003', clientId: 'CL-003', clientName: 'Pearl Residency', issueDate: '2024-03-15', dueDate: '2024-04-15', amount: 15000, status: 'OVERDUE', items: ['Emergency Callout - Pump Repair', 'Q1 Maintenance'] },
  { id: 'INV-2024-004', clientId: 'CL-001', clientName: 'Al Hamad Towers', issueDate: '2024-01-25', dueDate: '2024-02-25', amount: 12500, status: 'PAID', items: ['Q1 AMC Payment'] },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', category: 'Materials', description: 'Bulk order of Smoke Detectors', amount: 4500, date: '2024-05-01', approvedBy: 'Manager' },
  { id: 'EXP-002', category: 'Logistics', description: 'Fleet Fuel - April', amount: 1200, date: '2024-04-30', approvedBy: 'Auto' },
  { id: 'EXP-003', category: 'Utilities', description: 'Office Electricity Bill', amount: 850, date: '2024-04-28', approvedBy: 'Admin' },
  { id: 'EXP-004', category: 'Salaries', description: 'Technician Overtime Payout', amount: 3500, date: '2024-04-25', approvedBy: 'HR' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'PART-001', sku: 'SD-OPT-01', name: 'Optical Smoke Detector', category: 'Sensors', quantity: 150, minLevel: 50, unitPrice: 150, location: 'Warehouse A-12' },
  { id: 'PART-002', sku: 'HEAT-FIX-02', name: 'Fixed Temp Heat Detector', category: 'Sensors', quantity: 30, minLevel: 40, unitPrice: 120, location: 'Warehouse A-13' },
  { id: 'PART-003', sku: 'SPR-PDT-05', name: 'Pendant Sprinkler Head', category: 'Sprinklers', quantity: 500, minLevel: 200, unitPrice: 45, location: 'Warehouse B-05' },
  { id: 'PART-004', sku: 'EXT-CO2-5KG', name: '5KG CO2 Extinguisher', category: 'Extinguishers', quantity: 12, minLevel: 20, unitPrice: 450, location: 'Showroom' },
  { id: 'PART-005', sku: 'BATT-12V-7AH', name: '12V 7Ah Battery', category: 'Power', quantity: 85, minLevel: 50, unitPrice: 85, location: 'Warehouse C-01' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'EMP-001', name: 'John Smith', role: 'Operations Manager', department: 'Management', email: 'john.s@laisqatar.com', phone: '+974 3333 1111', status: 'Active', joinDate: '2019-03-15' },
  { id: 'EMP-002', name: 'Ahmed Ali', role: 'Senior Technician', department: 'Field Service', email: 'ahmed.a@laisqatar.com', phone: '+974 5555 2222', status: 'Active', joinDate: '2020-06-01' },
  { id: 'EMP-003', name: 'Sarah Jones', role: 'Accountant', department: 'Management', email: 'sarah.j@laisqatar.com', phone: '+974 6666 3333', status: 'Active', joinDate: '2021-01-10' },
  { id: 'EMP-004', name: 'Mike Ross', role: 'Technician', department: 'Field Service', email: 'mike.r@laisqatar.com', phone: '+974 7777 4444', status: 'On Leave', joinDate: '2022-11-20' },
  { id: 'EMP-005', name: 'Fatima Al-Sayed', role: 'Sales Executive', department: 'Sales', email: 'fatima.s@laisqatar.com', phone: '+974 3333 5555', status: 'Active', joinDate: '2023-02-14' },
];

export const ROLES_LIST = [Role.PUBLIC, Role.ADMIN, Role.TECHNICIAN, Role.CLIENT];

export const FAQ_ITEMS = [
  {
    question: { 
      en: "What does a Fire Safety AMC cover?", 
      ar: "ماذا يغطي عقد الصيانة السنوي لأنظمة الحريق؟" 
    },
    answer: { 
      en: "Our Annual Maintenance Contract (AMC) includes quarterly preventive maintenance visits, 24/7 emergency call-out support, unlimited breakdown calls, and full compliance management for Qatar Civil Defense (QCDD) certification renewal.", 
      ar: "يشمل عقد الصيانة السنوي (AMC) زيارات صيانة وقائية ربع سنوية، ودعمًا للطوارئ على مدار الساعة طوال أيام الأسبوع، ومكالمات أعطال غير محدودة، وإدارة الامتثال الكاملة لتجديد شهادة الدفاع المدني القطري." 
    }
  },
  {
    question: { 
      en: "How quickly can you respond to an emergency?", 
      ar: "ما هي سرعة الاستجابة للحالات الطارئة؟" 
    },
    answer: { 
      en: "For clients with an active AMC, we guarantee a response time of under 2 hours for critical failures within Doha. Our emergency fleet is equipped with common spares to resolve issues on the first visit whenever possible.", 
      ar: "للعملاء الذين لديهم عقود صيانة نشطة، نضمن وقت استجابة أقل من ساعتين للأعطال الحرجة داخل الدوحة. أسطول الطوارئ لدينا مجهز بقطع الغيار الشائعة لحل المشكلات من الزيارة الأولى كلما أمكن ذلك." 
    }
  },
  {
    question: { 
      en: "Do you handle QCDD approvals and renewals?", 
      ar: "هل تتعاملون مع موافقات وتجديدات الدفاع المدني؟" 
    },
    answer: { 
      en: "Yes, we handle the end-to-end process. This includes preparing as-built drawings, conducting pre-inspection audits, submitting documents to the QCDD portal, and attending the official inspection with the authorities.", 
      ar: "نعم، نحن نتولى العملية من البداية إلى النهاية. ويشمل ذلك إعداد المخططات الواقعية، وإجراء عمليات تدقيق ما قبل التفتيش، وتقديم المستندات إلى بوابة الدفاع المدني، وحضور التفتيش الرسمي مع السلطات." 
    }
  },
  {
    question: { 
      en: "Can I upgrade my maintenance package later?", 
      ar: "هل يمكنني ترقية باقة الصيانة الخاصة بي لاحقًا؟" 
    },
    answer: { 
      en: "Absolutely. You can upgrade from Silver to Gold or Platinum packages at any time. The pro-rated difference will be calculated, and new benefits like increased spare parts coverage will start immediately.", 
      ar: "بالتأكيد. يمكنك الترقية من الباقة الفضية إلى الذهبية أو البلاتينية في أي وقت. سيتم احتساب الفرق التناسبي، وستبدأ المزايا الجديدة مثل زيادة تغطية قطع الغيار على الفور." 
    }
  }
];