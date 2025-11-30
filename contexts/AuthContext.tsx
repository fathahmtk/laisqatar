
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Role, User } from '../types';
import { Api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  userRole: Role;
  loading: boolean;
  login: (credentials: {email: string, password: string}) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<Role>(Role.PUBLIC);

  useEffect(() => {
    // Check for a token on initial load
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd verify the token with the backend here
      // and fetch user details. For now, we'll simulate it.
      const demoUser: User = {
        id: 'user-001',
        username: 'admin',
        email: 'admin@laisqatar.com',
        fullName: 'Admin User',
        role: Role.ADMIN,
      };
      setCurrentUser(demoUser);
      setUserRole(Role.ADMIN);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: {email: string, password: string}) => {
    // Django's default User model uses 'username', not 'email' for login
    // This assumes you've configured Django to accept email or you map it here.
    const { access } = await Api.login({ username: credentials.email, password: credentials.password });
    localStorage.setItem('authToken', access);
    
    const loggedInUser: User = {
      id: 'user-001',
      username: credentials.email.split('@')[0],
      email: credentials.email,
      fullName: 'Admin User',
      role: Role.ADMIN,
    };
    setCurrentUser(loggedInUser);
    setUserRole(Role.ADMIN);
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setUserRole(Role.PUBLIC);
  };

  const loginDemo = async () => {
    // This simulates getting a token and setting the user state
    localStorage.setItem('authToken', 'demo-token');
    const demoUser: User = {
      id: 'demo-admin',
      username: 'demoadmin',
      email: 'admin@laisqatar.com',
      fullName: 'System Admin (Demo)',
      role: Role.ADMIN,
    };
    setCurrentUser(demoUser);
    setUserRole(Role.ADMIN);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
    loginDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
