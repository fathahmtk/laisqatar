
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

// Helper to map backend user data to frontend User type
const mapBackendUserToUser = (backendUser: any): User => {
    // This is a simple mapping. You might need to adjust based on your Django user/profile model.
    // Assuming 'groups' or a profile field defines the role.
    const roleName = backendUser.groups?.[0]?.name?.toUpperCase() || 'TECHNICIAN';
    return {
        id: backendUser.id.toString(),
        username: backendUser.username,
        email: backendUser.email,
        fullName: backendUser.first_name + ' ' + backendUser.last_name,
        role: Role[roleName as keyof typeof Role] || Role.TECHNICIAN,
    };
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<Role>(Role.PUBLIC);

  const fetchAndSetUser = async () => {
    try {
        // This endpoint needs to be created in your Django backend
        // to return the currently authenticated user's details.
        const backendUser = await Api.getProfile(); 
        const user = mapBackendUserToUser(backendUser);
        setCurrentUser(user);
        setUserRole(user.role);
    } catch (error) {
        console.error("Failed to fetch profile, logging out.", error);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setUserRole(Role.PUBLIC);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchAndSetUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: {email: string, password: string}) => {
    const { access } = await Api.login({ username: credentials.email, password: credentials.password });
    localStorage.setItem('authToken', access);
    await fetchAndSetUser();
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setUserRole(Role.PUBLIC);
  };

  const loginDemo = async () => {
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
