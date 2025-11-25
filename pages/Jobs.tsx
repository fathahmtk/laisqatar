
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Search, Filter, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { JobCard, Customer, Site } from '../types';
import { getJobs, getCustomers, getSites } from '../services/db';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [jData, cData, sData] = await Promise.all([getJobs(), getCustomers(), getSites()]);
      setJobs(jData);
      setCustomers(cData);
      setSites(sData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id;
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || id;

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Job Cards</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm">
          <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Create Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
           {jobs.map(job => (
             <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-start group cursor-pointer">
               <div>
                 <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                    <span className="font-mono text-xs font-bold text-gray-500">{job.jobNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${job.type === 'Corrective' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {job.type}
                    </span>
                    {job.isAmcCovered && <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">AMC</span>}
                 </div>
                 <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">{job.description}</h3>
                 <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4 rtl:space-x-reverse">
                    <span className="flex items-center"><MapPin size={14} className="mr-1 rtl:ml-1 rtl:mr-0"/> {getSiteName(job.siteId)}</span>
                    <span className="font-medium text-gray-700">{getCustomerName(job.customerId)}</span>
                 </div>
               </div>
               <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                  <span className="text-xs text-gray-400">{job.scheduledDate}</span>
                  <span className={`text-xs font-medium ${job.status === 'Completed' ? 'text-green-600' : 'text-gray-500'}`}>{job.status}</span>
               </div>
             </div>
           ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Quick Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 rtl:space-x-reverse"><input type="checkbox" className="rounded text-red-600"/> <span className="text-sm">Critical Priority</span></label>
              <label className="flex items-center space-x-2 rtl:space-x-reverse"><input type="checkbox" className="rounded text-red-600"/> <span className="text-sm">Preventive (AMC)</span></label>
              <label className="flex items-center space-x-2 rtl:space-x-reverse"><input type="checkbox" className="rounded text-red-600"/> <span className="text-sm">Open Jobs</span></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
