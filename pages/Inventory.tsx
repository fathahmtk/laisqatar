
import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/db';
import { Item } from '../types';
import { Package, AlertTriangle } from 'lucide-react';

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInventory();
      setItems(data);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                  <th className="px-6 py-3">Item Code</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Cost Price</th>
               </tr>
            </thead>
            <tbody>
               {items.map(i => (
                  <tr key={i.id} className="border-b border-gray-50">
                     <td className="px-6 py-3 font-mono text-gray-500">{i.code}</td>
                     <td className="px-6 py-3 font-medium">{i.name}</td>
                     <td className="px-6 py-3">{i.category}</td>
                     <td className="px-6 py-3">
                        <span className={`font-bold ${i.stockQty <= i.minLevel ? 'text-red-600' : 'text-gray-900'}`}>{i.stockQty}</span>
                     </td>
                     <td className="px-6 py-3">{i.costPrice}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};
