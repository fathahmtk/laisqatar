
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { WorkOrders } from './pages/WorkOrders';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Contracts } from './pages/Contracts';
import { Clients } from './pages/Clients';
import { Reports } from './pages/Reports';
import { Assets } from './pages/Assets';
import { Accounts } from './pages/Accounts'; // Kept for legacy compatibility if needed
import { Finance } from './pages/Finance'; // New Module
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Projects } from './pages/Projects'; // New Module
import { TechnicianJob } from './pages/TechnicianJob'; // New Module
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
          {/* Public Routes */}
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/services" element={<Services lang={lang} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          <Route path="/login" element={<Login lang={lang} />} />

          {/* Private Routes Guard */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard lang={lang} />} />
              <Route path="/work-orders" element={<WorkOrders lang={lang} />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/technician" element={<TechnicianJob />} />
              
              {/* Redirect old accounts route to new finance */}
              <Route path="/accounts" element={<Navigate to="/finance" replace />} />
              
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
