
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const WorkOrders: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => navigate('/jobs', { replace: true }), [navigate]);
  return <div className="p-10 text-center">Redirecting to Job Cards...</div>;
};
