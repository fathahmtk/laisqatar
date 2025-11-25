import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Wrench, Users, 
  Settings, Menu, X, Bell, LogOut, PhoneCall, MapPin, Facebook, Twitter, Linkedin, Box, AlertTriangle, Info, CheckCircle2,
  PieChart, Package, Briefcase
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

const NotificationItem: React.FC<{ notif: Notification }> = ({ notif }) => {
  const icons = {
    'SLA_BREACH': <AlertTriangle size={18} className="text-red-600" />,
    'WARNING': <AlertTriangle size={18} className="text-yellow-600" />,
    'INFO': <Info size={18} className="text-blue-600" />,
    'SUCCESS': <CheckCircle2 size={18} className="text-green-600" />
  };
  
  const bgColors = {
    'SLA_BREACH': 'bg-red-50',
    'WARNING': 'bg-yellow-50',
    'INFO': 'bg-blue-50',
    'SUCCESS': 'bg-green-50'
  };

  return (
    <div className={`p-3 rounded-lg mb-2 flex items-start space-x-3 rtl:space-x-reverse transition-colors ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bgColors[notif.type]}`}>
        {icons[notif.type]}
      </div>
      <div>
         <div className="flex justify-between items-start">
           <h4 className={`text-sm font-semibold ${notif.type === 'SLA_BREACH' ? 'text-red-700' : 'text-gray-900'}`}>{notif.title}</h4>
           <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 rtl:mr-2 rtl:ml-0">{notif.timestamp}</span>
         </div>
         <p className="text-xs text-gray-600 mt-1 leading-snug">{notif.message}</p>
      </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  
  const isPublic = !currentUser || userRole === Role.PUBLIC;

  // Sync dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  if (location.pathname === '/login') {
    return <div className="font-sans">{children}</div>;
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg mb-1 transition-colors
        ${location.pathname === to 
          ? 'bg-red-50 text-red-600 font-medium shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );

  const PublicHeader = () => (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-600/20">L</div>
          <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'} transition-colors`}>
            {TEXTS.brand[lang]}
          </span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          {[
            { to: "/", label: TEXTS.home[lang] },
            { to: "/services", label: TEXTS.services[lang] },
            { to: "/about", label: TEXTS.about[lang] },
            { to: "/contact", label: TEXTS.contact[lang] }
          ].map((link, idx) => (
             <Link 
               key={idx} 
               to={link.to} 
               className={`font-medium transition-colors hover:text-red-500 relative group ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'}`}
             >
               {link.label}
               <span className={`absolute -bottom-1 left-0 rtl:right-0 w-0 h-0.5 bg-red-500 transition-all group-hover:w-full ${scrolled ? 'opacity-100' : 'opacity-80 bg-white'}`}></span>
             </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={scrolled ? '' : 'text-white'}>
             <LanguageSwitcher currentLang={lang} onToggle={setLang} />
          </div>
          <Link 
             to="/login"
             className={`hidden lg:inline-flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-red-600' : 'text-white hover:text-red-200'}`}
          >
             <Users size={18} />
             <span>{TEXTS.login[lang]}</span>
          </Link>
          <Link 
            to="/contact" 
            className="hidden lg:inline-flex bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-red-600/30 transition-all transform hover:-translate-y-0.5 hover:shadow-red-600/40"
          >
            {TEXTS.getQuote[lang]}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900' : 'text-white hover:bg-white/10'}`}>
            <Menu />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {sidebarOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 flex flex-col space-y-4 shadow-xl animate-in slide-in-from-top-2">
           <Link to="/" onClick={() => setSidebarOpen(false)} className="text-gray-800 font-medium p-3 hover:bg-gray-50 rounded-lg transition-colors text-left rtl:text-right">{TEXTS.home[lang]}</Link>
           <Link to="/services" onClick={() => setSidebarOpen(false)} className="text-gray-800 font-medium p-3 hover:bg-gray-50 rounded-lg transition-colors text-left rtl:text-right">{TEXTS.services[lang]}</Link>
           <Link to="/about" onClick={() => setSidebarOpen(false)} className="text-gray-800 font-medium p-3 hover:bg-gray-50 rounded-lg transition-colors text-left rtl:text-right">{TEXTS.about[lang]}</Link>
           <Link to="/contact" onClick={() => setSidebarOpen(false)} className="text-gray-800 font-medium p-3 hover:bg-gray-50 rounded-lg transition-colors text-left rtl:text-right">{TEXTS.contact[lang]}</Link>
           <div className="h-px bg-gray-100 my-2"></div>
           <Link to="/login" onClick={() => setSidebarOpen(false)} className="text-left rtl:text-right text-gray-800 font-medium p-3 hover:bg-gray-50 rounded-lg flex items-center transition-colors">
             <Users size={18} className="mr-2 rtl:ml-2 rtl:mr-0 text-red-600" />
             {TEXTS.login[lang]}
           </Link>
        </div>
      )}
    </header>
  );

  const Footer = () => (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-8">
             <div className="flex items-center space-x-2 rtl:space-x-reverse text-white">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold shadow-red-900/50 shadow-lg">L</div>
                <span className="text-2xl font-bold tracking-tight">{TEXTS.brand[lang]}</span>
             </div>
             <p className="text-sm leading-relaxed text-slate-400 text-left rtl:text-right">
               Lais Qatar is your trusted partner for comprehensive fire safety solutions, delivering excellence in installation, maintenance, and compliance for over a decade.
             </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-8 text-lg">{TEXTS.contact[lang]}</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start space-x-4 rtl:space-x-reverse group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                  <MapPin size={16} />
                </div>
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Building 42, Street 840,<br />Zone 24, Doha, Qatar</span>
              </li>
              <li className="flex items-center space-x-4 rtl:space-x-reverse group">
                 <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                   <PhoneCall size={16} />
                 </div>
                 <span className="text-slate-400 group-hover:text-slate-300 transition-colors font-medium">+974 4400 0000</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 text-center">
           <p>© 2024 Lais Qatar. All rights reserved. ISO 9001:2015 Certified.</p>
        </div>
      </div>
    </footer>
  );

  const AdminSidebar = () => (
    <aside className={`fixed inset-y-0 start-0 z-50 w-64 bg-white border-e border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full lg:ltr:translate-x-0 lg:rtl:translate-x-0'} shadow-2xl lg:shadow-none`}>
      <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between bg-gray-50/50">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-600">
           <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold shadow-sm">L</div>
           <span className="text-xl font-bold tracking-tight text-gray-900">{TEXTS.brand[lang]}</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="mb-8">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            {userRole === Role.ADMIN ? 'Administration' : userRole === Role.TECHNICIAN ? 'Field Operations' : 'Client Portal'}
          </p>
          <div className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label={TEXTS.dashboard[lang]} />
            {userRole === Role.ADMIN && (
              <>
                <NavItem to="/accounts" icon={PieChart} label={TEXTS.accounts[lang]} />
                <NavItem to="/inventory" icon={Package} label={TEXTS.inventory[lang]} />
                <NavItem to="/team" icon={Briefcase} label={TEXTS.team[lang]} />
                <NavItem to="/contracts" icon={FileText} label={TEXTS.contracts[lang]} />
                <NavItem to="/clients" icon={Users} label={TEXTS.clients[lang]} />
                <NavItem to="/assets" icon={Box} label={TEXTS.assets[lang]} />
              </>
            )}
            {userRole === Role.TECHNICIAN && (
                <>
                  <NavItem to="/assets" icon={Box} label={TEXTS.assets[lang]} />
                  <NavItem to="/inventory" icon={Package} label={TEXTS.inventory[lang]} />
                </>
            )}
            {userRole !== Role.CLIENT && <NavItem to="/work-orders" icon={Wrench} label={TEXTS.workOrders[lang]} />}
            {(userRole === Role.ADMIN || userRole === Role.CLIENT) && <NavItem to="/reports" icon={FileText} label={TEXTS.reports[lang]} />}
            
            <NavItem to="/settings" icon={Settings} label={TEXTS.settings[lang]} />
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100">
           <button onClick={handleLogout} className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors font-medium">
            <LogOut size={20} />
            <span>Sign Out</span>
           </button>
        </div>
      </div>
    </aside>
  );

  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <PublicHeader />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminSidebar />
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex-1 lg:ltr:ml-64 lg:rtl:mr-64 flex flex-col min-h-screen transition-all duration-300 w-full">
        <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
           <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rtl:-mr-2 rtl:ml-0 text-gray-600 mr-3 rtl:mr-0 rtl:ml-3 hover:bg-gray-100 rounded-lg">
               <Menu size={20} />
             </button>
             <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
               {TEXTS.brand[lang]} <span className="text-gray-300 font-light mx-2">|</span> <span className="text-gray-500 text-sm font-medium">{userRole === Role.ADMIN ? 'Admin Console' : userRole === Role.TECHNICIAN ? 'Field App' : 'My Account'}</span>
             </h2>
           </div>
           
           <div className="flex items-center space-x-5 rtl:space-x-reverse">
             {/* Notification Bell */}
             <div className="relative" ref={notificationRef}>
               <button 
                 onClick={() => setNotificationsOpen(!notificationsOpen)}
                 className={`p-2 transition-colors relative rounded-full ${notificationsOpen ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-2 h-2 bg-red-600 rounded-full border border-white ring-2 ring-white animate-pulse"></span>
                 )}
               </button>
               {notificationsOpen && (
                 <div className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right rtl:origin-top-left">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                       <h3 className="font-bold text-gray-800">Notifications</h3>
                    </div>
                    <div className="p-2 max-h-[24rem] overflow-y-auto">
                       {notifications.map(n => <NotificationItem key={n.id} notif={n} />)}
                    </div>
                 </div>
               )}
             </div>

             <LanguageSwitcher currentLang={lang} onToggle={setLang} />
             
             <div className="flex items-center space-x-3 rtl:space-x-reverse pl-6 rtl:pl-0 rtl:pr-6 border-l rtl:border-l-0 rtl:border-r border-gray-200">
               <div className="text-right rtl:text-left hidden sm:block leading-tight">
                 <p className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{currentUser?.email || 'User'}</p>
                 <p className="text-xs text-gray-500 font-medium">{userRole}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                  {currentUser?.email?.[0].toUpperCase() || 'U'}
               </div>
             </div>
           </div>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};