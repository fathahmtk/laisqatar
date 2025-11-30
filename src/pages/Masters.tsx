
import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Box, Search, Plus, MoreHorizontal, X, Loader2, Building, Eye, FileText, Calendar, Wrench, Clock, CheckCircle2, QrCode, ScanLine, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Customer, Site, Equipment, JobCard } from '../types';
import { Api } from '../services/api';

// #region Data Mapping Functions
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

const mapBackendToEquipment = (data: any): Equipment => ({
  id: data.id.toString(),
  siteId: data.site.toString(),
  code: data.equipment_code,
  category: data.category,
  brand: data.brand,
  model: data.model,
  serialNumber: data.serial_number,
  installDate: data.install_date,
  nextServiceDue: data.next_service_due,
  isUnderAmc: data.is_under_amc,
});

const mapBackendToJobCard = (data: any): JobCard => ({
    id: data.id.toString(),
    jobNumber: data.job_number,
    type: data.job_type,
    customerId: data.customer.toString(),
    siteId: data.site.toString(),
    contractId: data.amc_contract?.toString(),
    projectId: data.project?.toString(),
    priority: data.priority,
    status: data.status,
    scheduledDate: data.scheduled_date,
    assignedTechnicianId: data.assigned_technician?.toString(),
    description: data.problem_description,
    findings: data.work_done,
    isAmcCovered: data.is_amc_covered,
    completionDate: data.actual_end,
});
// #endregion

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'sites' | 'equipment'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentModalTab, setEquipmentModalTab] = useState<'details' | 'history'>('details');
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  
  const [saving, setSaving] = useState(false);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [newSite, setNewSite] = useState<Partial<Site>>({});

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [customersData, sitesData, equipmentData, jobsData] = await Promise.all([
          Api.listCustomers(),
          Api.listSites(),
          Api.listEquipment(),
          Api.listJobs(),
        ]);
        setCustomers(customersData.map(mapBackendToCustomer));
        setSites(sitesData.map(mapBackendToSite));
        setEquipment(equipmentData.map(mapBackendToEquipment));
        setJobs(jobsData.map(mapBackendToJobCard));
      } catch (err) {
        console.error("Failed to fetch master data", err);
      }
    };
    fetchMasters();
  }, []);

  // --- Scanner Logic ---
  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: any;

    const startCamera = async () => {
      if (isScannerOpen) {
        setScanError(null);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setScanning(true);
          }
        } catch (err) {
          setScanError("Unable to access camera. Please grant permissions.");
        }
      }
    };

    if (isScannerOpen) {
      startCamera();
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        interval = setInterval(async () => {
          if (videoRef.current && scanning) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) handleScanSuccess(barcodes[0].rawValue);
            } catch (e) { /* ignore */ }
          }
        }, 500);
      }
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (interval) clearInterval(interval);
      setScanning(false);
    };
  }, [isScannerOpen]);

  const handleScanSuccess = (code: string) => {
    const match = equipment.find(e => e.code === code || e.id === code);
    if (match) {
      setIsScannerOpen(false);
      handleViewEquipment(match);
    }
  };

  const simulateScan = () => {
    if (equipment.length > 0) {
      const randomEq = equipment[Math.floor(Math.random() * equipment.length)];
      handleScanSuccess(randomEq.code);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        customer_code: newCustomer.code,
        name: newCustomer.name,
        customer_type: newCustomer.type,
        email: newCustomer.email,
        phone: newCustomer.phone,
        billing_address: newCustomer.address,
        payment_terms_days: newCustomer.paymentTermsDays,
        credit_limit: newCustomer.creditLimit
      };

      const res = await Api.createCustomer(payload);
      setCustomers([...customers, mapBackendToCustomer(res)]);
      setIsCustomerModalOpen(false);
      setNewCustomer({});
    } catch (error) {
      alert("Failed to create customer.");
    } finally {
      setSaving(false);
    }
  };

  const openAddSiteModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setNewSite({});
    setIsSiteModalOpen(true);
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setSaving(true);
    try {
      const payload = {
          customer: selectedCustomerId,
          site_name: newSite.name,
          site_code: newSite.code,
          address: newSite.address,
          location_type: newSite.category,
          contact_person: newSite.contactPerson,
          contact_mobile: newSite.contactMobile
      };
      const created = await Api.createSite(payload);
      setSites([...sites, mapBackendToSite(created)]);
      setIsSiteModalOpen(false);
    } catch (error) {
      alert("Failed to create site.");
    } finally {
      setSaving(false);
    }
  };

  const handleViewEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setEquipmentModalTab('details');
    setIsEquipmentModalOpen(true);
  };

  const getEquipmentHistory = () => {
    if (!selectedEquipment) return [];
    return jobs.filter(j => j.siteId === selectedEquipment.siteId).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  };
  
  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === id ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      <Icon size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Master Data</h1>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <TabButton id="customers" label="Customers" icon={Users} />
          <TabButton id="sites" label="Sites" icon={MapPin} />
          <TabButton id="equipment" label="Equipment" icon={Box} />
        </div>
      </div>
      
      {/* Table and modals */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between bg-gray-50">
          <div className="relative w-64">
             <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left rtl:text-right" />
             <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-2.5 text-gray-400" size={16} />
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            {activeTab === 'customers' && (
              <button onClick={() => setIsCustomerModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700 shadow-sm"><Plus size={16} className="mr-2" /> Add Customer</button>
            )}
            {activeTab === 'equipment' && (
              <button onClick={() => setIsScannerOpen(true)} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-900 shadow-sm"><ScanLine size={16} className="mr-2" /> Scan Equipment</button>
            )}
          </div>
        </div>
        
        {/* Table Content */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-600">
           {/* Table Headers */}
           <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
             {activeTab === 'customers' && (<tr><th className="px-6 py-4">Code</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Credit Limit</th><th className="px-6 py-4 text-right rtl:text-left">Actions</th></tr>)}
             {activeTab === 'sites' && (<tr><th className="px-6 py-4">Code</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Address</th><th className="px-6 py-4">Contact</th></tr>)}
             {activeTab === 'equipment' && (<tr><th className="px-6 py-4">Code</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Brand/Model</th><th className="px-6 py-4">Next Service</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right rtl:text-left">Actions</th></tr>)}
           </thead>
           {/* Table Body */}
           <tbody className="divide-y divide-gray-100">
             {activeTab === 'customers' && customers.map(c => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono">{c.code}</td><td className="px-6 py-4 font-bold text-gray-900">{c.name}</td><td className="px-6 py-4">{c.type}</td><td className="px-6 py-4">{c.phone}</td><td className="px-6 py-4">{c.creditLimit.toLocaleString()} QAR</td><td className="px-6 py-4 text-right rtl:text-left"><button onClick={() => openAddSiteModal(c.id)} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100"><MapPin size={14} className="mr-1"/> Add Site</button></td></tr>))}
             {activeTab === 'sites' && sites.map(s => (<tr key={s.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono">{s.code}</td><td className="px-6 py-4 font-bold text-gray-900">{s.name}</td><td className="px-6 py-4">{s.category}</td><td className="px-6 py-4">{s.address}</td><td className="px-6 py-4">{s.contactPerson}</td></tr>))}
             {activeTab === 'equipment' && equipment.map(e => (<tr key={e.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono">{e.code}</td><td className="px-6 py-4">{e.category}</td><td className="px-6 py-4 font-medium text-gray-900">{e.brand} {e.model}</td><td className="px-6 py-4 text-red-600">{e.nextServiceDue}</td><td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-xs ${e.isUnderAmc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{e.isUnderAmc ? 'AMC Covered' : 'Non-AMC'}</span></td><td className="px-6 py-4 text-right rtl:text-left"><div className="flex justify-end rtl:justify-start space-x-2"><button onClick={() => { setIsScannerOpen(true); }} className="text-gray-400 hover:text-slate-800 p-1 hover:bg-slate-100 rounded" title="Scan QR"><QrCode size={18} /></button><button onClick={() => handleViewEquipment(e)} className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded" title="View Details"><Eye size={18} /></button></div></td></tr>))}
           </tbody>
        </table>
      </div>

      {/* MODALS */}
      {isCustomerModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"><div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-bold text-lg text-gray-900">Add New Customer</h3><button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div><form onSubmit={handleCreateCustomer} className="p-6 space-y-4">{/* Form Content */}</form></div></div>)}
      {isSiteModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"><div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"><h3 className="font-bold text-lg text-gray-900">Add Site</h3><button onClick={() => setIsSiteModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button></div><form onSubmit={handleCreateSite} className="p-6 space-y-4">{/* Form Content */}</form></div></div>)}
      {isEquipmentModalOpen && selectedEquipment && ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden h-[80vh] flex flex-col"><div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-start"><div><h2 className="text-xl font-bold">{selectedEquipment.brand} {selectedEquipment.model}</h2></div><button onClick={() => setIsEquipmentModalOpen(false)} className="text-white/50 hover:text-white p-2 rounded-full"><X size={20} /></button></div><div className="flex border-b border-gray-200"><button onClick={() => setEquipmentModalTab('details')} className={`flex-1 py-3 text-sm font-medium ${equipmentModalTab === 'details' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}>Details</button><button onClick={() => setEquipmentModalTab('history')} className={`flex-1 py-3 text-sm font-medium ${equipmentModalTab === 'history' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}>Service History</button></div><div className="flex-1 overflow-y-auto p-6 bg-gray-50">{equipmentModalTab === 'details' ? (<div>Details View</div>) : (<div className="space-y-4">{getEquipmentHistory().map(job => (<div key={job.id} className="bg-white p-4 rounded-xl border">{job.description}</div>))}</div>)}</div></div></div>)}
      {isScannerOpen && (<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative"><button onClick={() => setIsScannerOpen(false)} className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full"><X size={20} /></button><div className="relative aspect-[3/4] bg-black"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /></div><div className="p-4 bg-slate-900"><button onClick={simulateScan} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold">Simulate Scan</button></div></div></div>)}
    </div>
  );
};
