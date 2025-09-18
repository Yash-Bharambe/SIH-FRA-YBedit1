import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userType: 'employee' | 'public' | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  userType: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'employee' | 'public' | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        setUserType(session.user.user_metadata.user_type || 'public');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          setUserType(session.user.user_metadata.user_type || 'public');
        } else {
          setUserType(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('Starting logout process...');
      
      // Clear local state first
      setCurrentUser(null);
      setUserType(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase logout error:', error);
        // Even if Supabase logout fails, we've cleared local state
      }
      
      // Clear any stored session data
      localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
      sessionStorage.clear();
      
      console.log('Logout completed successfully');
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if there's an error
      setCurrentUser(null);
      setUserType(null);
      return { error };
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    userType,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password) => supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          user_type: 'public' // Default to public user
        }
      }
    }),
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
