import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, MoreHorizontal, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Contract, ContractStatus } from '../types';
import { getContracts } from '../services/db';

export const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getContracts();
      setContracts(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case ContractStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case ContractStatus.EXPIRED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Contract Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-all">
          <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> New Contract
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contracts or clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left rtl:text-right transition-all"
            />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <Filter size={18} className="text-gray-400" />
             <select 
               className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none cursor-pointer"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
               <option value="All">All Statuses</option>
               <option value={ContractStatus.ACTIVE}>Active</option>
               <option value={ContractStatus.PENDING}>Pending</option>
               <option value={ContractStatus.EXPIRED}>Expired</option>
             </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Contract ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Value (QAR)</th>
                <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-red-600">{contract.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{contract.clientName}</td>
                  <td className="px-6 py-4">{contract.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs">
                      <span>{contract.startDate}</span>
                      <span className="text-gray-400">to {contract.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status === ContractStatus.ACTIVE && <CheckCircle size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />}
                      {contract.status === ContractStatus.PENDING && <Clock size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />}
                      {contract.status === ContractStatus.EXPIRED && <AlertTriangle size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />}
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{contract.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContracts.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No contracts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};