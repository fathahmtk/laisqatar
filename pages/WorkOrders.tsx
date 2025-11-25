import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Clock, MapPin, AlertCircle, Camera, PenTool, Search, Plus, X, Filter, Loader2, Wrench
} from 'lucide-react';
import { Role, Language, WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../types';
import { generateTechnicianGuidance } from '../services/geminiService';
import { getWorkOrders, createWorkOrder } from '../services/db';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  lang: Language;
}

export const WorkOrders: React.FC<Props> = ({ lang }) => {
  const { userRole } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [guidance, setGuidance] = useState<string>('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  
  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<WorkOrderStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<WorkOrderPriority[]>([]);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<{
    title: string;
    location: string;
    priority: WorkOrderPriority;
    assignedTo: string;
  }>({
    title: '',
    location: '',
    priority: WorkOrderPriority.MEDIUM,
    assignedTo: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getWorkOrders();
      setWorkOrders(data.sort((a,b) => b.date.localeCompare(a.date)));
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleSelectOrder = async (order: WorkOrder) => {
    setSelectedOrder(order);
    if (userRole === Role.TECHNICIAN) {
      setLoadingGuidance(true);
      const help = await generateTechnicianGuidance(order);
      setGuidance(help);
      setLoadingGuidance(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order: WorkOrder = {
      id: `WO-${1000 + workOrders.length + 1}`,
      title: newOrder.title,
      location: newOrder.location,
      priority: newOrder.priority,
      status: WorkOrderStatus.OPEN,
      date: new Date().toISOString().split('T')[0],
      assignedTo: newOrder.assignedTo || 'Unassigned'
    };

    setWorkOrders([order, ...workOrders]);
    setIsCreateModalOpen(false);
    
    await createWorkOrder(order);
    setNewOrder({ title: '', location: '', priority: WorkOrderPriority.MEDIUM, assignedTo: '' });
  };

  const toggleStatus = (status: WorkOrderStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const filteredOrders = workOrders.filter(wo => {
    const matchesSearch = 
      wo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(wo.status);
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(wo.priority);

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      [WorkOrderStatus.OPEN]: 'bg-blue-100 text-blue-700',
      [WorkOrderStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700',
      [WorkOrderStatus.COMPLETED]: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status as WorkOrderStatus]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] relative">
      <div className={`${selectedOrder ? 'hidden md:block md:w-1/3' : 'w-full'} bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-4">
           <div className="flex justify-between items-center">
             <h3 className="font-bold text-gray-700">All Orders</h3>
             {userRole === Role.ADMIN && (
               <button 
                 onClick={() => setIsCreateModalOpen(true)}
                 className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-sm"
                 title="Create New Work Order"
               >
                 <Plus size={20} />
               </button>
             )}
           </div>
           
           <div className="flex gap-2">
             <div className="relative flex-1">
               <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search work orders..." 
                 className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left rtl:text-right"
               />
             </div>
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`p-2 rounded-lg border transition-colors ${
                 isFilterOpen || selectedStatuses.length > 0 || selectedPriorities.length > 0
                   ? 'bg-red-50 border-red-200 text-red-600' 
                   : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
               }`}
               title="Filters"
             >
               <Filter size={18} />
             </button>
           </div>
           
           {isFilterOpen && (
             <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Status</span>
                  <div className="flex flex-wrap gap-2">
                    {[WorkOrderStatus.OPEN, WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED].map(status => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          selectedStatuses.includes(status)
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
           )}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(wo => (
              <div 
                key={wo.id}
                onClick={() => handleSelectOrder(wo)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedOrder?.id === wo.id ? 'bg-red-50 border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 text-sm">{wo.id}</span>
                  <StatusBadge status={wo.status} />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">{wo.title}</h4>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <MapPin size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />
                  {wo.location}
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className={`font-semibold ${wo.priority === 'CRITICAL' ? 'text-red-600' : 'text-gray-500'}`}>
                     {wo.priority}
                   </span>
                   <span className="text-gray-400">{wo.date}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No work orders found.
            </div>
          )}
        </div>
      </div>

      {selectedOrder ? (
        <div className="flex-1 md:ltr:ml-6 md:rtl:mr-6 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
           <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
            <div>
               <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                 <button onClick={() => setSelectedOrder(null)} className="md:hidden text-gray-500 p-1 hover:bg-gray-100 rounded">
                    ←
                 </button>
                 <h2 className="text-xl font-bold text-gray-900">{selectedOrder.title}</h2>
               </div>
               <p className="text-gray-500 flex items-center text-sm">
                 <MapPin size={14} className="mr-1 rtl:ml-1 rtl:mr-0" /> {selectedOrder.location}
               </p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {userRole === Role.TECHNICIAN && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-8 shadow-sm">
                 <h4 className="flex items-center text-blue-900 font-bold text-sm mb-3">
                   <AlertCircle size={18} className="mr-2 rtl:ml-2 rtl:mr-0 text-blue-600" />
                   AI Safety Briefing
                 </h4>
                 {loadingGuidance ? (
                   <div className="space-y-2">
                     <div className="h-4 bg-blue-200/50 rounded animate-pulse w-3/4"></div>
                     <div className="h-4 bg-blue-200/50 rounded animate-pulse w-1/2"></div>
                   </div>
                 ) : (
                   <div className="text-sm text-blue-800 whitespace-pre-line leading-relaxed font-medium">
                     {guidance}
                   </div>
                 )}
              </div>
            )}
             <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider text-gray-500">Tasks Checklist</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((task) => (
                    <label key={task} className="flex items-start space-x-3 rtl:space-x-reverse p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                      <input type="checkbox" className="mt-1 w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Check connection points for corrosion and loose fittings at zone {task}.</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider text-gray-500">Field Evidence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all group">
                    <Camera size={28} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </button>
                   <button className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all group">
                    <PenTool size={28} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">Customer Sign</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-300 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 ml-6 rtl:ml-0 rtl:mr-6">
           <div className="text-center">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench size={32} className="opacity-50" />
             </div>
             <p className="font-medium text-gray-400">Select a work order to view details</p>
           </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Create New Work Order</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Title</label>
                <input required type="text" value={newOrder.title} onChange={e => setNewOrder({...newOrder, title: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 outline-none text-left rtl:text-right" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <input required type="text" value={newOrder.location} onChange={e => setNewOrder({...newOrder, location: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-500 outline-none text-left rtl:text-right" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                  <select value={newOrder.priority} onChange={e => setNewOrder({...newOrder, priority: e.target.value as WorkOrderPriority})} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none bg-white">
                    <option value={WorkOrderPriority.LOW}>Low</option>
                    <option value={WorkOrderPriority.MEDIUM}>Medium</option>
                    <option value={WorkOrderPriority.HIGH}>High</option>
                    <option value={WorkOrderPriority.CRITICAL}>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign To</label>
                  <input type="text" value={newOrder.assignedTo} onChange={e => setNewOrder({...newOrder, assignedTo: e.target.value})} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none text-left rtl:text-right" />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end space-x-3 rtl:space-x-reverse border-t border-gray-100 mt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Create Work Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};