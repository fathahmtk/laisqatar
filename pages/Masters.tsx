
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Box, Search, Plus, MoreHorizontal, X, Loader2, Building } from 'lucide-react';
import { Customer, Site, Equipment } from '../types';
import { getCustomers, getSites, getEquipment, createCustomer, createSite } from '../services/db';

export const Masters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'sites' | 'equipment'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  
  // Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
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

  useEffect(() => {
    const fetchMasters = async () => {
      const [c, s, e] = await Promise.all([getCustomers(), getSites(), getEquipment()]);
      setCustomers(c);
      setSites(s);
      setEquipment(e);
    };
    fetchMasters();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createCustomer(newCustomer as Omit<Customer, 'id'>);
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
      alert("Failed to create customer.");
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
          
          {/* Context Aware Add Button */}
          {activeTab === 'customers' && (
            <button 
              onClick={() => setIsCustomerModalOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-red-700 shadow-sm transition-colors"
            >
               <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add Customer
            </button>
          )}
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
    </div>
  );
};
