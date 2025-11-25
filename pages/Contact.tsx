
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const Contact: React.FC<Props> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Info Section */}
          <div className="bg-slate-900 text-white p-10 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Need a quote for AMC or a new installation? Our team is ready to assist you 24/7.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <MapPin className="text-red-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold">Visit Us</h4>
                    <p className="text-sm text-slate-400">Building 42, Street 840, Zone 24<br/>Doha, Qatar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <Phone className="text-red-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold">Call Us</h4>
                    <p className="text-sm text-slate-400">+974 4400 0000</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <Mail className="text-red-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold">Email Us</h4>
                    <p className="text-sm text-slate-400">info@laisqatar.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="w-full h-40 bg-slate-800 rounded-xl overflow-hidden opacity-80">
                 {/* Placeholder for map */}
                 <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">Google Map View</div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-10 md:w-3/5">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-3">
                    <Send size={24} />
                  </div>
                  <h3 className="font-bold text-lg">Message Sent!</h3>
                  <p className="text-sm">We'll get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                    <input required type="text" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input required type="tel" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" placeholder="+974..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input required type="email" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Interest</label>
                  <select className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all bg-white">
                    <option>Annual Maintenance Contract (AMC)</option>
                    <option>New System Installation</option>
                    <option>QCDD Certification</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea required rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all" placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-600/20 transition-all transform hover:-translate-y-0.5">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
