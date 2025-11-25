
import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Box, Search, Plus, MoreHorizontal, X, Loader2, Building, Eye, FileText, Calendar, Wrench, Clock, CheckCircle2, QrCode, ScanLine, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Customer, Site, Equipment, JobCard } from '../types';
import { Api } from '../services/api';

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'sites' | 'equipment'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  
  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Equipment Detail Modal
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [equipmentModalTab, setEquipmentModalTab] = useState<'details' | 'history'>('details');
  
  // Scanner Modal
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  
  const [saving, setSaving] = useState(false);

  // Form State - Customer
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    code: '',
    name: '',
    type: 'Corporate',
    email: '',
    phone: '',
    address: '',
    paymentTermsDays: 30,
    creditLimit: 0
  });

  // Form State - Site
  const [newSite, setNewSite] = useState<Partial<Site>>({
    code: '',
    name: '',
    address: '',
    category: 'Commercial',
    contactPerson: '',
    contactMobile: ''
  });

  // Mappers
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
    crNumber: data.cr_number
  });

  const mapBackendToSite = (data: any): Site => ({
    id: data.id.toString(),
    customerId: data.customer.toString(),
    name: data.site_name,
    code: data.site_code,
    address: data.address,
    category: data.location_type || 'Commercial',
    contactPerson: data.contact_person,
    contactMobile: data.contact_mobile
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
    isUnderAmc: data.is_under_amc
  });

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [cData, sData, eData, jData] = await Promise.all([
          Api.listCustomers(),
          Api.listSites(),
          Api.listEquipment(),
          Api.listJobs()
        ]);

        setCustomers(cData.map(mapBackendToCustomer));
        setSites(sData.map(mapBackendToSite));
        setEquipment(eData.map(mapBackendToEquipment));
        // Jobs might need detailed mapping, assuming basic compatibility for now
        setJobs(jData.map((j: any) => ({ ...j, id: j.id.toString(), scheduledDate: j.scheduled_date })));
      } catch (err) {
        console.error("Failed to fetch master data from API", err);
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
          console.error("Camera error:", err);
          setScanError("Unable to access camera. Please ensure permissions are granted.");
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
              if (barcodes.length > 0) {
                handleScanSuccess(barcodes[0].rawValue);
              }
            } catch (e) { }
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
      const created = mapBackendToCustomer(res);
      
      setCustomers([...customers, created]);
      setIsCustomerModalOpen(false);
      setNewCustomer({ code: '', name: '', type: 'Corporate', email: '', phone: '', address: '', paymentTermsDays: 30, creditLimit: 0 });
    } catch (error) {
      console.error("Failed to create customer", error);
      alert("Failed to create customer. Backend error.");
    } finally {
      setSaving(false);
    }
  };

  const openAddSiteModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setNewSite({ code: '', name: '', address: '', category: 'Commercial', contactPerson: '', contactMobile: '' });
    setIsSiteModalOpen(true);
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setSaving(true);
    try {
      const payload = {
        customer: selectedCustomerId,
        site_code: newSite.code,
        site_name: newSite.name,
        address: newSite.address,
        location_type: newSite.category,
        contact_person: newSite.contactPerson,
        contact_mobile: newSite.contactMobile
      };

      const res = await Api.createSite(payload);
      const created = mapBackendToSite(res);
      
      setSites([...sites, created]);
      setIsSiteModalOpen(false);
      alert("Site added successfully!");
    } catch (error) {
      console.error("Failed to create site", error);
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between bg-gray-50">
          <div className="relative w-64">
             <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-left rtl:text-right" />
             <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-2.5 text-gray-400" size={16} />
          </div>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            {activeTab === 'customers' && (
              <button onClick={() => setIsCustomerModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700 shadow-sm transition-colors">
                 <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add Customer
              </button>
            )}
            {activeTab === 'equipment' && (
              <button onClick={() => setIsScannerOpen(true)} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-900 shadow-sm transition-colors">
                 <ScanLine size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Scan Equipment
              </button>
            )}
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            {activeTab === 'customers' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Type</th>
                 <th className="px-6 py-4">Contact</th>
                 <th className="px-6 py-4">Credit Limit</th>
                 <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
               </tr>
            )}
            {activeTab === 'sites' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Address</th>
                 <th className="px-6 py-4">Contact</th>
               </tr>
            )}
            {activeTab === 'equipment' && (
               <tr>
                 <th className="px-6 py-4">Code</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Brand/Model</th>
                 <th className="px-6 py-4">Next Service</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
               </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-100">
             {activeTab === 'customers' && customers.map(c => (
               <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                 <td className="px-6 py-4 font-mono">{c.code}</td>
                 <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                 <td className="px-6 py-4">{c.type}</td>
                 <td className="px-6 py-4">{c.phone}</td>
                 <td className="px-6 py-4">{c.creditLimit.toLocaleString()} QAR</td>
                 <td className="px-6 py-4 text-right rtl:text-left">
                   <button onClick={() => openAddSiteModal(c.id)} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors">
                     <MapPin size={14} className="mr-1 rtl:ml-1 rtl:mr-0" /> Add Site
                   </button>
                 </td>
               </tr>
             ))}
             {activeTab === 'sites' && sites.map(s => (
               <tr key={s.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-mono">{s.code}</td>
                 <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                 <td className="px-6 py-4">{s.category}</td>
                 <td className="px-6 py-4">{s.address}</td>
                 <td className="px-6 py-4">{s.contactPerson}</td>
               </tr>
             ))}
             {activeTab === 'equipment' && equipment.map(e => (
               <tr key={e.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 font-mono">{e.code}</td>
                 <td className="px-6 py-4">{e.category}</td>
                 <td className="px-6 py-4 font-medium text-gray-900">{e.brand} {e.model}</td>
                 <td className="px-6 py-4 text-red-600">{e.nextServiceDue}</td>
                 <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${e.isUnderAmc ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {e.isUnderAmc ? 'AMC Active' : 'Non-AMC'}
                    </span>
                 </td>
                 <td className="px-6 py-4 text-right rtl:text-left">
                    <div className="flex justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                      <button onClick={() => { setIsScannerOpen(true); }} className="text-gray-400 hover:text-slate-800 p-1 hover:bg-slate-100 rounded" title="Scan QR">
                          <QrCode size={18} />
                       </button>
                       <button onClick={() => handleViewEquipment(e)} className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded" title="View Details">
                         <Eye size={18} />
                      </button>
                    </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* Create Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Add New Customer</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Code</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="CUST-00X" value={newCustomer.code} onChange={e => setNewCustomer({...newCustomer, code: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none bg-white" value={newCustomer.type} onChange={e => setNewCustomer({...newCustomer, type: e.target.value as any})}>
                    <option value="Corporate">Corporate</option>
                    <option value="Individual">Individual</option>
                    <option value="Government">Government</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="Company LLC" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="contact@company.com" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="+974..." value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                <textarea rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="Street, Zone, Building..." value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <input type="number" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={newCustomer.paymentTermsDays} onChange={e => setNewCustomer({...newCustomer, paymentTermsDays: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                  <input type="number" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" value={newCustomer.creditLimit} onChange={e => setNewCustomer({...newCustomer, creditLimit: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center">
                  {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Site Modal */}
      {isSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                 <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Building size={20} /></div>
                 <div>
                    <h3 className="font-bold text-lg text-gray-900">Add Site</h3>
                    <p className="text-xs text-gray-500">For {customers.find(c => c.id === selectedCustomerId)?.name}</p>
                 </div>
              </div>
              <button onClick={() => setIsSiteModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSite} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Code</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="S-00X" value={newSite.code} onChange={e => setNewSite({...newSite, code: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none bg-white" value={newSite.category} onChange={e => setNewSite({...newSite, category: e.target.value as any})}>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Residential">Residential</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="Name" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea required rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="Address" value={newSite.address} onChange={e => setNewSite({...newSite, address: e.target.value})}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="Manager" value={newSite.contactPerson} onChange={e => setNewSite({...newSite, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input type="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 outline-none" placeholder="+974..." value={newSite.contactMobile} onChange={e => setNewSite({...newSite, contactMobile: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                <button type="button" onClick={() => setIsSiteModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center">
                  {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scanner & Equipment Details Modals (Preserved from original) */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
            <button onClick={() => setIsScannerOpen(false)} className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm"><X size={20} /></button>
            <div className="relative aspect-[3/4] bg-black">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 border-2 border-red-500 rounded-2xl relative">
                    <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                 </div>
               </div>
               <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none">
                  <p className="text-white font-medium text-lg drop-shadow-md">Point at Equipment QR Code</p>
               </div>
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800">
               <button onClick={simulateScan} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors"><RefreshCw size={18} className="mr-2" /> Simulate Scan</button>
            </div>
          </div>
        </div>
      )}

      {isEquipmentModalOpen && selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
             <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-start">
                <div>
                   <h2 className="text-xl font-bold">{selectedEquipment.brand} {selectedEquipment.model}</h2>
                   <p className="text-slate-400 text-sm">{selectedEquipment.category}</p>
                </div>
                <button onClick={() => setIsEquipmentModalOpen(false)} className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
             </div>
             <div className="flex border-b border-gray-200">
                <button onClick={() => setEquipmentModalTab('details')} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${equipmentModalTab === 'details' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><FileText size={16} className="mr-2 rtl:ml-2 rtl:mr-0"/> Details</button>
                <button onClick={() => setEquipmentModalTab('history')} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${equipmentModalTab === 'history' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Clock size={16} className="mr-2 rtl:ml-2 rtl:mr-0"/> History</button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {equipmentModalTab === 'details' && (
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Specs</h3>
                         <div className="space-y-2">
                            <p className="text-sm"><span className="text-gray-500">Serial:</span> {selectedEquipment.serialNumber}</p>
                            <p className="text-sm"><span className="text-gray-500">Model:</span> {selectedEquipment.model}</p>
                         </div>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status</h3>
                         <p className="text-sm"><span className="text-gray-500">Next Service:</span> <span className="text-red-600 font-bold">{selectedEquipment.nextServiceDue}</span></p>
                      </div>
                   </div>
                )}
                {equipmentModalTab === 'history' && (
                   <div className="space-y-4">
                      {getEquipmentHistory().length > 0 ? getEquipmentHistory().map(j => (
                         <div key={j.id} className="bg-white p-4 rounded border border-gray-200 flex justify-between">
                            <div>
                               <p className="font-bold text-gray-900">{j.description}</p>
                               <p className="text-xs text-gray-500">{j.jobNumber}</p>
                            </div>
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded self-start">{j.status}</span>
                         </div>
                      )) : <div className="text-center py-10 text-gray-500">No history found.</div>}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
