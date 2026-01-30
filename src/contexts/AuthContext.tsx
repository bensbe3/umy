import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, AppUser } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isEditor: () => boolean;
  canAccessCommission: (commissionId: 'ir' | 'mp' | 'sd') => boolean;
  isSuperAdmin: () => boolean;
  hasFullAccess: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setAppUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppUser = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('No user data found for:', userId);
          setAppUser(null);
        } else {
          console.error('Error fetching user:', error);
        }
      } else {
        setAppUser(data || null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast.error('Database not configured. Please set up Supabase.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Provide helpful error message for email confirmation
      if (error.message?.includes('email') && (error.message?.includes('confirm') || error.message?.includes('verified'))) {
        const helpfulMsg = 'Email not confirmed. Please:\n1. Check your email for verification link, OR\n2. Confirm your account in Supabase Dashboard → Authentication → Users';
        console.error(helpfulMsg);
        throw new Error(helpfulMsg);
      }
      throw error;
    }
    
    if (data.user) {
      await fetchAppUser(data.user.id);
      toast.success('Signed in successfully');
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      const errorMsg = 'Database not configured. Please check .env.local file and restart the dev server.';
      console.error(errorMsg);
      console.error('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.error('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Note: 401 on /auth/v1/health is normal - it's not a public endpoint
      // The real test is if signup works
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      if (data.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          toast.success('Account created! You can sign in now.');
        } else {
          toast.success('Account created! Please check your email to verify your account.');
          console.log('User created but email not confirmed. Email:', data.user.email);
          console.log('To disable email confirmation: Supabase Dashboard → Authentication → Providers → Email → Disable "Confirm email"');
        }
      }
    } catch (err: any) {
      console.error('Sign up failed:', err);
      // Provide more helpful error messages
      if (err.message?.includes('fetch') || err.message?.includes('network')) {
        const detailedError = `Cannot connect to Supabase.\n\nPossible issues:\n1. Internet connection\n2. Supabase project inactive\n3. Wrong API key format\n4. Dev server needs restart\n\nCheck browser console (F12) for details.`;
        throw new Error(detailedError);
      }
      throw err;
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAppUser(null);
    toast.success('Signed out successfully');
  };

  const isEditor = () => {
    return appUser?.role === 'editor';
  };

  const canAccessCommission = (commissionId: 'ir' | 'mp' | 'sd') => {
    if (!appUser || appUser.role !== 'super_admin') return false;
    return appUser.commissions_role === 'full' || appUser.commissions_role === commissionId;
  };

  const isSuperAdmin = () => {
    return appUser?.role === 'super_admin';
  };

  const hasFullAccess = () => {
    return appUser?.role === 'super_admin' && appUser.commissions_role === 'full';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        appUser,
        loading,
        signIn,
        signUp,
        signOut,
        isEditor,
        canAccessCommission,
        isSuperAdmin,
        hasFullAccess,
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
