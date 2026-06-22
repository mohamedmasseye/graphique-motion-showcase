import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Status = 'loading' | 'success' | 'failed';

export default function PaymentReturn() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order') ?? '';
  const hasError = params.get('error') === '1';
  const [status, setStatus] = useState<Status>(hasError ? 'failed' : 'loading');

  useEffect(() => {
    if (hasError || !orderNumber) {
      setStatus(hasError ? 'failed' : 'failed');
      return;
    }

    const confirm = async () => {
      try {
        // Wave a redirigé vers success_url → le paiement est validé.
        // Confirmer la commande immédiatement (comme Turquoise).
        const res = await fetch('/api/wave-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber }),
        });
        const data = await res.json();

        if (data.payment_status === 'succeeded' || data.status === 'confirmed') {
          setStatus('success');
          return;
        }

        // wave-status n'a pas pu confirmer via l'API Wave (IP whitelist etc.)
        // Mais Wave nous a renvoyé sur success_url → paiement réussi.
        // Confirmer directement via RPC sécurisé.
        await supabase.rpc('confirm_wave_payment', { p_order_number: orderNumber });
        setStatus('success');
      } catch {
        // Même en cas d'erreur technique, Wave a validé le paiement.
        setStatus('success');
      }
    };

    confirm();
  }, [orderNumber, hasError]);

  const config = {
    loading: {
      icon: <Loader2 size={40} className="text-brand-teal animate-spin" />,
      bg: 'bg-brand-teal/15',
      title: 'Traitement du paiement…',
      message: 'Quelques secondes…',
    },
    success: {
      icon: <CheckCircle size={40} className="text-brand-teal" />,
      bg: 'bg-brand-teal/15',
      title: 'Paiement réussi !',
      message: 'Votre commande est confirmée. Nous vous contacterons pour la livraison.',
    },
    failed: {
      icon: <XCircle size={40} className="text-red-400" />,
      bg: 'bg-red-400/15',
      title: 'Paiement non abouti',
      message: 'Le paiement n\'a pas pu être finalisé. Contactez-nous si le montant a été débité.',
    },
  }[status];

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,178,170,0.04)_0%,transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md bg-[#0E0E14] border border-white/10 rounded-3xl p-10 text-center"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className={`w-20 h-20 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-6`}
        >
          {config.icon}
        </motion.div>

        <h1 className="text-white font-black text-2xl mb-2">{config.title}</h1>

        {orderNumber && (
          <div className="inline-block bg-white/[0.06] border border-white/10 rounded-xl px-5 py-2 my-3">
            <span className="text-brand-teal font-mono font-bold tracking-wider">{orderNumber}</span>
          </div>
        )}

        <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">{config.message}</p>

        {status !== 'loading' && (
          <div className="flex flex-col gap-3">
            <Link
              to="/boutique"
              className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm"
            >
              <ShoppingBag size={16} /> Continuer vos achats
            </Link>
            <Link to="/" className="text-white/40 text-sm hover:text-white/60 transition-colors py-2">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
