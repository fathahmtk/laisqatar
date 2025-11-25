
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Accounts: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => navigate('/finance', { replace: true }), [navigate]);
  return <div className="p-10 text-center">Redirecting to Finance...</div>;
};
