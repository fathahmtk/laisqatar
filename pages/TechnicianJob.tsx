
import React, { useState, useEffect } from 'react';
import { JobCard } from '../types';
import { Camera, CheckSquare, PenTool, Save, ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { Api } from '../services/api';

const mapBackendToJobCard = (data: any): JobCard => ({
    id: data.id.toString(),
    jobNumber: data.job_number,
    type: data.job_type,
    customerId: data.customer.toString(),
    siteId: data.site.toString(),
    priority: data.priority || 'Normal',
    status: data.status,
    scheduledDate: data.scheduled_date,
    description: data.problem_description,
    isAmcCovered: data.is_amc_covered,
    checklist: [], // Would need to be fetched/added
});

export const TechnicianJob: React.FC = () => {
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [checklist, setChecklist] = useState<{item: string, checked: boolean}[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
      const fetchJobs = async () => {
          try {
              const data = await Api.listJobs();
              // In a real app, filter for jobs assigned to the current user
              setJobs(data.map(mapBackendToJobCard));
          } catch(e) { console.error("Failed to fetch jobs", e)}
      };
      fetchJobs();
  }, [selectedJob]); // Refetch when a job is completed

  const handleStartJob = (job: JobCard) => {
    setSelectedJob(job);
    setChecklist(job.checklist || [{item: 'Inspect Equipment', checked: false}, {item: 'Clean Panel', checked: false}]);
  };

  const toggleCheck = (idx: number) => {
    const newCheck = [...checklist];
    newCheck[idx].checked = !newCheck[idx].checked;
    setChecklist(newCheck);
  };

  const handleCompleteJob = async () => {
    if (!selectedJob) return;
    setSaving(true);
    
    try {
        await Api.updateJob(selectedJob.id, { 
            status: 'Completed', 
            work_done: 'Completed standard checks.',
            actual_end: new Date().toISOString(),
        });
        alert('Job Completed Successfully!');
        setSelectedJob(null);
    } catch(e) {
        alert('Failed to update job status.');
    } finally {
        setSaving(false);
    }
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
              <p className="text-gray-500 text-sm flex items-center mt-2"><MapPin size={14} className="mr-1"/> Site ID: {selectedJob.siteId}</p>
           </div>

           <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center"><CheckSquare size={18} className="mr-2"/> Checklist</h3>
              <div className="space-y-2">
                 {checklist.map((item, idx) => (
                    <div key={idx} onClick={() => toggleCheck(idx)} className="flex items-center p-3 border rounded-lg cursor-pointer">
                       <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                          {item.checked && "✓"}
                       </div>
                       <span>{item.item}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
           <button onClick={handleCompleteJob} disabled={saving} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center disabled:opacity-70">
             {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} className="mr-2"/> Complete Job</>}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
       {jobs.filter(j => j.status !== 'Completed' && j.status !== 'Closed').map(job => (
         <div key={job.id} onClick={() => handleStartJob(job)} className="bg-white p-4 rounded-xl border shadow-sm cursor-pointer">
            <div className="flex justify-between">
               <span className="font-bold text-gray-900">{job.description}</span>
               <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{job.priority}</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Site ID: {job.siteId}</p>
         </div>
       ))}
    </div>
  );
};
