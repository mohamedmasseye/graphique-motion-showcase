import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ShoppingBag, Clock } from 'lucide-react';

type Status = 'checking' | 'success' | 'pending' | 'failed';

export default function PaymentReturn() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order') ?? '';
  const hasError = params.get('error') === '1';
  const [status, setStatus] = useState<Status>(hasError ? 'failed' : 'checking');

  useEffect(() => {
    if (hasError || !orderNumber) {
      setStatus(hasError ? 'failed' : 'pending');
      return;
    }

    let attempts = 0;
    let cancelled = false;

    const check = async () => {
      attempts++;
      try {
        const res = await fetch('/api/wave-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (data.payment_status === 'succeeded' || data.status === 'confirmed') {
          setStatus('success');
          return;
        }
        if (data.checkout_status === 'expired' || data.payment_status === 'cancelled') {
          setStatus('failed');
          return;
        }
      } catch {
        // ignore — retry
      }

      // Retry up to 5 times (Wave may take a few seconds to settle)
      if (!cancelled && attempts < 5) {
        setTimeout(check, 2000);
      } else if (!cancelled) {
        setStatus('pending');
      }
    };

    check();
    return () => { cancelled = true; };
  }, [orderNumber, hasError]);

  const config = {
    checking: {
      icon: <Loader2 size={40} className="text-brand-teal animate-spin" />,
      bg: 'bg-brand-teal/15',
      title: 'Vérification du paiement…',
      message: 'Merci de patienter quelques secondes.',
    },
    success: {
      icon: <CheckCircle size={40} className="text-brand-teal" />,
      bg: 'bg-brand-teal/15',
      title: 'Paiement réussi !',
      message: 'Votre commande est confirmée. Nous vous contacterons pour la livraison.',
    },
    pending: {
      icon: <Clock size={40} className="text-brand-orange" />,
      bg: 'bg-brand-orange/15',
      title: 'Paiement en cours de traitement',
      message: 'Votre paiement est en cours de validation. Vous recevrez une confirmation sous peu.',
    },
    failed: {
      icon: <XCircle size={40} className="text-red-400" />,
      bg: 'bg-red-400/15',
      title: 'Paiement non abouti',
      message: 'Le paiement n\'a pas pu être finalisé. Vous pouvez réessayer depuis votre panier.',
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
      </motion.div>
    </div>
  );
}
