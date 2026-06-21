import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Package, CheckCircle, ShoppingBag, MapPin, Phone, User, Mail, MessageSquare, Loader2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatPrice';
import { supabase } from '@/lib/supabase';
import type { PaymentMethod } from '@/types/database';

const SHIPPING_FEE = 2000;
const FREE_SHIPPING_THRESHOLD = 50000;

type Step = 'info' | 'payment' | 'confirm';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
}

export default function Checkout() {
  const { items, subtotal, clearCart, close: closeCart } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const [info, setInfo] = useState<CustomerInfo>({
    name: '', phone: '', email: '', address: '', city: 'Dakar', notes: '',
  });

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;

  const isInfoValid = info.name.trim().length >= 2 && info.phone.trim().length >= 9 && info.address.trim().length >= 5;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: 'TEMP',
          customer_name: info.name.trim(),
          customer_phone: info.phone.trim(),
          customer_email: info.email.trim() || null,
          customer_address: info.address.trim(),
          city: info.city,
          payment_method: paymentMethod,
          subtotal: sub,
          shipping_fee: shipping,
          total,
          notes: info.notes.trim() || null,
        })
        .select('id, order_number')
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        variant_id: item.variant?.id ?? null,
        variant_name: item.variant?.name ?? null,
        quantity: item.quantity,
        unit_price: item.variant?.price ?? item.product.price,
        total: (item.variant?.price ?? item.product.price) * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      // Notify admin (email)
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      }).catch(() => {});

      // Wave payment → redirect to Wave checkout
      if (paymentMethod === 'wave') {
        try {
          const waveRes = await fetch('/api/wave-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: total,
              orderId: order.id,
              orderNumber: order.order_number,
              customerPhone: info.phone.trim(),
            }),
          });
          const waveData = await waveRes.json();
          if (waveData.wave_launch_url) {
            clearCart();
            window.location.href = waveData.wave_launch_url;
            return;
          }
        } catch {
          // Wave failed — fall through to confirmation page
        }
      }

      setOrderNumber(order.order_number);
      setStep('confirm');
      clearCart();
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la commande. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0E0E14] border border-white/10 rounded-2xl p-10 text-center max-w-sm mx-4"
        >
          <ShoppingBag size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white font-bold text-lg mb-2">Panier vide</p>
          <p className="text-white/40 text-sm mb-6">Ajoutez des produits avant de commander</p>
          <Link
            to="/boutique"
            className="inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-3 px-6 rounded-xl text-sm"
          >
            <ArrowLeft size={16} /> Voir la boutique
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-lg bg-[#0E0E14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(0,178,170,0.06)' }}
        >
          {/* Glow accents */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-40 h-40 rounded-full bg-brand-teal/8 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-brand-orange/6 blur-[80px]" />

          {/* Close button */}
          {step !== 'confirm' && (
            <Link
              to="/boutique"
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <X size={16} />
            </Link>
          )}

          {/* Progress bar */}
          {step !== 'confirm' && (
            <div className="px-6 pt-6 pb-2">
              <div className="flex gap-2">
                {(['info', 'payment'] as Step[]).map((s, i) => (
                  <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.08]">
                    <motion.div
                      className="h-full bg-brand-teal rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: step === 'info' ? (i === 0 ? '100%' : '0%')
                             : step === 'payment' ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <AnimatePresence mode="wait">
              {/* ═══ STEP 1: Info client ═══ */}
              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-white font-black text-xl mt-4 mb-1">Informations de livraison</h2>
                  <p className="text-white/40 text-sm mb-6">Où devons-nous livrer votre commande ?</p>

                  <div className="space-y-4">
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-white/25" />
                      <input
                        type="text"
                        placeholder="Nom complet *"
                        value={info.name}
                        onChange={(e) => setInfo({ ...info, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-white/25" />
                      <input
                        type="tel"
                        placeholder="Téléphone * (ex: 77 564 44 78)"
                        value={info.phone}
                        onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-white/25" />
                      <input
                        type="email"
                        placeholder="Email (optionnel)"
                        value={info.email}
                        onChange={(e) => setInfo({ ...info, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-white/25" />
                      <input
                        type="text"
                        placeholder="Adresse de livraison * (quartier, rue...)"
                        value={info.address}
                        onChange={(e) => setInfo({ ...info, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all"
                      />
                    </div>

                    <select
                      value={info.city}
                      onChange={(e) => setInfo({ ...info, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40 cursor-pointer"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Mbour">Mbour</option>
                      <option value="Kaolack">Kaolack</option>
                      <option value="Autre">Autre ville</option>
                    </select>

                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-white/25" />
                      <textarea
                        placeholder="Instructions de livraison (optionnel)"
                        value={info.notes}
                        onChange={(e) => setInfo({ ...info, notes: e.target.value })}
                        rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/30 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!isInfoValid}
                    className="w-full mt-6 bg-brand-teal hover:bg-brand-teal/85 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm"
                  >
                    Continuer vers le paiement
                  </button>
                </motion.div>
              )}

              {/* ═══ STEP 2: Paiement ═══ */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    onClick={() => setStep('info')}
                    className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/60 transition-colors mt-4 mb-4"
                  >
                    <ArrowLeft size={14} /> Retour
                  </button>

                  <h2 className="text-white font-black text-xl mb-1">Mode de paiement</h2>
                  <p className="text-white/40 text-sm mb-6">Comment souhaitez-vous payer ?</p>

                  {/* Payment options */}
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'bg-brand-teal/10 border-brand-teal/50'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-white/15'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === 'cash_on_delivery' ? 'bg-brand-teal/20' : 'bg-white/[0.06]'
                      }`}>
                        <Truck size={18} className={paymentMethod === 'cash_on_delivery' ? 'text-brand-teal' : 'text-white/40'} />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-bold text-sm ${paymentMethod === 'cash_on_delivery' ? 'text-white' : 'text-white/70'}`}>
                          Paiement à la livraison
                        </p>
                        <p className="text-white/30 text-xs">Payez en espèces à la réception</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'cash_on_delivery' ? 'border-brand-teal' : 'border-white/20'
                      }`}>
                        {paymentMethod === 'cash_on_delivery' && (
                          <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-brand-teal"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          />
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('wave')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        paymentMethod === 'wave'
                          ? 'bg-[#1DC3FF]/10 border-[#1DC3FF]/50'
                          : 'bg-white/[0.04] border-white/[0.08] hover:border-white/15'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                        paymentMethod === 'wave' ? 'bg-[#1DC3FF]/20 text-[#1DC3FF]' : 'bg-white/[0.06] text-white/40'
                      }`}>
                        W
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-bold text-sm ${paymentMethod === 'wave' ? 'text-white' : 'text-white/70'}`}>
                          Wave
                        </p>
                        <p className="text-white/30 text-xs">Paiement mobile instantané</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === 'wave' ? 'border-[#1DC3FF]' : 'border-white/20'
                      }`}>
                        {paymentMethod === 'wave' && (
                          <motion.div
                            className="w-2.5 h-2.5 rounded-full bg-[#1DC3FF]"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Order summary */}
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 mb-6">
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Récapitulatif</p>

                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      {items.map((item) => {
                        const price = item.variant?.price ?? item.product.price;
                        return (
                          <div key={`${item.product.id}:${item.variant?.id}`} className="flex items-center justify-between text-sm">
                            <span className="text-white/60 truncate flex-1 mr-2">
                              {item.product.name}
                              {item.variant && <span className="text-white/30"> · {item.variant.name}</span>}
                              <span className="text-white/25"> × {item.quantity}</span>
                            </span>
                            <span className="text-white font-semibold shrink-0">{formatPrice(price * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/[0.08] pt-3 space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Sous-total</span>
                        <span className="text-white/60">{formatPrice(sub)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Livraison</span>
                        <span className={shipping === 0 ? 'text-brand-teal font-semibold' : 'text-white/60'}>
                          {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-brand-teal/60 text-[10px]">
                          Gratuite à partir de {formatPrice(FREE_SHIPPING_THRESHOLD)}
                        </p>
                      )}
                      <div className="flex justify-between text-base pt-2 border-t border-white/[0.06]">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-brand-teal font-black text-lg">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-6">
                    <p className="text-white/50 text-xs">
                      <span className="font-semibold text-white/70">{info.name}</span> · {info.phone}
                    </p>
                    <p className="text-white/30 text-xs">{info.address}, {info.city}</p>
                  </div>

                  {error && (
                    <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all text-sm"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Traitement en cours…</>
                    ) : paymentMethod === 'wave' ? (
                      <><CreditCard size={16} /> Payer {formatPrice(total)} avec Wave</>
                    ) : (
                      <><Package size={16} /> Confirmer la commande · {formatPrice(total)}</>
                    )}
                  </button>
                </motion.div>
              )}

              {/* ═══ STEP 3: Confirmation ═══ */}
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-brand-teal/15 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} className="text-brand-teal" />
                    </div>
                  </motion.div>

                  <h2 className="text-white font-black text-2xl mb-2">Commande confirmée !</h2>
                  <p className="text-white/40 text-sm mb-2">Votre numéro de commande</p>

                  <div className="inline-block bg-white/[0.06] border border-white/10 rounded-xl px-6 py-3 mb-6">
                    <span className="text-brand-teal font-mono font-black text-xl tracking-wider">{orderNumber}</span>
                  </div>

                  <p className="text-white/40 text-sm max-w-xs mx-auto mb-2">
                    {paymentMethod === 'wave'
                      ? 'Vous recevrez un lien de paiement Wave par SMS sous quelques minutes.'
                      : 'Nous vous contacterons pour confirmer la livraison et le paiement.'}
                  </p>
                  <p className="text-white/30 text-xs mb-8">
                    Un récapitulatif sera envoyé sur WhatsApp au {info.phone}
                  </p>

                  <div className="flex flex-col gap-3">
                    <Link
                      to="/boutique"
                      className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm"
                    >
                      <ShoppingBag size={16} /> Continuer vos achats
                    </Link>
                    <Link
                      to="/"
                      className="text-white/40 text-sm hover:text-white/60 transition-colors py-2"
                    >
                      Retour à l'accueil
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
