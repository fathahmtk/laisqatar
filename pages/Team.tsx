import React, { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, UserCheck, UserX, Briefcase, Filter, Loader2 } from 'lucide-react';
import { TeamMember } from '../types';
import { getTeam } from '../services/db';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTeam();
      setMembers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || m.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'On Leave': return 'bg-yellow-100 text-yellow-700';
      case 'Inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm transition-all">
          <Plus size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left rtl:text-right"
            />
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <Filter size={18} className="text-gray-400" />
             <select 
               className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
               value={deptFilter}
               onChange={(e) => setDeptFilter(e.target.value)}
             >
               <option value="All">All Departments</option>
               <option value="Management">Management</option>
               <option value="Field Service">Field Service</option>
               <option value="Sales">Sales</option>
               <option value="Operations">Operations</option>
             </select>
          </div>
        </div>

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
                <th className="px-6 py-4 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-3 rtl:ml-3 rtl:mr-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-400">ID: {member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{member.role}</td>
                  <td className="px-6 py-4">
                     <span className="flex items-center">
                       <Briefcase size={14} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                       {member.department}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status === 'Active' ? <UserCheck size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/> : <UserX size={12} className="mr-1 rtl:ml-1 rtl:mr-0"/>}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs">
                        <Mail size={12} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                        {member.email}
                      </div>
                      <div className="flex items-center text-xs">
                        <Phone size={12} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-400" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right rtl:text-left">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};