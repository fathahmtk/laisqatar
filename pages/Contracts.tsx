
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Contracts: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => navigate('/amc', { replace: true }), [navigate]);
  return <div className="p-10 text-center">Redirecting to AMC Management...</div>;
};
