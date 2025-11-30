
import React, { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, UserCheck, UserX, Briefcase, Filter, Loader2 } from 'lucide-react';
import { TeamMember } from '../types';
import { Api } from '../services/api';

const mapBackendToTechnician = (data: any): TeamMember => ({
    id: data.id.toString(),
    name: data.name,
    role: 'Technician',
    department: 'Field Service',
    status: data.is_active ? 'Active' : 'Inactive',
    email: data.user?.email || 'N/A',
    phone: data.mobile,
});

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Api.listTeam();
        setMembers(data.map(mapBackendToTechnician));
      } catch (e) {
        console.error("Failed to fetch team data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm">
          <Plus size={18} className="mr-2" /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold mr-3">{member.name.charAt(0)}</div>
                      <div>
                        <div className="font-bold text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-400">ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{member.role}</td>
                  <td className="px-6 py-4">{member.department}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{member.status}</span></td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col space-y-1">
                       <div className="flex items-center text-xs"><Mail size={12} className="mr-2"/>{member.email}</div>
                       <div className="flex items-center text-xs"><Phone size={12} className="mr-2"/>{member.phone}</div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
