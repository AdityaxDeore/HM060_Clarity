'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(
            doc(db, 'users', firebaseUser.uid)
          );
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email,
        displayName,
        age: 0,
        mainGoal: '',
        biggestStruggle: '',
        theme: 'system',
        notificationsEnabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      setUserProfile(userProfile);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const profileRef = doc(db, 'users', result.user.uid);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'User',
          age: 0,
          mainGoal: '',
          biggestStruggle: '',
          theme: 'system',
          notificationsEnabled: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await setDoc(profileRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed';
      setError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
