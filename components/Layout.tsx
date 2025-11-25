
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Database, FileText, Wrench, Package, 
  DollarSign, Briefcase, Settings, Menu, X, Bell, LogOut, 
  PhoneCall, MapPin, Globe, MessageCircle, Users, BarChart3
} from 'lucide-react';
import { Role, Language, Notification } from '../types';
import { TEXTS, MOCK_NOTIFICATIONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
}

const LanguageSwitcher: React.FC<{ currentLang: Language; onToggle: (lang: Language) => void }> = ({ currentLang, onToggle }) => (
  <button
    onClick={() => onToggle(currentLang === 'en' ? 'ar' : 'en')}
    className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
  >
    <Globe size={16} />
    <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  
  const isPublic = !currentUser || userRole === Role.PUBLIC;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg mb-1 transition-colors
        ${location.pathname.startsWith(to)
          ? 'bg-red-50 text-red-600 font-medium' 
          : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  const PublicHeader = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
          <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>{TEXTS.brand[lang]}</span>
        </div>
        <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          <Link to="/" className={`font-medium ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.home[lang]}</Link>
          <Link to="/services" className={`font-medium ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.services[lang]}</Link>
          <Link to="/about" className={`font-medium ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.about[lang]}</Link>
          <Link to="/contact" className={`font-medium ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.contact[lang]}</Link>
        </nav>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={scrolled ? '' : 'text-white'}><LanguageSwitcher currentLang={lang} onToggle={setLang} /></div>
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg text-sm">
            {TEXTS.login[lang]}
          </Link>
        </div>
      </div>
    </header>
  );

  if (isPublic) return (
    <div className="font-sans relative">
      <PublicHeader />
      <main>{children}</main>
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/97444000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className={`fixed inset-y-0 start-0 z-50 w-64 bg-white border-e border-gray-200 transition-transform ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between">
           <span className="text-xl font-bold text-red-600">{TEXTS.brand[lang]}</span>
           <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label={TEXTS.dashboard[lang]} />
            
            <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Modules</div>
            <NavItem to="/masters" icon={Database} label={TEXTS.masters_nav[lang]} />
            <NavItem to="/amc" icon={FileText} label={TEXTS.amc_nav[lang]} />
            <NavItem to="/jobs" icon={Wrench} label={TEXTS.jobs_nav[lang]} />
            <NavItem to="/projects" icon={Briefcase} label={TEXTS.projects_nav[lang]} />
            <NavItem to="/inventory" icon={Package} label={TEXTS.inventory_nav[lang]} />
            <NavItem to="/finance" icon={DollarSign} label={TEXTS.finance_nav[lang]} />
            
            <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Management</div>
            <NavItem to="/reports" icon={BarChart3} label="Reports" />
            <NavItem to="/team" icon={Users} label="Team" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      <div className="flex-1 lg:ltr:ml-64 lg:rtl:mr-64 flex flex-col min-h-screen transition-all">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
           <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="mr-4 rtl:ml-4 rtl:mr-0 lg:hidden text-gray-600">
               <Menu size={24} />
             </button>
             <h2 className="text-lg font-bold text-gray-800 hidden md:block">
                {currentUser?.email ? `Welcome, ${currentUser.email.split('@')[0]}` : 'Welcome'}
             </h2>
           </div>
           
           <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <LanguageSwitcher currentLang={lang} onToggle={setLang} />
              
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full" title="Sign Out">
                 <LogOut size={20} />
              </button>
           </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 overflow-x-hidden">
           {children}
        </main>
      </div>
    </div>
  );
};
