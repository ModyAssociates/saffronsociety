import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, type Profile } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/*  context type – now includes BOTH old and new method names          */
/* ------------------------------------------------------------------ */
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;

  /* new names */
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (
    e: string,
    p: string,
    fullName?: string,
  ) => Promise<void>;

  /* legacy aliases (login pages still call these) */
  signIn: (e: string, p: string) => Promise<void>;
  signUp: (e: string, p: string, fullName?: string) => Promise<void>;

  /* oauth + sign-out */
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

/* ------------------------------------------------------------------ */
/*  provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- supabase not configured ---------- */
  if (!supabase) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          profile: null,
          session: null,
          isAdmin: false,
          loading: false,
          signIn: async () =>
            alert('Auth not configured in this environment.'),
          signUp: async () =>
            alert('Auth not configured in this environment.'),
          signInWithEmail: async () =>
            alert('Auth not configured in this environment.'),
          signUpWithEmail: async () =>
            alert('Auth not configured in this environment.'),
          signInWithGoogle: async () =>
            alert('Auth not configured in this environment.'),
          signInWithFacebook: async () =>
            alert('Auth not configured in this environment.'),
          signOut: async () => {},
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  /* ---------------- helpers ---------------- */
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    setProfile(data);
  };

  const createProfile = async (
    id: string,
    email: string,
    fullName?: string,
  ) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id, email, full_name: fullName, role: 'user' })
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
  };

  /* ------------- email / password ------------- */
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName?: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    if (data.user) await createProfile(data.user.id, email, fullName);
  };

  /* --------- legacy aliases (for old components) --------- */
  const signIn = signInWithEmail;
  const signUp = signUpWithEmail;

  /* ----------------- oauth helpers ----------------- */
  const buildRedirect = () => `${window.location.origin}/account`;

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: buildRedirect(),
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) throw error;
  };

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: buildRedirect() },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut().catch(console.error);
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  /* ---------------- mount effects ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchProfile(data.session.user.id).catch(console.error);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, sess) => {
        setSession(sess ?? null);
        setUser(sess?.user ?? null);
        if (sess?.user) fetchProfile(sess.user.id).catch(console.error);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin: profile?.role === 'admin',
        loading,
        signInWithEmail,
        signUpWithEmail,
        signIn, // legacy
        signUp, // legacy
        signInWithGoogle,
        signInWithFacebook,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
