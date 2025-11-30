
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Building, DollarSign, Calendar } from 'lucide-react';
import { Api } from '../services/api';

const mapBackendToProject = (data: any): Project => ({
    id: data.id.toString(),
    code: data.project_code,
    name: data.name,
    customerId: data.customer.toString(),
    siteId: data.site?.toString(),
    startDate: data.start_date,
    endDate: data.end_date,
    value: parseFloat(data.project_value),
    budget: 0, // These would require more complex queries
    totalCost: 0, // or nested serializers
    status: data.status,
    managerId: data.project_manager?.toString(),
});

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Api.listProjects();
        setProjects(data.map(mapBackendToProject));
      } catch (e) {
        console.error("Failed to fetch projects", e);
      } finally {
        setLoading(false);
      }
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
                    <span className="text-gray-500">Project Value</span>
                    <span className="font-mono font-medium">{p.value.toLocaleString()} QAR</span>
                 </div>
                 {p.budget > 0 && <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(p.totalCost/p.budget)*100}%`}}></div>
                 </div>}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};
