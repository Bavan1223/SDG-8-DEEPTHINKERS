/* ============================================================
   AgriAgent – AuthContext
   Provides Firebase auth state to entire app
   ============================================================ */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('your_');

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (isDemoMode) {
      const cached = sessionStorage.getItem('agriagent_demo_user');
      if (cached) setUser(JSON.parse(cached) as User);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, [isDemoMode]);

  const signInWithGoogle = async () => {
    if (isDemoMode) {
      const mockUser = {
        uid: 'demo-user-001',
        email: 'farmer@agriagent.demo',
        displayName: 'Ramesh Kumar',
        photoURL: 'https://ui-avatars.com/api/?name=Ramesh+Kumar&background=047857&color=fff',
      } as unknown as User;
      setUser(mockUser);
      sessionStorage.setItem('agriagent_demo_user', JSON.stringify(mockUser));
      return;
    }

    const provider = new GoogleAuthProvider();
    // Force account selection every time
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (isDemoMode) {
      setUser(null);
      sessionStorage.removeItem('agriagent_demo_user');
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
