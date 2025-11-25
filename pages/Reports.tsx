
import React from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { MOCK_REPORTS } from '../constants';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Reports Center</h1>
        <div className="flex space-x-3 rtl:space-x-reverse">
           <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
             <Calendar size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Last 30 Days
           </button>
           <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
             <Filter size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> Filter Type
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left rtl:text-right text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Generated Date</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right rtl:text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_REPORTS.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="bg-red-50 p-2 rounded text-red-600 mr-3 rtl:ml-3 rtl:mr-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{report.title}</div>
                      <div className="text-xs text-gray-400">{report.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4">{report.size}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${report.status === 'Ready' ? 'text-green-700 bg-green-50' : 'text-yellow-700 bg-yellow-50'}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right rtl:text-left">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center justify-end rtl:justify-start w-full">
                    <Download size={16} className="mr-1 rtl:ml-1 rtl:mr-0" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
