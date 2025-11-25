
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, FileText, Download, 
  Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Loader2, BookOpen
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAccounts, getJournals, getInvoices, getExpenses } from '../services/db';
import { Account, JournalEntry, Invoice, Expense } from '../types';

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses' | 'ledger'>('overview');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [acc, je, inv, exp] = await Promise.all([getAccounts(), getJournals(), getInvoices(), getExpenses()]);
      setAccounts(acc);
      setJournals(je);
      setInvoices(inv);
      setExpenses(exp);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Stats Calculation
  const totalIncome = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.totalAmount : sum, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingIncome = invoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + inv.totalAmount : sum, 0);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-QA', { style: 'currency', currency: 'QAR', minimumFractionDigits: 0 }).format(val);

  const InvoiceBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> Paid</span>;
      case 'Posted': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> Posted</span>;
      case 'Overdue': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> Overdue</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Draft</span>;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  // Mock Data for Charts
  const chartData = [
    { name: 'Jan', income: 45000, expense: 28000 },
    { name: 'Feb', income: 52000, expense: 32000 },
    { name: 'Mar', income: 48000, expense: 25000 },
    { name: 'Apr', income: 61000, expense: 35000 },
    { name: 'May', income: 55000, expense: 30000 },
    { name: 'Jun', income: 67000, expense: 38000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Finance & Accounting</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {['overview', 'invoices', 'expenses', 'ledger'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)} 
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize whitespace-nowrap ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'ledger' ? 'GL & COA' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Net Profit</h3>
                 <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(netProfit)}</p>
              <span className="text-xs text-green-600 font-medium flex items-center mt-2"><TrendingUp size={14} className="mr-1 rtl:ml-1 rtl:mr-0"/> +12% vs last month</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Total Income</h3>
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
              <span className="text-xs text-blue-600 font-medium flex items-center mt-2">from {invoices.filter(i => i.status === 'Paid').length} invoices</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Expenses</h3>
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              <span className="text-xs text-red-600 font-medium flex items-center mt-2">+5% vs last month</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-gray-500 font-medium text-sm">Outstanding</h3>
                 <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(pendingIncome)}</p>
              <span className="text-xs text-yellow-600 font-medium flex items-center mt-2">{invoices.filter(i => i.status !== 'Paid').length} pending</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Cash Flow Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                    <Area type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6">Expense Categories</h3>
              <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenses} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="category" type="category" width={80} tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="amount" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
           <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
             <div className="relative w-full max-w-sm">
               <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search invoices..." className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left rtl:text-right" />
             </div>
             <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700 transition-colors">
               <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Create Invoice
             </button>
           </div>
           <table className="w-full text-left rtl:text-right text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-red-600">{inv.number}</td>
                    <td className="px-6 py-4">{inv.date}</td>
                    <td className="px-6 py-4">{inv.dueDate}</td>
                    <td className="px-6 py-4 font-mono font-bold">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-6 py-4"><InvoiceBadge status={inv.status} /></td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in">
           <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
             <div className="flex gap-2">
               <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                 <Filter size={14} className="mr-2 rtl:ml-2 rtl:mr-0"/> Filter
               </button>
             </div>
             <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 transition-colors">
               <Download size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Export CSV
             </button>
           </div>
           <table className="w-full text-left rtl:text-right text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Approved By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{exp.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{exp.description}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{exp.category}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-red-600">-{formatCurrency(exp.amount)}</td>
                    <td className="px-6 py-4">{exp.approvedBy}</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
           {/* Chart of Accounts */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-1">
              <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-900 flex items-center">
                 <BookOpen size={18} className="mr-2 rtl:ml-2 rtl:mr-0"/> Chart of Accounts
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                     <tr>
                        <th className="px-4 py-2">Code</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2 text-right rtl:text-left">Bal</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                        <tr key={acc.id} className="hover:bg-gray-50">
                           <td className="px-4 py-2 font-mono text-xs text-gray-500">{acc.code}</td>
                           <td className="px-4 py-2 font-medium text-gray-800">{acc.name}</td>
                           <td className="px-4 py-2 text-right rtl:text-left font-mono text-xs">{acc.balance.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Journals */}
           <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
              <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-900 flex justify-between items-center">
                 <span>Recent Journal Entries</span>
                 <button className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">+ New Entry</button>
              </div>
              <table className="w-full text-sm text-left rtl:text-right">
                 <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                       <th className="px-6 py-3">Date</th>
                       <th className="px-6 py-3">Reference</th>
                       <th className="px-6 py-3">Description</th>
                       <th className="px-6 py-3">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {journals.map(je => (
                       <tr key={je.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">{je.date}</td>
                          <td className="px-6 py-3 font-mono text-xs">{je.reference}</td>
                          <td className="px-6 py-3 text-gray-900">{je.description}</td>
                          <td className="px-6 py-3">
                             <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{je.status}</span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};
