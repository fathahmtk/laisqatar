
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Database, FileText, Wrench, Package, 
  DollarSign, Briefcase, Settings, Menu, X, Bell, LogOut, 
  MessageCircle, Users, BarChart3, Globe, User, ChevronDown, Check, Search, PlusCircle
} from 'lucide-react';
import { Role, Language } from '../types';
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

const NavItem = ({ to, icon: Icon, label, isActive, onClick }: { to: string, icon: any, label: string, isActive: boolean, onClick: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg mb-1 transition-colors group
      ${isActive
        ? 'bg-red-50 text-red-600 font-medium' 
        : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <Icon size={20} className={`transition-colors ${isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
    <span>{label}</span>
  </Link>
);

export const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  
  const isPublic = !currentUser || userRole === Role.PUBLIC;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const PublicHeader = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">L</div>
          <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>{TEXTS.brand[lang]}</span>
        </div>
        <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          <Link to="/" className={`font-medium hover:text-red-500 transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.home[lang]}</Link>
          <Link to="/services" className={`font-medium hover:text-red-500 transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.services[lang]}</Link>
          <Link to="/about" className={`font-medium hover:text-red-500 transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.about[lang]}</Link>
          <Link to="/contact" className={`font-medium hover:text-red-500 transition-colors ${scrolled ? 'text-gray-600' : 'text-white'}`}>{TEXTS.contact[lang]}</Link>
        </nav>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={scrolled ? '' : 'text-white'}><LanguageSwitcher currentLang={lang} onToggle={setLang} /></div>
          <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg text-sm transition-transform hover:-translate-y-0.5">
            {TEXTS.login[lang]}
          </Link>
        </div>
      </div>
    </header>
  );

  if (isPublic) return (
    <div className="font-sans relative selection:bg-red-100 selection:text-red-900">
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

  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-red-100 selection:text-red-900">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 start-0 z-[60] lg:z-30 w-64 bg-white border-e border-gray-200 shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 justify-between">
           <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">L</div>
             <span className="text-xl font-bold text-gray-900">{TEXTS.brand[lang]}</span>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] space-y-1 no-scrollbar">
            <NavItem 
              to="/dashboard" 
              icon={LayoutDashboard} 
              label={TEXTS.dashboard[lang]} 
              isActive={location.pathname.startsWith('/dashboard')}
              onClick={() => setSidebarOpen(false)}
            />
            
            <div className="pt-6 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Operations</div>
            <NavItem to="/masters" icon={Database} label={TEXTS.masters_nav[lang]} isActive={location.pathname.startsWith('/masters')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/amc" icon={FileText} label={TEXTS.amc_nav[lang]} isActive={location.pathname.startsWith('/amc')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/jobs" icon={Wrench} label={TEXTS.jobs_nav[lang]} isActive={location.pathname.startsWith('/jobs')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/projects" icon={Briefcase} label={TEXTS.projects_nav[lang]} isActive={location.pathname.startsWith('/projects')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/inventory" icon={Package} label={TEXTS.inventory_nav[lang]} isActive={location.pathname.startsWith('/inventory')} onClick={() => setSidebarOpen(false)} />
            
            <div className="pt-6 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Management</div>
            <NavItem to="/finance" icon={DollarSign} label={TEXTS.finance_nav[lang]} isActive={location.pathname.startsWith('/finance')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/reports" icon={BarChart3} label="Reports" isActive={location.pathname.startsWith('/reports')} onClick={() => setSidebarOpen(false)} />
            <NavItem to="/team" icon={Users} label="Team" isActive={location.pathname.startsWith('/team')} onClick={() => setSidebarOpen(false)} />
            
            <div className="pt-6 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">System</div>
            <NavItem to="/settings" icon={Settings} label="Settings" isActive={location.pathname.startsWith('/settings')} onClick={() => setSidebarOpen(false)} />
        </div>
      </aside>

      <div className="flex-1 lg:ltr:ml-64 lg:rtl:mr-64 flex flex-col min-h-screen transition-all">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center flex-1 gap-4">
             <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-lg">
               <Menu size={24} />
             </button>
             
             {/* Global Search */}
             <div className="hidden md:flex relative w-full max-w-md">
                <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search contracts, jobs, or customers..." 
                  className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
             </div>
           </div>
           
           <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <LanguageSwitcher currentLang={lang} onToggle={setLang} />
              
              {/* Quick Actions */}
              <div className="relative" ref={quickActionsRef}>
                <button 
                  onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Quick Actions"
                >
                  <PlusCircle size={20} />
                </button>
                {quickActionsOpen && (
                  <div className="absolute right-0 rtl:left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Create New</div>
                    <Link to="/jobs" onClick={() => setQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">Job Card</Link>
                    <Link to="/masters" onClick={() => setQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">Customer</Link>
                    <Link to="/finance" onClick={() => setQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600">Invoice</Link>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-full transition-colors ${notificationsOpen ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 rtl:left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                       <span className="font-bold text-sm text-gray-900">Notifications</span>
                       <span className="text-xs text-red-600 font-medium cursor-pointer">Mark all read</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.length > 0 ? (
                        MOCK_NOTIFICATIONS.map(n => (
                          <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 relative">
                             <div className="flex justify-between items-start mb-1">
                               <span className={`font-semibold text-sm ${n.type === 'SLA_BREACH' ? 'text-red-700' : 'text-gray-800'}`}>{n.title}</span>
                               <span className="text-[10px] text-gray-400">{n.timestamp}</span>
                             </div>
                             <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                             {!n.read && <span className="absolute left-1 top-4 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">No new notifications</div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-50 text-center">
                       <Link to="/settings" className="text-xs font-bold text-gray-600 hover:text-red-600">View All</Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-gray-50 p-1 pr-3 rounded-full border border-transparent hover:border-gray-200 transition-all"
                >
                  <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 rtl:left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900">{currentUser?.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-400"/> Profile
                      </Link>
                      <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings size={16} className="mr-2 rtl:ml-2 rtl:mr-0 text-gray-400"/> Settings
                      </Link>
                    </div>
                    <div className="py-1 border-t border-gray-50">
                      <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut size={16} className="mr-2 rtl:ml-2 rtl:mr-0"/> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 overflow-x-hidden">
           {children}
        </main>
      </div>
    </div>
  );
};
