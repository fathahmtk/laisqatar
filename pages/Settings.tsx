import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Save, Database, Server } from 'lucide-react';
import { seedDatabase } from '../services/db';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'system'>('profile');
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if(!window.confirm("Are you sure? This will upload mock data to your Firestore database. Only do this once.")) return;
    setSeeding(true);
    await seedDatabase();
    setSeeding(false);
    alert("Database seeded successfully!");
  }

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors mb-1 ${
        activeTab === id 
          ? 'bg-red-50 text-red-700' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} className="mr-3 rtl:ml-3 rtl:mr-0" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <nav className="space-y-1">
              <TabButton id="profile" label="Profile Settings" icon={User} />
              <TabButton id="notifications" label="Notifications" icon={Bell} />
              <TabButton id="security" label="Password & Security" icon={Lock} />
              <TabButton id="system" label="System & Developer" icon={Globe} />
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in">
                {/* ... Profile Form ... */}
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-1">Public Profile</h3>
                   <p className="text-sm text-gray-500">This information will be displayed to other users.</p>
                </div>
                {/* ... existing profile fields ... */}
                <div className="pt-4 flex justify-end">
                   <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center">
                     <Save size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> Save Changes
                   </button>
                </div>
              </div>
            )}
            
            {activeTab === 'system' && (
               <div className="space-y-6 animate-in fade-in">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Developer Zone</h3>
                    <p className="text-sm text-gray-500">Manage database and environment settings.</p>
                 </div>
                 
                 <div className="border border-red-100 bg-red-50 rounded-xl p-6">
                    <div className="flex items-start">
                       <div className="p-2 bg-red-100 rounded-lg text-red-600 mr-4 rtl:ml-4 rtl:mr-0"><Database size={24}/></div>
                       <div>
                          <h4 className="font-bold text-red-900">Initialize Database</h4>
                          <p className="text-sm text-red-700 mt-1 mb-4">
                            Upload local mock data (Assets, Contracts, Work Orders) to your Firestore database. 
                            Use this only when starting a new project.
                          </p>
                          <button 
                            onClick={handleSeed} 
                            disabled={seeding}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-red-700 disabled:opacity-50"
                          >
                            {seeding ? "Seeding..." : "Seed Database"}
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="border border-gray-100 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2">Environment Info</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div className="text-gray-500">Firebase Project:</div>
                       <div className="font-mono text-gray-900">lais-qatar</div>
                       <div className="text-gray-500">App Version:</div>
                       <div className="font-mono text-gray-900">v1.0.0-beta</div>
                    </div>
                 </div>
               </div>
            )}
            
            {/* ... Other tabs ... */}
          </div>
        </div>
      </div>
    </div>
  );
};