import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Box, Search, Plus, MoreHorizontal, X, Loader2, Building, Eye, FileText, Calendar, Wrench, Clock, CheckCircle2, QrCode, ScanLine, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { Customer, Site, Equipment, JobCard } from '../types';
import { getSites, getEquipment, getJobs, createSite } from '../services/db';
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

  // Helper to map backend snake_case to frontend camelCase
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

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        // Fetch Customers from Django API
        const customersData = await Api.listCustomers();
        setCustomers(customersData.map(mapBackendToCustomer));

        // Fetch others from Firebase/Mock (Migrate these later)
        const [s, e, j] = await Promise.all([
          getSites(), 
          getEquipment(),
          getJobs()
        ]);
        setSites(s);
        setEquipment(e);
        setJobs(j);
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
          console.error("Camera error:", err);
          setScanError("Unable to access camera. Please ensure permissions are granted.");
        }
      }
    };

    if (isScannerOpen) {
      startCamera();
      
      // Basic polling for "BarcodeDetector" if available in browser
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        interval = setInterval(async () => {
          if (videoRef.current && scanning) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes.length > 0) {
                handleScanSuccess(barcodes[0].rawValue);
              }
            } catch (e) {
              // Ignore detection errors
            }
          }
        }, 500);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (interval) clearInterval(interval);
      setScanning(false);
    };
  }, [isScannerOpen]);

  const handleScanSuccess = (code: string) => {
    // Find equipment by ID or Code
    const match = equipment.find(e => e.code === code || e.id === code);
    if (match) {
      setIsScannerOpen(false);
      handleViewEquipment(match);
    } else {
      // Optional: Alert if not found, but usually better to just keep scanning or show toast
      // For now, we assume if we simulate, we pass a valid ID
    }
  };

  const simulateScan = () => {
    if (equipment.length > 0) {
      // Randomly pick an equipment to simulate a successful scan
      const randomEq = equipment[Math.floor(Math.random() * equipment.length)];
      handleScanSuccess(randomEq.code);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map frontend fields to backend expectations
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
      setNewCustomer({
        code: '',
        name: '',
        type: 'Corporate',
        email: '',
        phone: '',
        address: '',
        paymentTermsDays: 30,
        creditLimit: 0
      });
    } catch (error) {
      console.error("Failed to create customer", error);
      alert("Failed to create customer. Please check the backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const openAddSiteModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setNewSite({
      code: '',
      name: '',
      address: '',
      category: 'Commercial',
      contactPerson: '',
      contactMobile: ''
    });
    setIsSiteModalOpen(true);
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) return;
    setSaving(true);
    try {
      const siteData = { ...newSite, customerId: selectedCustomerId } as Omit<Site, 'id'>;
      const created = await createSite(siteData);
      setSites([...sites, created]);
      setIsSiteModalOpen(false);
      alert(`Site added successfully for ${customers.find(c => c.id === selectedCustomerId)?.name}`);
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
    // Filter jobs related to the site where this equipment is installed
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
            {/* Context Aware Add Button */}
            {activeTab === 'customers' && (
              <button 
                onClick={() => setIsCustomerModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700 shadow-sm transition-colors"
              >
                 <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add Customer
              </button>
            )}

            {activeTab === 'equipment' && (
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-900 shadow-sm transition-colors"
              >
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
                   <button 
                     onClick={() => openAddSiteModal(c.id)}
                     className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors"
                   >
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
                      {e.isUnderAmc ? 'AMC Covered' : 'Non-AMC'}
                    </span>
                 </td>
                 <td className="px-6 py-4 text-right rtl:text-left">
                    <div className="flex justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                      {/* Scan Button next to item */}
                      <button 
                         onClick={() => { setIsScannerOpen(true); }}
                         className="text-gray-400 hover:text-slate-800 p-1 hover:bg-slate-100 rounded"
                         title="Scan QR"
                       >
                          <QrCode size={18} />
                       </button>

                       <button 
                        onClick={() => handleViewEquipment(e)}
                        className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                         <Eye size={18} />
                      </button>
                    </div>
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
            <button 
              onClick={() => setIsScannerOpen(false)} 
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm"
            >
              <X size={20} />
            </button>
            
            <div className="relative aspect-[3/4] bg-black">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted 
                 className="w-full h-full object-cover opacity-80"
               />
               
               {/* Scanning Overlay */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 border-2 border-red-500 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-500 -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-500 -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-500 -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-500 -mb-1 -mr-1"></div>
                    <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                 </div>
               </div>
               
               {/* Messages */}
               <div className="absolute bottom-8 inset-x-0 text-center pointer-events-none">
                  <p className="text-white font-medium text-lg drop-shadow-md">Point at Equipment QR Code</p>
                  <p className="text-white/70 text-sm mt-1">Searching...</p>
               </div>
               
               {scanError && (
                 <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center">
                    <div>
                      <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                      <p className="text-white font-bold mb-2">Scanner Error</p>
                      <p className="text-gray-300 text-sm">{scanError}</p>
                    </div>
                 </div>
               )}
            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-800">
               <button 
                 onClick={simulateScan}
                 className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-colors"
               >
                 <RefreshCw size={18} className="mr-2" /> Simulate Scan (Demo)
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Add New Customer</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Code</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="CUST-00X"
                    value={newCustomer.code}
                    onChange={e => setNewCustomer({...newCustomer, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white"
                    value={newCustomer.type}
                    onChange={e => setNewCustomer({...newCustomer, type: e.target.value as any})}
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Individual">Individual</option>
                    <option value="Government">Government</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  placeholder="Company LLC"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="contact@company.com"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="+974..."
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                <textarea 
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  placeholder="Street, Zone, Building..."
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms (Days)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    value={newCustomer.paymentTermsDays}
                    onChange={e => setNewCustomer({...newCustomer, paymentTermsDays: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (QAR)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    value={newCustomer.creditLimit}
                    onChange={e => setNewCustomer({...newCustomer, creditLimit: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                <button 
                  type="button" 
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Save Customer
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
                 <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Building size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg text-gray-900">Add Site</h3>
                    <p className="text-xs text-gray-500">For {customers.find(c => c.id === selectedCustomerId)?.name}</p>
                 </div>
              </div>
              <button onClick={() => setIsSiteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSite} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Code</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="S-00X"
                    value={newSite.code}
                    onChange={e => setNewSite({...newSite, code: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white"
                    value={newSite.category}
                    onChange={e => setNewSite({...newSite, category: e.target.value as any})}
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Residential">Residential</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  placeholder="Building Name / Warehouse No."
                  value={newSite.name}
                  onChange={e => setNewSite({...newSite, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
                <textarea 
                  required
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  placeholder="Full physical address..."
                  value={newSite.address}
                  onChange={e => setNewSite({...newSite, address: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="Site Manager"
                    value={newSite.contactPerson}
                    onChange={e => setNewSite({...newSite, contactPerson: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input 
                    type="tel" 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                    placeholder="+974..."
                    value={newSite.contactMobile}
                    onChange={e => setNewSite({...newSite, contactMobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                <button 
                  type="button" 
                  onClick={() => setIsSiteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Save Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Details Modal */}
      {isEquipmentModalOpen && selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
             {/* Header */}
             <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-start">
                <div>
                   <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">{selectedEquipment.code}</span>
                      {selectedEquipment.isUnderAmc && <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">AMC Active</span>}
                   </div>
                   <h2 className="text-xl font-bold">{selectedEquipment.brand} {selectedEquipment.model}</h2>
                   <p className="text-slate-400 text-sm">{selectedEquipment.category}</p>
                </div>
                <button onClick={() => setIsEquipmentModalOpen(false)} className="text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                   <X size={20} />
                </button>
             </div>

             {/* Tabs */}
             <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setEquipmentModalTab('details')}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${equipmentModalTab === 'details' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText size={16} className="mr-2 rtl:ml-2 rtl:mr-0"/> Details
                </button>
                <button 
                  onClick={() => setEquipmentModalTab('history')}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center border-b-2 transition-colors ${equipmentModalTab === 'history' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <Clock size={16} className="mr-2 rtl:ml-2 rtl:mr-0"/> Service History
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {equipmentModalTab === 'details' && (
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Technical Specs</h3>
                         <div className="space-y-4">
                            <div>
                               <label className="text-xs text-gray-500 block">Serial Number</label>
                               <span className="font-mono text-gray-900">{selectedEquipment.serialNumber}</span>
                            </div>
                            <div>
                               <label className="text-xs text-gray-500 block">Brand</label>
                               <span className="text-gray-900 font-medium">{selectedEquipment.brand}</span>
                            </div>
                            <div>
                               <label className="text-xs text-gray-500 block">Model</label>
                               <span className="text-gray-900">{selectedEquipment.model}</span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Location & Installation</h3>
                         <div className="space-y-4">
                            <div>
                               <label className="text-xs text-gray-500 block">Installation Date</label>
                               <span className="text-gray-900">{selectedEquipment.installDate}</span>
                            </div>
                            <div>
                               <label className="text-xs text-gray-500 block">Next Service Due</label>
                               <span className="text-red-600 font-bold">{selectedEquipment.nextServiceDue}</span>
                            </div>
                            <div>
                               <label className="text-xs text-gray-500 block">Site ID</label>
                               <span className="font-mono text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">{selectedEquipment.siteId}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {equipmentModalTab === 'history' && (
                   <div className="space-y-4">
                      {getEquipmentHistory().length > 0 ? (
                        getEquipmentHistory().map(job => (
                           <div key={job.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                 <div className="bg-blue-50 p-2 rounded-full text-blue-600 mt-1">
                                    <Wrench size={16} />
                                 </div>
                                 <div>
                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                       <span className="font-bold text-gray-900">{job.description}</span>
                                       <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono">{job.jobNumber}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                       {job.findings || "No findings recorded."}
                                    </p>
                                    <div className="flex items-center mt-3 text-xs text-gray-400 space-x-4 rtl:space-x-reverse">
                                       <span className="flex items-center"><Calendar size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> {job.completionDate ? job.completionDate.split('T')[0] : job.scheduledDate}</span>
                                       <span className="flex items-center"><Users size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> {job.assignedTechnicianId || 'Unassigned'}</span>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 {job.status === 'Completed' ? (
                                    <span className="flex items-center text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                       <CheckCircle2 size={12} className="mr-1 rtl:ml-1 rtl:mr-0" /> Completed
                                    </span>
                                 ) : (
                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                       {job.status}
                                    </span>
                                 )}
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                           <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                              <Clock size={24} />
                           </div>
                           <h3 className="text-gray-900 font-bold">No Service History</h3>
                           <p className="text-gray-500 text-sm">No completed maintenance jobs found for this site.</p>
                        </div>
                      )}
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};