import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userRole: Role;
  loading: boolean;
  logout: () => Promise<void>;
  setUserRole: (role: Role) => void; // Only for demo purposes to switch views
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
  // In a real app, role is fetched from a 'users' collection in Firestore based on UID.
  // For this prototype, we default to ADMIN but allow switching.
  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // Here you would typically fetch the user's role from Firestore
      // const docRef = doc(db, "users", user.uid);
      // ...
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserRole(Role.PUBLIC);
  };

  const value = {
    currentUser,
    userRole,
    setUserRole,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};