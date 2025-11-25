
import React, { useState } from 'react';
import { Users, Mail, Phone, MapPin, Search } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { Client } from '../types';

export const Clients: React.FC = () => {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
        <div className="relative">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-left rtl:text-right"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${client.contractStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {client.contractStatus}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{client.name}</h3>
            <p className="text-sm text-gray-500 mb-4 flex items-center">
              <MapPin size={14} className="mr-1 rtl:ml-1 rtl:mr-0" /> {client.location}
            </p>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400" />
                {client.contactPerson}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400" />
                <a href={`mailto:${client.email}`} className="hover:text-red-600">{client.email}</a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-400" />
                {client.phone}
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 rtl:space-x-reverse">
              <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                View Profile
              </button>
              <button className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Contracts
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
