
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, MapPin, Printer, X } from 'lucide-react';
import { JobCard, Customer, Site } from '../types';
import { getJobs, getCustomers, getSites } from '../services/db';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [printJob, setPrintJob] = useState<JobCard | null>(null);

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

  const handlePrint = (job: JobCard) => {
    setPrintJob(job);
    setTimeout(() => window.print(), 100);
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Print Overlay */}
      {printJob && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen relative">
             <button onClick={() => setPrintJob(null)} className="absolute top-4 right-4 print:hidden p-2 bg-gray-100 rounded-full hover:bg-gray-200">
               <X size={24} />
             </button>

             <div className="border-b-2 border-gray-900 pb-6 mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">JOB CARD</h1>
                  <p className="text-gray-500 font-mono text-lg">{printJob.jobNumber}</p>
                </div>
                <div className="text-right rtl:text-left">
                  <h2 className="text-xl font-bold text-red-600">Lais Qatar</h2>
                  <p className="text-sm">Maintenance & Operations</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-8 border border-gray-200 rounded p-4">
               <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Customer</h3>
                  <p className="text-lg font-bold">{getCustomerName(printJob.customerId)}</p>
               </div>
               <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Site</h3>
                  <p className="text-lg">{getSiteName(printJob.siteId)}</p>
               </div>
               <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Job Type</h3>
                  <p>{printJob.type} {printJob.isAmcCovered && '(AMC Covered)'}</p>
               </div>
               <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Priority</h3>
                  <p>{printJob.priority}</p>
               </div>
               <div className="col-span-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Description</h3>
                  <p className="text-gray-900">{printJob.description}</p>
               </div>
             </div>

             <div className="mb-8">
               <h3 className="font-bold border-b border-gray-300 mb-4 pb-2">Checklist</h3>
               <div className="space-y-3">
                 {printJob.checklist && printJob.checklist.length > 0 ? (
                   printJob.checklist.map((item, i) => (
                     <div key={i} className="flex items-center">
                       <div className="w-5 h-5 border border-gray-400 mr-3"></div>
                       <span>{item.item}</span>
                     </div>
                   ))
                 ) : (
                   <div className="text-gray-400 italic">No checklist items defined.</div>
                 )}
               </div>
             </div>

             <div className="mb-12">
               <h3 className="font-bold border-b border-gray-300 mb-4 pb-2">Work Done & Parts Used</h3>
               <div className="h-32 border border-gray-200 rounded bg-gray-50 mb-4"></div>
             </div>

             <div className="grid grid-cols-2 gap-12 mt-20">
               <div>
                 <div className="border-b border-gray-400 h-10 mb-2"></div>
                 <p className="text-xs font-bold uppercase text-center">Technician Signature</p>
               </div>
               <div>
                 <div className="border-b border-gray-400 h-10 mb-2"></div>
                 <p className="text-xs font-bold uppercase text-center">Customer Verification</p>
               </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Job Cards</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm">
          <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Create Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
        <div className="lg:col-span-3 space-y-4">
           {jobs.map(job => (
             <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-start group">
               <div className="flex-1">
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
               <div className="flex flex-col items-end space-y-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                  <button onClick={() => handlePrint(job)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" title="Print Job Card">
                    <Printer size={18} />
                  </button>
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
