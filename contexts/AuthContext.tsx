import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Role } from '../types';
import { syncUser } from '../services/db';

interface AuthContextType {
  currentUser: User | null;
  userRole: Role;
  loading: boolean;
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
    // Listen for real Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const role = await syncUser(user);
        setUserRole(role);
      } else {
        // Only reset if we aren't in a demo session (demo users have a specific UID prefix)
        if (currentUser?.uid !== 'demo-admin') {
          setCurrentUser(null);
          setUserRole(Role.PUBLIC);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Ignore firebase errors if in demo mode
    }
    setCurrentUser(null);
    setUserRole(Role.PUBLIC);
  };

  const loginDemo = async () => {
    // Simulate an authenticated user
    const demoUser = {
      uid: 'demo-admin',
      email: 'admin@laisqatar.com',
      displayName: 'System Admin',
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'demo-token',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: null,
      photoURL: null
    } as unknown as User;

    setCurrentUser(demoUser);
    setUserRole(Role.ADMIN);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout,
    loginDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};