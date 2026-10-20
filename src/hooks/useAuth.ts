import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { markLogin, clearLogin } from '@/lib/adminSession';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Passe par /api/admin-login : limitation des tentatives côté serveur (5 échecs / IP, 8 / email, sur 15 min).
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 429) throw Object.assign(new Error('locked'), { code: 'locked' });
    if (!res.ok) throw new Error('invalid');
    const { access_token, refresh_token } = await res.json();
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    markLogin();
  };

  const signOut = async () => {
    clearLogin();
    await supabase.auth.signOut();
  };

  return { user, session, loading, signIn, signOut };
}
