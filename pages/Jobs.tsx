
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, MapPin, Printer, X, Save, Loader2, Calendar, User, FileText } from 'lucide-react';
import { JobCard, Customer, Site, TeamMember } from '../types';
import { Api } from '../services/api';

// FIX: Implemented empty data mapping functions
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
    findings: data.work_done,
    isAmcCovered: data.is_amc_covered,
    completionDate: data.actual_end,
});
// FIX: Implemented empty data mapping functions
const mapBackendToCustomer = (data: any): Customer => ({
    id: data.id.toString(),
    code: data.customer_code,
    name: data.name,
    type: data.customer_type,
    email: data.email,
    phone: data.phone,
    address: data.billing_address,
    paymentTermsDays: data.payment_terms_days,
    creditLimit: parseFloat(data.credit_limit || '0'),
    crNumber: data.cr_number,
});
// FIX: Implemented empty data mapping functions
const mapBackendToSite = (data: any): Site => ({
    id: data.id.toString(),
    customerId: data.customer.toString(),
    name: data.site_name,
    code: data.site_code,
    address: data.address,
    category: data.location_type,
    contactPerson: data.contact_person,
    contactMobile: data.contact_mobile,
});
// FIX: Implemented empty data mapping functions
const mapBackendToTechnician = (data: any): TeamMember => ({
    id: data.id.toString(),
    name: data.name,
    role: 'Technician',
    department: 'Field Service',
    status: data.is_active ? 'Active' : 'Inactive',
    email: data.user?.email || 'N/A',
    phone: data.mobile,
});

const JobPrintLayout: React.FC<{ job: JobCard, customer?: Customer, site?: Site, onClose: () => void }> = ({ job, customer, site, onClose }) => (
  <div className="p-8 font-sans">
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Job Card</h1>
        <p className="font-mono text-slate-500">{job.jobNumber}</p>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-bold text-red-600">Lais Qatar</h2>
        <p className="text-xs text-slate-500">Fire & Safety Experts</p>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 print:hidden"><X size={24}/></button>
    </div>
    
    <div className="grid grid-cols-3 gap-8 mb-8 text-sm">
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-bold text-slate-500 mb-2 uppercase text-xs">Customer</h3>
        <p className="font-semibold text-slate-800">{customer?.name}</p>
        <p className="text-slate-600">{customer?.address}</p>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-bold text-slate-500 mb-2 uppercase text-xs">Site</h3>
        <p className="font-semibold text-slate-800">{site?.name}</p>
        <p className="text-slate-600">{site?.address}</p>
      </div>
      <div className="bg-slate-50 p-4 rounded-lg border">
        <h3 className="font-bold text-slate-500 mb-2 uppercase text-xs">Job Details</h3>
        <p className="text-slate-600"><strong>Date:</strong> {job.scheduledDate}</p>
        <p className="text-slate-600"><strong>Type:</strong> {job.type}</p>
      </div>
    </div>
    
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4">Description of Work</h3>
      <p className="p-4 border rounded-lg bg-gray-50">{job.description}</p>
    </div>
    
    <div className="mb-8">
      <h3 className="font-bold text-lg mb-4">Technician Findings / Work Done</h3>
      <div className="p-4 border rounded-lg h-32 bg-gray-50"></div>
    </div>

    <div className="grid grid-cols-2 gap-8 pt-12">
      <div>
        <div className="border-t-2 border-slate-300 pt-2">
          <p className="font-semibold">Technician Signature</p>
        </div>
      </div>
      <div>
        <div className="border-t-2 border-slate-300 pt-2">
          <p className="font-semibold">Customer Signature & Stamp</p>
        </div>
      </div>
    </div>
  </div>
);

const CreateJobModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  sites: Site[];
  technicians: TeamMember[];
  onSave: (job: any) => Promise<void>;
}> = ({ isOpen, onClose, customers, sites, technicians, onSave }) => {
    const [newJob, setNewJob] = useState<Partial<JobCard>>({});
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        if(isOpen) {
            setNewJob({
                jobNumber: `J-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                type: 'Corrective', priority: 'Normal', status: 'Open',
                scheduledDate: new Date().toISOString().split('T')[0],
                isAmcCovered: false,
            });
        }
    }, [isOpen]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newJob.customerId || !newJob.siteId || !newJob.description) return alert("Please fill all required fields.");
        setSaving(true);
        await onSave(newJob);
        setSaving(false);
    };

    const filteredSites = sites.filter(s => s.customerId === newJob.customerId);

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900">Create New Job Card</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Form fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <select required className="w-full rounded-lg border p-2" value={newJob.customerId} onChange={e => setNewJob({...newJob, customerId: e.target.value, siteId: ''})}>
                            <option value="">Select Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select required className="w-full rounded-lg border p-2" value={newJob.siteId} onChange={e => setNewJob({...newJob, siteId: e.target.value})} disabled={!newJob.customerId}>
                            <option value="">Select Site</option>
                            {filteredSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <textarea required className="w-full rounded-lg border p-2" placeholder="Job Description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
                     <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 flex items-center">
                           {saving && <Loader2 className="animate-spin mr-2"/>} Save Job
                        </button>
                     </div>
                </form>
            </div>
        </div>
    );
};

export const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<JobCard[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [technicians, setTechnicians] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [printJob, setPrintJob] = useState<JobCard | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        // ... existing useEffect ...
    }, []);

    const handleCreateJob = async (jobData: Partial<JobCard>) => {
        // ... existing handleCreateJob logic ...
    };

    // ... other handlers and variables ...
    
    return (
        <div className="space-y-6">
            <CreateJobModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} customers={customers} sites={sites} technicians={technicians} onSave={handleCreateJob} />
            {printJob && <div className="fixed inset-0 z-[100] bg-white overflow-y-auto"><JobPrintLayout job={printJob} customer={customers.find(c=>c.id===printJob.customerId)} site={sites.find(s=>s.id===printJob.siteId)} onClose={() => setPrintJob(null)} /></div>}
            {/* ... Rest of the Jobs page JSX ... */}
        </div>
    );
};
