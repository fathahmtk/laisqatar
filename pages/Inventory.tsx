

import React, { useState } from 'react';
import { 
  Package, Search, AlertTriangle, ArrowDown, Plus, 
  MoreHorizontal, RefreshCw, ShoppingCart, Filter 
} from 'lucide-react';
import { MOCK_INVENTORY } from '../constants';
import { InventoryItem } from '../types';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter(i => i.quantity <= i.minLevel);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-all">
          <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add New Item
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between">
          <div className="flex items-start">
             <div className="bg-red-100 p-2 rounded-lg mr-4 rtl:ml-4 rtl:mr-0 text-red-600">
               <AlertTriangle size={24} />
             </div>
             <div>
               <h3 className="font-bold text-red-900">Low Stock Alert</h3>
               <p className="text-sm text-red-700 mt-1">
                 {lowStockItems.length} items are below minimum stock level. Immediate reorder recommended.
               </p>
             </div>
          </div>
          <button className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 shadow-sm">
            Create Purchase Order
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-gray-500 text-sm font-medium">Total Items</p>
           <h3 className="text-3xl font-bold text-gray-900 mt-2">{items.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-gray-500 text-sm font-medium">Total Value</p>
           <h3 className="text-3xl font-bold text-gray-900 mt-2">
             {(items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)).toLocaleString()} QAR
           </h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
           <h3 className="text-3xl font-bold text-red-600 mt-2">{lowStockItems.length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left rtl:text-right"
            />
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
             <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
               <Filter size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Category
             </button>
             <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
               <ArrowDown size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Export
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mr-3 rtl:ml-3 rtl:mr-0 text-gray-500">
                        <Package size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-4">
                     <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-1 w-24 bg-gray-200 rounded-full h-2 mr-3 rtl:ml-3 rtl:mr-0 overflow-hidden">
                        <div 
                           className={`h-2 rounded-full ${item.quantity <= item.minLevel ? 'bg-red-500' : 'bg-green-500'}`} 
                           style={{width: `${Math.min((item.quantity / (item.minLevel * 2)) * 100, 100)}%`}}
                        ></div>
                      </div>
                      <span className={`font-bold ${item.quantity <= item.minLevel ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.quantity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">{item.unitPrice} QAR</td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                       <button className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50" title="Restock">
                         <RefreshCw size={16} />
                       </button>
                       <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                         <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
