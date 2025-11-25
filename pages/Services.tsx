
import React from 'react';
import { ShieldCheck, Wrench, FileCheck, Truck, Cog, HardHat } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const Services: React.FC<Props> = ({ lang }) => {
  const services = [
    {
      title: "Fire Alarm Systems",
      desc: "Design, installation, and maintenance of intelligent addressable and conventional fire alarm systems.",
      icon: ShieldCheck,
      details: ["Smoke & Heat Detectors", "Control Panels", "Emergency Break Glass", "Sounders & Flashers"]
    },
    {
      title: "Fire Fighting Systems",
      desc: "Comprehensive water-based suppression systems ensuring rapid response to fire incidents.",
      icon: Wrench,
      details: ["Sprinkler Systems", "Fire Hose Reels", "Wet Risers", "Fire Hydrants"]
    },
    {
      title: "AMC & Maintenance",
      desc: "24/7 preventive and corrective maintenance contracts to ensure system reliability and compliance.",
      icon: Cog,
      details: ["Quarterly Inspections", "Emergency Callouts", "Spare Parts Management", "System Health Checks"]
    },
    {
      title: "Gas Suppression",
      desc: "Clean agent fire suppression for critical assets like server rooms and data centers.",
      icon: Truck,
      details: ["FM200 Systems", "Novec 1230", "CO2 Systems", "Room Integrity Testing"]
    },
    {
      title: "QCDD Approvals",
      desc: "End-to-end management of Qatar Civil Defense Department certifications and renewals.",
      icon: FileCheck,
      details: ["Drawing Approvals", "Inspection Coordination", "Certificate Renewal", "Compliance Audits"]
    },
    {
      title: "Training & Safety",
      desc: "Professional training for facility managers and staff on fire safety protocols.",
      icon: HardHat,
      details: ["Fire Warden Training", "Evacuation Drills", "Equipment Usage", "Safety Audits"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Our Services</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Lais Qatar offers a comprehensive suite of fire safety solutions, tailored to meet the rigorous standards of Qatar Civil Defense and international safety protocols.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-red-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <service.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.desc}</p>
              <ul className="space-y-2">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-sm text-slate-500">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
