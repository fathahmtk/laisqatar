import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, FileText, Download, 
  Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Loader2, BookOpen, Printer, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Account, JournalEntry, Invoice, Expense } from '../types';
import { Api } from '../services/api';

// #region Mappers
const mapBackendToAccount = (data: any): Account => ({ id: data.id.toString(), code: data.account_code, name: data.name, type: data.account_type.name, balance: 0 });
const mapBackendToJournal = (data: any): JournalEntry => ({ id: data.id.toString(), date: data.journal_date, description: data.description, reference: data.reference, status: data.status, lines: [] });
const mapBackendToInvoice = (data: any): Invoice => ({ id: data.id.toString(), number: data.invoice_number, customerId: data.customer.toString(), date: data.invoice_date, dueDate: data.due_date, totalAmount: parseFloat(data.grand_total), status: data.status, items: [] });
const mapBackendToExpense = (data: any): Expense => ({ id: data.id.toString(), date: data.invoice_date, description: `Purchase from ${data.supplier.name}`, category: 'Purchase', amount: parseFloat(data.grand_total), approvedBy: 'Auto' });
// #endregion

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses' | 'ledger'>('overview');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [acc, je, inv, exp] = await Promise.all([Api.listAccounts(), Api.listJournals(), Api.listInvoices(), Api.listExpenses()]);
        setAccounts(acc.map(mapBackendToAccount));
        setJournals(je.map(mapBackendToJournal));
        setInvoices(inv.map(mapBackendToInvoice));
        setExpenses(exp.map(mapBackendToExpense));
      } catch (e) {
        console.error("Failed to fetch finance data", e)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIncome = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.totalAmount : sum, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingIncome = invoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + inv.totalAmount : sum, 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-QA', { style: 'currency', currency: 'QAR', minimumFractionDigits: 0 }).format(val);

  const handlePrint = (invoice: Invoice) => { setPrintInvoice(invoice); setTimeout(() => window.print(), 100); };
  
  const InvoiceBadge = ({ status }: { status: string }) => { /* ... */ };
  
  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  return (
    <div className="space-y-6">
       {printInvoice && ( <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">{/* Print Layout */}</div> )}

      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">Finance & Accounting</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['overview', 'invoices', 'expenses', 'ledger'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${activeTab === tab ? 'bg-white shadow' : 'text-gray-500'}`}>{tab}</button>))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="print:hidden">
        {activeTab === 'overview' && ( <div className="space-y-6">{/* Overview UI */}</div> )}
        {activeTab === 'invoices' && ( <div className="bg-white rounded-xl border overflow-hidden">{/* Invoices Table UI */}</div> )}
        {/* Fix: Corrected typo from 'active-tab' to 'activeTab'. */}
        {activeTab === 'expenses' && ( <div className="bg-white rounded-xl border overflow-hidden">{/* Expenses Table UI */}</div> )}
        {activeTab === 'ledger' && ( <div className="grid lg:grid-cols-3 gap-6">{/* Ledger UI */}</div> )}
      </div>
    </div>
  );
};