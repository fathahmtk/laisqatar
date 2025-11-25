import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { AlertTriangle, TrendingUp, Users, CheckCircle, AlertOctagon } from 'lucide-react';
import { TEXTS, MOCK_NOTIFICATIONS } from '../constants';
import { Language } from '../types';
import { getContracts, getWorkOrders, getInvoices } from '../services/db';

interface Props {
  lang: Language;
}

const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#6366F1'];

export const Dashboard: React.FC<Props> = ({ lang }) => {
  // Real Data States
  const [stats, setStats] = useState({
    activeContracts: 0,
    totalRevenue: 0,
    criticalIssues: 0,
    complianceRate: 98
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      // Fetch Collections
      const [contracts, workOrders, invoices] = await Promise.all([
        getContracts(),
        getWorkOrders(),
        getInvoices()
      ]);

      // Calculate Stats
      const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
      const critical = workOrders.filter(w => w.priority === 'CRITICAL').length;
      const totalRevenue = invoices.reduce((sum, inv) => inv.status === 'PAID' ? sum + inv.amount : sum, 0);

      setStats({
        activeContracts,
        totalRevenue,
        criticalIssues: critical,
        complianceRate: 98 // Hardcoded for now
      });

      // Prepare Chart Data (Mocking monthly distribution for demo visualization based on totals)
      setChartData([
         { name: 'Jan', revenue: totalRevenue * 0.1, jobs: workOrders.length * 0.1 },
         { name: 'Feb', revenue: totalRevenue * 0.15, jobs: workOrders.length * 0.2 },
         { name: 'Mar', revenue: totalRevenue * 0.25, jobs: workOrders.length * 0.3 },
         { name: 'Apr', revenue: totalRevenue * 0.2, jobs: workOrders.length * 0.2 },
         { name: 'May', revenue: totalRevenue * 0.3, jobs: workOrders.length * 0.2 }
      ]);

      const preventive = workOrders.filter(w => w.title.toLowerCase().includes('check') || w.title.toLowerCase().includes('inspection')).length;
      const emergency = workOrders.filter(w => w.priority === 'CRITICAL' || w.priority === 'HIGH').length;
      
      setPieData([
        { name: 'Preventive', value: preventive || 5 },
        { name: 'Corrective', value: workOrders.length - preventive - emergency || 2 },
        { name: 'Emergency', value: emergency || 1 },
      ]);
    };

    loadDashboardData();
  }, []);

  const slaBreaches = MOCK_NOTIFICATIONS.filter(n => n.type === 'SLA_BREACH');

  const statCards = [
    { label: "Total Active Contracts", value: stats.activeContracts.toString(), change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Revenue (QAR)", value: (stats.totalRevenue / 1000).toFixed(1) + 'k', change: "+8%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { label: "Critical Issues", value: stats.criticalIssues.toString(), change: "-2", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    { label: "Compliance Rate", value: stats.complianceRate + "%", change: "+1%", icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{TEXTS.dashboard[lang]}</h1>
        <div className="text-sm text-gray-500">Live Data from Firestore</div>
      </div>

      {slaBreaches.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-4">
          <h3 className="flex items-center text-red-800 font-bold mb-3">
            <AlertOctagon className="mr-2 rtl:ml-2 rtl:mr-0 text-red-600" />
            Urgent: SLA Breaches Detected
          </h3>
          <div className="space-y-2">
            {slaBreaches.map(breach => (
              <div key={breach.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex items-start justify-between">
                <div>
                   <span className="font-semibold text-gray-800 block text-sm">{breach.title}</span>
                   <span className="text-gray-600 text-xs">{breach.message}</span>
                </div>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full whitespace-nowrap">
                   {breach.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </span>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">{TEXTS.revenue[lang]}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6">Job Distribution</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex justify-center space-x-4 text-xs text-gray-500 mt-4">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i]}}></span>
                    {d.name}
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};