
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertCircle, PlayCircle } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  lang: Language;
}

export const Login: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();
  const { login, loginDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login Failed", err);
      setError('Login failed. Invalid credentials or server not running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await loginDemo();
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop" 
           alt="Industrial Background" 
           className="w-full h-full object-cover opacity-20"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
           <div className="p-8 pb-6 border-b border-gray-100 text-center">
             <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-red-600/30">
               <ShieldCheck size={32} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900">{TEXTS.brand[lang]}</h1>
             <p className="text-sm text-gray-500 mt-1">Enterprise Resource Planning</p>
           </div>
           
           <form onSubmit={handleLogin} className="p-8 space-y-6">
             {error && (
               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                 <AlertCircle size={16} className="mr-2" />
                 {error}
               </div>
             )}

             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700 ml-1">Email / Username</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   type="text"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="block w-full pl-10 rtl:pl-3 rtl:pr-10 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm transition-colors text-left rtl:text-right"
                   placeholder="admin@laisqatar.com"
                 />
               </div>
             </div>

             <div className="space-y-1">
               <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto pl-3 rtl:pr-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="block w-full pl-10 rtl:pl-3 rtl:pr-10 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm transition-colors text-left rtl:text-right"
                   placeholder="••••••••"
                 />
               </div>
             </div>

             <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 rtl:rotate-180" />
                    </>
                  )}
                </button>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all"
                >
                  <PlayCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                  Login as Admin (Demo)
                </button>
             </div>
             
             <div className="text-center">
               <a href="#" className="text-sm text-red-600 hover:text-red-500 font-medium">Forgot your password?</a>
             </div>
           </form>
        </div>
      </div>
    </div>
  );
};
