
import React, { useState, useEffect } from 'react';
import { getAccounts, getJournals } from '../services/db';
import { Account, JournalEntry } from '../types';
import { DollarSign, FileText, PieChart, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coa' | 'journal' | 'reports'>('coa');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinance = async () => {
      const [accData, jrnData] = await Promise.all([getAccounts(), getJournals()]);
      setAccounts(accData);
      setJournals(jrnData);
      setLoading(false);
    };
    fetchFinance();
  }, []);

  const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Finance & Accounting</h1>
        <div className="flex space-x-2 rtl:space-x-reverse bg-gray-100 p-1 rounded-lg">
          {['coa', 'journal', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              {tab === 'coa' ? 'Chart of Accounts' : tab === 'journal' ? 'Journal Entries' : 'Financial Reports'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div>Loading Finance Data...</div> : (
        <>
          {activeTab === 'coa' && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Assets</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2 flex items-center">
                       {totalAssets.toLocaleString()} QAR
                       <ArrowUpRight size={16} className="ml-2 text-green-500"/>
                    </p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Liabilities</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2 flex items-center">
                       {totalLiabilities.toLocaleString()} QAR
                       <ArrowDownLeft size={16} className="ml-2 text-red-500"/>
                    </p>
                 </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3">Code</th>
                      <th className="px-6 py-3">Account Name</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">Balance (QAR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                      <tr key={acc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-mono text-gray-500">{acc.code}</td>
                        <td className="px-6 py-3 font-medium text-gray-900">{acc.name}</td>
                        <td className="px-6 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{acc.type}</span></td>
                        <td className="px-6 py-3 text-right font-medium">{acc.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
               <div className="p-4 border-b border-gray-200 flex justify-between bg-gray-50">
                  <h3 className="font-bold text-gray-700">General Journal</h3>
                  <button className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
                    <Plus size={16} className="mr-2"/> New Entry
                  </button>
               </div>
               {journals.map(je => (
                 <div key={je.id} className="border-b border-gray-100 p-4">
                    <div className="flex justify-between mb-2">
                       <div>
                          <span className="font-bold text-gray-900">{je.date}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-gray-600">{je.description}</span>
                          <span className="ml-2 text-xs text-gray-400">({je.reference})</span>
                       </div>
                       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{je.status}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                       <table className="w-full text-xs">
                          <thead>
                             <tr className="text-gray-500 border-b border-gray-200">
                                <th className="text-left py-1">Account</th>
                                <th className="text-right py-1">Debit</th>
                                <th className="text-right py-1">Credit</th>
                             </tr>
                          </thead>
                          <tbody>
                             {je.lines.map((line, idx) => (
                               <tr key={idx}>
                                  <td className="py-1">{line.accountName}</td>
                                  <td className="text-right py-1 text-gray-700">{line.debit > 0 ? line.debit.toLocaleString() : '-'}</td>
                                  <td className="text-right py-1 text-gray-700">{line.credit > 0 ? line.credit.toLocaleString() : '-'}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'reports' && (
             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center"><FileText size={18} className="mr-2"/> Profit & Loss</h3>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Total Revenue</span><span className="font-bold">0.00</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Cost of Goods Sold</span><span>(0.00)</span></div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between font-bold"><span className="text-gray-900">Gross Profit</span><span>0.00</span></div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                   <h3 className="font-bold text-gray-900 mb-4 flex items-center"><PieChart size={18} className="mr-2"/> Balance Sheet Summary</h3>
                   <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Total Assets</span><span className="font-bold">{totalAssets.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Total Liabilities</span><span>{totalLiabilities.toLocaleString()}</span></div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between font-bold"><span className="text-gray-900">Equity</span><span>{(totalAssets - totalLiabilities).toLocaleString()}</span></div>
                   </div>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );
};
