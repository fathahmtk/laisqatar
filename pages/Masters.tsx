
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Box, Search, Plus, MoreHorizontal } from 'lucide-react';
import { Customer, Site, Equipment } from '../types';
import { getCustomers, getSites, getEquipment } from '../services/db';

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'sites' | 'equipment'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchMasters = async () => {
      const [c, s, e] = await Promise.all([getCustomers(), getSites(), getEquipment()]);
      setCustomers(c);
      setSites(s);
      setEquipment(e);
    };
    fetchMasters();
  }, []);

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === id ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      <Icon size={16} className="mr-2" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Master Data</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <TabButton id="customers" label="Customers" icon={Users} />
          <TabButton id="sites" label="Sites" icon={MapPin} />
          <TabButton id="equipment" label="Equipment" icon={Box} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between bg-gray-50">
          <div className="relative w-64">
             <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20" />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-800">
             <Plus size={16} className="mr-2" /> Add New
          </button>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            {activeTab === 'customers' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Type</th>
                 <th className="px-6 py-4">Contact</th>
                 <th className="px-6 py-4">Credit Limit</th>
               </tr>
            )}
            {activeTab === 'sites' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Address</th>
                 <th className="px-6 py-4">Contact</th>
               </tr>
            )}
            {activeTab === 'equipment' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Brand/Model</th>
                 <th className="px-6 py-4">Next Service</th>
                 <th className="px-6 py-4">Status</th>
               </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-100">
             {activeTab === 'customers' && customers.map(c => (
               <tr key={c.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-mono">{c.code}</td>
                 <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                 <td className="px-6 py-4">{c.type}</td>
                 <td className="px-6 py-4">{c.phone}</td>
                 <td className="px-6 py-4">{c.creditLimit.toLocaleString()} QAR</td>
               </tr>
             ))}
             {activeTab === 'sites' && sites.map(s => (
               <tr key={s.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-mono">{s.code}</td>
                 <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                 <td className="px-6 py-4">{s.category}</td>
                 <td className="px-6 py-4">{s.address}</td>
                 <td className="px-6 py-4">{s.contactPerson}</td>
               </tr>
             ))}
             {activeTab === 'equipment' && equipment.map(e => (
               <tr key={e.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-mono">{e.code}</td>
                 <td className="px-6 py-4">{e.category}</td>
                 <td className="px-6 py-4 font-medium text-gray-900">{e.brand} {e.model}</td>
                 <td className="px-6 py-4 text-red-600">{e.nextServiceDue}</td>
                 <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${e.isUnderAmc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {e.isUnderAmc ? 'AMC Covered' : 'Non-AMC'}
                    </span>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
