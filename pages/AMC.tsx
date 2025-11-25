
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Plus, Search, Filter, MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { AMCContract, Customer } from '../types';
import { getAMCContracts, getCustomers } from '../services/db';

export const AMC: React.FC = () => {
  const [contracts, setContracts] = useState<AMCContract[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contracts' | 'schedules'>('contracts');

  useEffect(() => {
    const fetchData = async () => {
      const [cData, custData] = await Promise.all([getAMCContracts(), getCustomers()]);
      setContracts(cData);
      setCustomers(custData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">AMC Management</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setActiveTab('contracts')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'contracts' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Contracts</button>
          <button onClick={() => setActiveTab('schedules')} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'schedules' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Schedules</button>
        </div>
      </div>

      {activeTab === 'contracts' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between bg-gray-50">
            <div className="relative w-64">
              <input type="text" placeholder="Search contracts..." className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left rtl:text-right" />
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-2.5 text-gray-400" size={16} />
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700">
              <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> New Contract
            </button>
          </div>
          <table className="w-full text-sm text-left rtl:text-right">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Value (QAR)</th>
                <th className="px-6 py-4">Sites</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map(contract => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-red-600">{contract.code}</td>
                  <td className="px-6 py-4 font-medium">{getCustomerName(contract.customerId)}</td>
                  <td className="px-6 py-4 text-gray-500">{contract.startDate} to {contract.endDate}</td>
                  <td className="px-6 py-4 font-medium">{contract.contractValue.toLocaleString()}</td>
                  <td className="px-6 py-4">{contract.sites ? contract.sites.length : 0}</td>
                  <td className="px-6 py-4">{contract.frequency}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {contract.status === 'Active' ? <CheckCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0" /> : <AlertCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">Upcoming Service Schedule</h3>
          <p>Calendar view and auto-generation logic goes here.</p>
        </div>
      )}
    </div>
  );
};
