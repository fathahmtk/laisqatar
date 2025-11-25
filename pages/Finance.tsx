
import React, { useState, useEffect } from 'react';
import { getAccounts, getJournals, getInvoices } from '../services/db';
import { Account, JournalEntry, Invoice } from '../types';
import { DollarSign, FileText, PieChart, Plus } from 'lucide-react';

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coa' | 'journal' | 'invoices'>('coa');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [acc, je, inv] = await Promise.all([getAccounts(), getJournals(), getInvoices()]);
      setAccounts(acc);
      setJournals(je);
      setInvoices(inv);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['coa', 'journal', 'invoices'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 text-sm font-medium rounded-md uppercase ${activeTab === tab ? 'bg-white shadow' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>
      </div>

      {activeTab === 'coa' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Account Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3 text-right">Balance</th>
                 </tr>
              </thead>
              <tbody>
                 {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                    <tr key={acc.id} className="border-b border-gray-50">
                       <td className="px-6 py-3 font-mono text-gray-500">{acc.code}</td>
                       <td className="px-6 py-3 font-medium">{acc.name}</td>
                       <td className="px-6 py-3">{acc.type}</td>
                       <td className="px-6 py-3 text-right font-mono">{acc.balance.toLocaleString()}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
           <div className="p-4 border-b border-gray-200 flex justify-end">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center"><Plus size={16} className="mr-2"/> Create Invoice</button>
           </div>
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                 <tr>
                    <th className="px-6 py-3">Invoice #</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                 </tr>
              </thead>
              <tbody>
                 {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-50">
                       <td className="px-6 py-3 font-medium text-red-600">{inv.number}</td>
                       <td className="px-6 py-3">{inv.date}</td>
                       <td className="px-6 py-3 font-bold">{inv.totalAmount.toLocaleString()} QAR</td>
                       <td className="px-6 py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{inv.status}</span></td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};
