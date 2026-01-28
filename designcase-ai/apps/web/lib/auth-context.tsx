'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Get initial session
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, [supabase]);

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) {
          throw signInError;
        }

        // Router will be updated via auth state change listener
      } catch (err: any) {
        const errorMessage =
          err.message || 'Failed to sign in. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null);
      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // Success message will be shown via user feedback
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Failed to create account. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      setSession(null);
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      const errorMessage =
        err.message || 'Failed to sign out. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase, router]);

  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'github') => {
      setError(null);
      try {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (oauthError) {
          throw oauthError;
        }
      } catch (err: any) {
        const errorMessage =
          err.message || `Failed to sign in with ${provider}. Please try again.`;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [supabase]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * Must be used in a component wrapped with AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
