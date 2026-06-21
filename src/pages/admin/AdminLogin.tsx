import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,178,170,0.04)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-brand-teal" />
          </div>
          <h1 className="text-white font-black text-2xl">Administration</h1>
          <p className="text-white/30 text-sm mt-1">Graphique & Motion</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 space-y-4"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-3.5 text-white/25" />
            <input
              type="email"
              placeholder="Email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-3.5 text-white/25" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-white/25 hover:text-white/50 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2.5">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion…</> : 'Se connecter'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
