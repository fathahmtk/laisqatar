
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { AMC } from './pages/AMC';
import { Masters } from './pages/Masters';
import { Reports } from './pages/Reports';
import { Finance } from './pages/Finance';
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Projects } from './pages/Projects';
import { TechnicianJob } from './pages/TechnicianJob';
import { Role, Language } from './types';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const { userRole, loading } = useAuth();
  const isAuthenticated = userRole !== Role.PUBLIC;

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-red-600">Loading Lais Qatar ERP...</div>;

  return (
    <Router>
      <Layout lang={lang} setLang={setLang}>
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/services" element={<Services lang={lang} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          <Route path="/login" element={<Login lang={lang} />} />

          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard lang={lang} />} />
              <Route path="/masters" element={<Masters />} />
              <Route path="/amc" element={<AMC />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/technician" element={<TechnicianJob />} />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
