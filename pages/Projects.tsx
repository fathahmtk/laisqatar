
import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/db';
import { Project } from '../types';
import { Building, Calendar, DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Planning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if(selectedProject) {
     return (
       <div className="space-y-6">
          <button onClick={() => setSelectedProject(null)} className="text-sm text-gray-500 hover:text-red-600">← Back to Projects</button>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
             <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
                <p className="text-gray-500 mt-1 flex items-center"><Building size={16} className="mr-2"/> {selectedProject.clientName}</p>
             </div>
             <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedProject.status)}`}>{selectedProject.status}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Financials</h3>
                <div className="mt-4 space-y-3">
                   <div className="flex justify-between"><span className="text-gray-600">Budget</span><span className="font-bold">{selectedProject.budget.toLocaleString()} QAR</span></div>
                   <div className="flex justify-between"><span className="text-gray-600">Actual Cost</span><span className="font-bold text-red-600">{selectedProject.totalCost.toLocaleString()} QAR</span></div>
                   <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{width: `${(selectedProject.totalCost / selectedProject.budget)*100}%`}}></div>
                   </div>
                   <p className="text-xs text-right text-gray-500">
                      {Math.round((selectedProject.totalCost / selectedProject.budget)*100)}% utilized
                   </p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Schedule</h3>
                <div className="mt-4 space-y-3">
                   <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/> {selectedProject.startDate} to {selectedProject.endDate}</div>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600">Progress</span>
                     <span className="font-bold">{selectedProject.progress}%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${selectedProject.progress}%`}}></div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Management</h3>
                <div className="mt-4">
                   <div className="flex items-center mb-2"><Users size={16} className="mr-2 text-gray-400"/> Manager: {selectedProject.manager}</div>
                   <button className="w-full mt-4 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50">View Team Timesheets</button>
                </div>
             </div>
          </div>
       </div>
     )
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-slate-800">New Project</button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {projects.map(p => (
            <div key={p.id} onClick={() => setSelectedProject(p)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600"><Building size={20}/></div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(p.status)}`}>{p.status}</span>
               </div>
               <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
               <p className="text-sm text-gray-500 mt-1 mb-4">{p.clientName}</p>
               
               <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Budget</span><span>{p.budget.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Progress</span><span>{p.progress}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${p.progress}%`}}></div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};
