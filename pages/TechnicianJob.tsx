
import React, { useState } from 'react';
import { JobCard } from '../types';
import { Camera, CheckSquare, PenTool, Save, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { updateJobStatus } from '../services/db';

export const TechnicianJob: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [checklist, setChecklist] = useState<{item: string, checked: boolean}[]>([]);
  const [saving, setSaving] = useState(false);

  // In production, fetch assigned jobs for current user via useEffect
  const jobs = MOCK_JOBS;

  const handleStartJob = (job: JobCard) => {
    setSelectedJob(job);
    setChecklist(job.checklist || []);
  };

  const toggleCheck = (idx: number) => {
    const newCheck = [...checklist];
    newCheck[idx].checked = !newCheck[idx].checked;
    setChecklist(newCheck);
  };

  const handleCompleteJob = async () => {
    if (!selectedJob) return;
    setSaving(true);
    
    // Simulate API call
    await updateJobStatus(selectedJob.id, 'Completed', { 
      checklist, 
      completionDate: new Date().toISOString() 
    });

    setSaving(false);
    alert('Job Completed Successfully!');
    setSelectedJob(null);
  };

  if (selectedJob) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
        <div className="bg-slate-900 text-white p-4 sticky top-0 z-10 flex items-center">
           <button onClick={() => setSelectedJob(null)} className="mr-4"><ArrowLeft /></button>
           <h1 className="font-bold text-lg">Job Execution</h1>
        </div>
        
        <div className="p-4 space-y-6">
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h2 className="font-bold text-xl text-gray-900">{selectedJob.description}</h2>
              <p className="text-gray-500 text-sm flex items-center mt-2"><MapPin size={14} className="mr-1"/> {selectedJob.siteId}</p>
              <div className="mt-4 flex gap-2">
                 <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-sm">Start Timer</button>
                 <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold text-sm">On Hold</button>
              </div>
           </div>

           <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center"><CheckSquare size={18} className="mr-2"/> Checklist</h3>
              <div className="space-y-2">
                 {checklist.length > 0 ? checklist.map((item, idx) => (
                    <div key={idx} onClick={() => toggleCheck(idx)} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                       <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                          {item.checked && "✓"}
                       </div>
                       <span className={item.checked ? "text-gray-400 line-through" : "text-gray-700"}>{item.item}</span>
                    </div>
                 )) : <p className="text-gray-400 italic text-sm">No checklist defined.</p>}
              </div>
           </div>

           <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center"><Camera size={18} className="mr-2"/> Evidence</h3>
              <div className="grid grid-cols-3 gap-2">
                 <button className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300">
                    <Camera size={24} />
                    <span className="text-xs mt-1">Add</span>
                 </button>
              </div>
           </div>

           <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center"><PenTool size={18} className="mr-2"/> Customer Signature</h3>
              <div className="h-32 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                 Tap to sign
              </div>
           </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200">
           <button 
             onClick={handleCompleteJob}
             disabled={saving}
             className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center disabled:opacity-70"
           >
             {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-2"/> Complete Job</>}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
       {jobs.map(job => (
         <div key={job.id} onClick={() => handleStartJob(job)} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-95 transition-transform cursor-pointer">
            <div className="flex justify-between">
               <span className="font-bold text-gray-900">{job.description}</span>
               <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{job.priority}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{job.siteId}</p>
            <div className="mt-3 flex justify-between text-xs text-gray-400">
               <span>{job.id}</span>
               <span>{job.scheduledDate}</span>
            </div>
         </div>
       ))}
    </div>
  );
};
