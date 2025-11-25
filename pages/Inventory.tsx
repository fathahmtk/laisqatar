
import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/db';
import { Item } from '../types';
import { Package, Search, Filter, Plus, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInventory();
      setItems(data);
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm">
           <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by code or name..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left rtl:text-right"
               />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
               <Filter size={18} className="text-gray-400" />
               <select 
                 className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2"
                 value={categoryFilter}
                 onChange={(e) => setCategoryFilter(e.target.value)}
               >
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>
         </div>

         <table className="w-full text-sm text-left rtl:text-right">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
               <tr>
                  <th className="px-6 py-4">Item Code</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Cost Price</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Location</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {filteredItems.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 font-mono text-gray-500 text-xs">{i.code}</td>
                     <td className="px-6 py-4 font-medium text-gray-900">{i.name}</td>
                     <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{i.category}</span>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center">
                           <span className={`font-bold ${i.stockQty <= i.minLevel ? 'text-red-600' : 'text-gray-900'}`}>{i.stockQty}</span>
                           {i.stockQty <= i.minLevel && (
                             <span className="ml-2 rtl:ml-0 rtl:mr-2 text-xs text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                               <AlertTriangle size={10} className="mr-1 rtl:ml-1 rtl:mr-0"/> Low
                             </span>
                           )}
                        </div>
                     </td>
                     <td className="px-6 py-4 font-mono text-gray-600">{i.costPrice} QAR</td>
                     <td className="px-6 py-4 font-mono text-gray-600">{i.sellingPrice} QAR</td>
                     <td className="px-6 py-4 text-xs text-gray-500">{i.location}</td>
                  </tr>
               ))}
               {filteredItems.length === 0 && (
                  <tr>
                     <td colSpan={7} className="text-center py-10 text-gray-500">No items found matching your criteria.</td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};
