
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, MapPin, Printer, X, Save, Loader2 } from 'lucide-react';
import { JobCard, Customer, Site, TeamMember } from '../types';
import { Api } from '../services/api';

const mapBackendToJobCard = (data: any): JobCard => ({
    id: data.id.toString(),
    jobNumber: data.job_number,
    type: data.job_type,
    customerId: data.customer.toString(),
    siteId: data.site.toString(),
    contractId: data.amc_contract?.toString(),
    projectId: data.project?.toString(),
    priority: data.priority || 'Normal',
    status: data.status,
    scheduledDate: data.scheduled_date,
    assignedTechnicianId: data.assigned_technician?.toString(),
    description: data.problem_description,
    isAmcCovered: data.is_amc_covered,
});

const mapBackendToCustomer = (data: any): Customer => ({ id: data.id.toString(), name: data.name, code: data.customer_code, type: data.customer_type, email: data.email, phone: data.phone, address: data.billing_address, paymentTermsDays: data.payment_terms_days, creditLimit: parseFloat(data.credit_limit) });
const mapBackendToSite = (data: any): Site => ({ id: data.id.toString(), customerId: data.customer.toString(), name: data.site_name, code: data.site_code, address: data.address, category: data.location_type, contactPerson: data.contact_person, contactMobile: data.contact_mobile });
const mapBackendToTechnician = (data: any): TeamMember => ({ id: data.id.toString(), name: data.name, role: 'Technician', department: 'Field Service', status: 'Active', email: data.user.email, phone: data.mobile });


export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [printJob, setPrintJob] = useState<JobCard | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newJob, setNewJob] = useState<Partial<JobCard>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jData, cData, sData, tData] = await Promise.all([
          Api.listJobs(), 
          Api.listCustomers(), 
          Api.listSites(),
          Api.listTeam()
        ]);
        setJobs(jData.map(mapBackendToJobCard));
        setCustomers(cData.map(mapBackendToCustomer));
        setSites(sData.map(mapBackendToSite));
        setTechnicians(tData.map(mapBackendToTechnician));
      } catch(e) {
        console.error("Failed to fetch jobs data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id;
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || id;

  const handlePrint = (job: JobCard) => {
    setPrintJob(job);
    setTimeout(() => window.print(), 100);
  };

  const openCreateModal = () => {
    setNewJob({
      jobNumber: `J-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Corrective', priority: 'Normal', status: 'Open',
      scheduledDate: new Date().toISOString().split('T')[0],
      isAmcCovered: false,
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newJob.customerId || !newJob.siteId || !newJob.description) return;
    
    setSaving(true);
    try {
      const payload = {
        job_number: newJob.jobNumber,
        job_type: newJob.type,
        customer: newJob.customerId,
        site: newJob.siteId,
        priority: newJob.priority,
        problem_description: newJob.description,
        scheduled_date: newJob.scheduledDate,
        assigned_technician: newJob.assignedTechnicianId || null,
      };
      const created = await Api.createJob(payload);
      setJobs([mapBackendToJobCard(created), ...jobs]);
      setIsCreateModalOpen(false);
    } catch (error) {
      alert("Failed to create job");
    } finally {
      setSaving(false);
    }
  };

  const filteredSites = sites.filter(s => s.customerId === newJob.customerId);
  const getPriorityColor = (p: string) => ({'Critical':'text-red-600 bg-red-50', 'High':'text-orange-600 bg-orange-50'}[p] || 'text-blue-600 bg-blue-50');

  return (
    <div className="space-y-6">
      {isCreateModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl w-full max-w-2xl"><div className="px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">Create New Job Card</h3><button onClick={() => setIsCreateModalOpen(false)}><X size={20} /></button></div><form onSubmit={handleCreateJob} className="p-6 space-y-4">{/* Form content from original file */}</form></div></div>}
      {printJob && <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">{/* Print content from original file */}</div>}
      
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Job Cards</h1>
        <button onClick={openCreateModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"><Plus size={18} className="mr-2" /> Create Job</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:hidden">
        <div className="lg:col-span-3 space-y-4">
           {jobs.map(job => (
             <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-start group">
               <div className="flex-1">
                 <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600">{job.description}</h3>
                 <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <span className="flex items-center"><MapPin size={14} className="mr-1"/> {getSiteName(job.siteId)}</span>
                    <span className="font-medium text-gray-700">{getCustomerName(job.customerId)}</span>
                 </div>
               </div>
               <div className="flex flex-col items-end space-y-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                  <button onClick={() => handlePrint(job)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full" title="Print"><Printer size={18} /></button>
               </div>
             </div>
           ))}
        </div>
        <div className="space-y-6">{/* Filters */}</div>
      </div>
    </div>
  );
};
