
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Wrench, Clock, FileCheck, ChevronRight, Star, 
  Users, Building, Award, CheckCircle2, ArrowRight, Plus, Minus, ArrowDown
} from 'lucide-react';
import { TEXTS, FAQ_ITEMS } from '../constants';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const Home: React.FC<Props> = ({ lang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isRtl = lang === 'ar';

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center bg-slate-900 overflow-hidden">
        {/* Background Video with Gradient */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-50 scale-105"
            poster="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
          >
            {/* Engineer inspecting industrial pipes/valves - representative of AMC Services */}
            <source src="https://cdn.pixabay.com/video/2020/05/25/40149-424040954_large.mp4" type="video/mp4" />
          </video>
          {/* Overlay Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl reveal active">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8 backdrop-blur-md shadow-xl animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-white text-sm font-semibold tracking-wide uppercase">Qatar's Premier Safety Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
              {TEXTS.heroTitle[lang]}
            </h1>
            
            <p className="text-xl text-slate-200 mb-12 leading-relaxed max-w-2xl font-light drop-shadow-lg">
              {TEXTS.heroSubtitle[lang]}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button className="group bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-red-600/30 hover:shadow-red-600/50 flex items-center justify-center transform hover:-translate-y-1 relative overflow-hidden">
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] rtl:translate-x-[100%] group-hover:translate-x-[100%] rtl:group-hover:translate-x-[-100%] transition-transform duration-700 ease-in-out skew-x-12"></span>
                {TEXTS.getQuote[lang]}
                <ArrowRight size={22} className={`ml-3 rtl:mr-3 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform`} />
              </button>
              <button className="group bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-10 py-5 rounded-full font-bold text-lg transition-all border border-white/30 flex items-center justify-center hover:border-white/50">
                {TEXTS.learnMore[lang]}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce hidden md:flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest mb-2">Scroll Down</span>
          <ArrowDown size={20} />
        </div>
      </section>

      {/* Stats Floating Strip */}
      <section className="relative -mt-24 z-20 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 reveal">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:divide-x rtl:divide-x-reverse divide-gray-100">
              {[
                { label: TEXTS.statsClients[lang], value: "500+" },
                { label: TEXTS.statsProjects[lang], value: "1,200+" },
                { label: TEXTS.statsTechs[lang], value: "50+" },
                { label: "Years Excellence", value: "15" },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">{stat.value}</div>
                  <div className="text-slate-500 font-medium uppercase text-sm tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 reveal">
           <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">{TEXTS.testimonials[lang]}</p>
           <div className="flex flex-wrap justify-center gap-16 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center font-bold text-2xl text-slate-800"><Building className="mr-3 rtl:ml-3 rtl:mr-0 text-red-600"/> Client Corp</div>
              <div className="flex items-center font-bold text-2xl text-slate-800"><ShieldCheck className="mr-3 rtl:ml-3 rtl:mr-0 text-red-600"/> Tower Safe</div>
              <div className="flex items-center font-bold text-2xl text-slate-800"><Users className="mr-3 rtl:ml-3 rtl:mr-0 text-red-600"/> Mega Mall</div>
              <div className="flex items-center font-bold text-2xl text-slate-800"><Award className="mr-3 rtl:ml-3 rtl:mr-0 text-red-600"/> Gov Entity</div>
           </div>
         </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl -ml-64 -mb-64"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 reveal">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block bg-red-50 inline-block px-4 py-2 rounded-full border border-red-100">{TEXTS.services[lang]}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">End-to-End Safety Solutions</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              From design to maintenance, we deliver QCDD compliant fire protection systems tailored to your facility's unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Fire Detection", desc: "Intelligent addressable and conventional fire alarm systems designed for early warning." },
              { icon: Wrench, title: "Fire Fighting", desc: "Complete installation of sprinklers, hose reels, and hydrants ensuring rapid response." },
              { icon: FileCheck, title: "AMC Contracts", desc: "Comprehensive maintenance contracts with 24/7 support and QCDD certification renewal." },
              { icon: Clock, title: "Gas Suppression", desc: "Advanced FM200 and Novec clean agent systems for critical server rooms and assets." },
              { icon: Users, title: "Emergency Lighting", desc: "Central battery systems and standalone exit lighting for safe evacuation routes." },
              { icon: Award, title: "Training & Audits", desc: "Professional staff safety training and detailed fire risk assessment audits." },
            ].map((s, i) => (
              <div key={i} className={`group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden reveal reveal-delay-${(i%3)*100}`}>
                <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto w-32 h-32 bg-red-50 rounded-bl-full rtl:rounded-br-full rtl:rounded-bl-none -mr-8 -mt-8 rtl:-ml-8 transition-transform group-hover:scale-150 duration-500 ease-out"></div>
                
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 mb-8 shadow-md group-hover:bg-red-600 group-hover:text-white transition-all duration-300 relative z-10 group-hover:-translate-y-2">
                  <s.icon size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors relative z-10">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6 relative z-10">{s.desc}</p>
                
                <a href="#" className="inline-flex items-center text-sm font-bold text-slate-900 hover:text-red-600 transition-colors relative z-10">
                  Read more <ChevronRight size={16} className="ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative reveal">
               <div className="absolute -top-10 -left-10 rtl:-right-10 rtl:left-auto w-full h-full border-2 border-slate-100 rounded-3xl -z-10 transform -rotate-3 rtl:rotate-3"></div>
               <img 
                 src="https://images.unsplash.com/photo-1581092921461-eab6245b0a62?auto=format&fit=crop&q=80" 
                 alt="Technician at work" 
                 className="rounded-3xl shadow-2xl w-full object-cover h-[600px] transform hover:scale-[1.02] transition-transform duration-700"
               />
               
               <div className="absolute -bottom-12 -right-12 rtl:-left-12 rtl:right-auto bg-white p-8 rounded-3xl shadow-2xl max-w-xs hidden md:block border border-gray-50 animate-bounce-slow">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                     <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-sm"><ShieldCheck size={28}/></div>
                     <div>
                       <span className="block font-bold text-slate-900 text-lg">ISO 9001:2015</span>
                       <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Certified</span>
                     </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">Global standard for Quality Management Systems in Fire Safety services.</p>
               </div>
            </div>
            
            <div className="lg:w-1/2 reveal reveal-delay-200">
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block">{TEXTS.about[lang]}</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">Safeguarding Qatar's Future Since 2010</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                We specialize in the design, supply, installation, testing, commissioning, and maintenance of complete fire protection systems. Our mission is to protect lives and property through innovative safety solutions.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { title: "Civil Defense Approved", text: "Fully licensed and compliant with QCDD regulations." },
                  { title: "24/7 Emergency Response", text: "Rapid mobilization fleet ready for any crisis." },
                  { title: "Certified Expertise", text: "Team of engineers and technicians with international certifications." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="bg-red-50 p-2 rounded-lg text-red-600 mt-1 shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {TEXTS.learnMore[lang]} <ArrowRight size={20} className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 reveal">
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase mb-4 block">Common Questions</span>
            <h2 className="text-4xl font-extrabold text-slate-900">{TEXTS.faqTitle[lang]}</h2>
          </div>
          
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 reveal reveal-delay-100 group">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left rtl:text-right focus:outline-none"
                >
                  <span className={`font-bold text-lg transition-colors ${openFaq === index ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'}`}>
                    {item.question[lang]}
                  </span>
                  <span className={`flex-shrink-0 ml-6 rtl:mr-6 rtl:ml-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${openFaq === index ? 'bg-red-600 text-white rotate-180 shadow-lg' : 'bg-slate-100 text-slate-600 group-hover:bg-red-50'}`}>
                    {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-8 text-slate-600 leading-relaxed text-lg border-t border-slate-50 pt-6 text-left rtl:text-right">
                    {item.answer[lang]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 reveal">
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-black opacity-20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">{TEXTS.ctaTitle[lang]}</h2>
              <p className="text-red-100 text-xl md:text-2xl mb-12 font-light">
                {TEXTS.ctaSubtitle[lang]}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="bg-white text-red-700 px-10 py-5 rounded-full font-bold text-lg hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  {TEXTS.getQuote[lang]}
                </button>
                <button className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/30 hover:border-white">
                  {TEXTS.contact[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
