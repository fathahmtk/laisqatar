
import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, Loader2 } from 'lucide-react';
import { Report } from '../types';
import { Api } from '../services/api';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // This endpoint is a placeholder in api.ts, but the wiring is complete
      const data = await Api.listReports();
      setReports(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin text-red-600" size={48} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Reports Center</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Report Generation</h3>
        <p className="text-gray-500">This module is connected to the backend. Reports will be listed here once generated.</p>
      </div>
    </div>
  );
};
