
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Wrench, Users, 
  Settings, Menu, X, Bell, LogOut, PhoneCall, MapPin, 
  PieChart, Package, Briefcase, Building, DollarSign
} from 'lucide-react';
import { Role, Language, Notification } from '../types';
import { TEXTS, MOCK_NOTIFICATIONS } from '../constants';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
}

const NotificationItem: React.FC<{ notif: Notification }> = ({ notif }) => (
  <div className={`p-3 rounded-lg mb-2 flex items-start space-x-3 rtl:space-x-reverse ${notif.read ? 'bg-white' : 'bg-blue-50'}`}>
    <div>
       <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
       <p className="text-xs text-gray-600">{notif.message}</p>
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  
  const isPublic = !currentUser || userRole === Role.PUBLIC;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
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
          <Link to="/login" className={`hidden lg:inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium ${scrolled ? 'text-gray-600' : 'text-white'}`}>
             <Users size={18} /><span>{TEXTS.login[lang]}</span>
          </Link>
          <Link to="/contact" className="hidden lg:inline-flex bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg">
            {TEXTS.getQuote[lang]}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden p-2 rounded-lg ${scrolled ? 'text-gray-900' : 'text-white'}`}><Menu /></button>
        </div>
      </div>
      {sidebarOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 flex flex-col space-y-4 shadow-xl">
           <Link to="/" className="text-gray-800 font-medium">{TEXTS.home[lang]}</Link>
           <Link to="/services" className="text-gray-800 font-medium">{TEXTS.services[lang]}</Link>
           <Link to="/contact" className="text-gray-800 font-medium">{TEXTS.contact[lang]}</Link>
           <Link to="/login" className="text-gray-800 font-medium">{TEXTS.login[lang]}</Link>
        </div>
      )}
    </header>
  );

  const Footer = () => (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
             <div className="text-2xl font-bold text-white">{TEXTS.brand[lang]}</div>
             <p className="text-sm">Comprehensive fire safety solutions, installation, and maintenance.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">{TEXTS.contact[lang]}</h4>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2"><MapPin size={16}/><span>Doha, Qatar</span></div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse"><PhoneCall size={16}/><span>+974 4400 0000</span></div>
          </div>
      </div>
    </footer>
  );

  if (isPublic) return <div className="font-sans"><PublicHeader /><main>{children}</main><Footer /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <aside className={`fixed inset-y-0 start-0 z-50 w-64 bg-white border-e border-gray-200 transition-transform ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between">
           <span className="text-xl font-bold text-red-600">{TEXTS.brand[lang]}</span>
           <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label={TEXTS.dashboard_nav[lang]} />
            
            {(userRole === Role.ADMIN || userRole === Role.OPERATIONS || userRole === Role.SALES) && (
              <>
                <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase">Operations</div>
                <NavItem to="/projects" icon={Building} label={TEXTS.projects_nav[lang]} />
                <NavItem to="/contracts" icon={FileText} label={TEXTS.contracts_nav[lang]} />
                <NavItem to="/work-orders" icon={Wrench} label={TEXTS.workOrders_nav[lang]} />
                <NavItem to="/clients" icon={Users} label={TEXTS.clients_nav[lang]} />
              </>
            )}

            {(userRole === Role.ADMIN || userRole === Role.ACCOUNTS) && (
               <>
                <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase">Finance</div>
                <NavItem to="/finance" icon={DollarSign} label={TEXTS.accounts_nav[lang]} />
                <NavItem to="/inventory" icon={Package} label={TEXTS.inventory_nav[lang]} />
               </>
            )}

            {(userRole === Role.ADMIN || userRole === Role.TECHNICIAN) && (
               <>
                 <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase">Field</div>
                 <NavItem to="/technician" icon={Wrench} label="Tech View" />
               </>
            )}

            {userRole === Role.ADMIN && (
              <>
                <div className="pt-4 pb-1 px-4 text-xs font-bold text-gray-400 uppercase">Admin</div>
                <NavItem to="/team" icon={Briefcase} label={TEXTS.team_nav[lang]} />
                <NavItem to="/settings" icon={Settings} label={TEXTS.settings_nav[lang]} />
              </>
            )}
            
            <button onClick={handleLogout} className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg mt-8">
              <LogOut size={20} /><span>Sign Out</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 lg:ltr:ml-64 lg:rtl:mr-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
           <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
           <div className="flex items-center space-x-5 rtl:space-x-reverse ml-auto">
             <button className="relative p-2" onClick={() => setNotificationsOpen(!notificationsOpen)}>
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
             </button>
             <LanguageSwitcher currentLang={lang} onToggle={setLang} />
             <div className="flex items-center space-x-3 rtl:space-x-reverse border-l rtl:border-l-0 rtl:border-r pl-4 rtl:pl-0 rtl:pr-4">
               <div className="text-right rtl:text-left text-sm hidden sm:block">
                 <p className="font-bold">{currentUser?.email}</p>
                 <p className="text-xs text-gray-500">{userRole}</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">U</div>
             </div>
           </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
