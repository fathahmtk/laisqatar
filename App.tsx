

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
import { Accounts } from './pages/Accounts';
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Role, Language } from './types';

const App = () => {
  const [role, setRole] = useState<Role>(Role.PUBLIC);
  const [lang, setLang] = useState<Language>('en');

  // Custom function to handle Role change (sign out vs sign in)
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
  };

  const handleLogin = (newRole: Role) => {
    setRole(newRole);
  };

  const isAuthenticated = role !== Role.PUBLIC;

  return (
    <Router>
      <Layout role={role} lang={lang} setLang={setLang} setRole={handleRoleChange} isAuthenticated={isAuthenticated}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/services" element={<Services lang={lang} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/contact" element={<Contact lang={lang} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} lang={lang} />} />

          {/* Private Routes Guard */}
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard lang={lang} />} />
              <Route path="/work-orders" element={<WorkOrders role={role} lang={lang} />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              {/* Fallback for auth users */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            // If trying to access private route while public, redirect to login or home
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;