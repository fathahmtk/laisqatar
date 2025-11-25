
import React from 'react';
import { Award, Users, Globe, Target } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const About: React.FC<Props> = ({ lang }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block">About Lais Qatar</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8 leading-tight">
            Protecting Lives & Assets Since 2010
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We are Qatar's leading Fire & Safety solutions provider, dedicated to delivering excellence in engineering, installation, and maintenance of life safety systems.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Mission", text: "To provide world-class safety solutions that protect people and property." },
              { icon: Globe, title: "Vision", text: "To be the most trusted partner in fire safety across the GCC region." },
              { icon: Award, title: "Quality", text: "ISO 9001:2015 certified processes ensuring highest standards." },
              { icon: Users, title: "People", text: "A team of certified engineers and expert technicians." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" 
              alt="Team meeting" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Journey</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded in 2010, Lais Qatar began with a small team of passionate engineers. Over the last decade, we have grown into a full-service fire safety organization with over 500 active clients and 1,200 successful projects.
            </p>
            <p className="text-slate-600 mb-4 leading-relaxed">
              We pride ourselves on our technical expertise and our ability to handle complex projects, from high-rise towers in West Bay to industrial warehouses in the Industrial Area.
            </p>
            <div className="mt-8 border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-600 pl-6 rtl:pl-0 rtl:pr-6">
              <p className="text-lg font-medium text-slate-900 italic">
                "Safety is not just a requirement, it is our commitment to the community."
              </p>
              <p className="text-sm text-slate-500 mt-2">- CEO, Lais Qatar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
