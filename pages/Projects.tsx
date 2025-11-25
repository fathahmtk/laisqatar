
import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/db';
import { Project } from '../types';
import { Building, DollarSign, Calendar } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map(p => (
           <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className="text-xs font-mono text-gray-500">{p.code}</span>
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                 </div>
                 <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{p.status}</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-mono font-medium">{p.budget.toLocaleString()} QAR</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cost Incurred</span>
                    <span className="font-mono font-medium text-red-600">{p.totalCost.toLocaleString()} QAR</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(p.totalCost/p.budget)*100}%`}}></div>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};
