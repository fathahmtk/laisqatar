
import React, { useState } from 'react';
import { User, Bell, Lock, Globe, Save, Server } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'system'>('profile');

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
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[400px]">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-1">Public Profile</h3>
                   <p className="text-sm text-gray-500">This information will be displayed to other users.</p>
                </div>
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
                    <h3 className="text-lg font-bold text-gray-900 mb-1">System Information</h3>
                    <p className="text-sm text-gray-500">Environment and application status.</p>
                 </div>
                 
                 <div className="border border-gray-100 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Server size={16} className="mr-2 text-gray-400"/> Environment Info</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div className="text-gray-500">Backend API:</div>
                       <div className="font-mono text-gray-900">Connected</div>
                       <div className="text-gray-500">App Version:</div>
                       <div className="font-mono text-gray-900">v1.0.0-prod</div>
                    </div>
                 </div>
               </div>
            )}
            
            {/* Placeholder for other tabs */}
            {(activeTab === 'notifications' || activeTab === 'security') && (
                <div className="text-center py-20 text-gray-400">
                    <h3 className="text-lg font-bold text-gray-600">Coming Soon</h3>
                    <p>This settings section is under development.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
