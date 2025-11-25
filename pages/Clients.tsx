
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Clients: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => navigate('/masters', { replace: true }), [navigate]);
  return <div className="p-10 text-center">Redirecting to Master Data...</div>;
};
