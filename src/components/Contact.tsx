import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Instagram, Facebook, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// ─── EmailJS configuration ──────────────────────────────────────────────────
// 1. Créez un compte sur https://www.emailjs.com
// 2. Ajoutez un service email (Gmail → Service ID ci-dessous)
// 3. Créez un template avec les variables : {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Copiez vos clés ici ou dans un fichier .env (VITE_EMAILJS_*)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
// ────────────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach((el) => el.classList.add('active'));
      }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal/50 text-white placeholder:text-white/30 transition-all duration-200 text-sm';

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(140deg, #080508 0%, #0D0810 50%, #0A0608 100%)' }}>
      {/* Atmospheric lighting chaude */}
      <div className="pointer-events-none absolute -top-32 left-0 w-[500px] h-[500px] rounded-full bg-brand-purple/5 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 w-[500px] h-[500px] rounded-full bg-brand-orange/7 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-brand-teal/3 blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Contact</p>
          <h2 className="font-syne text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            Parlons de votre <span className="text-brand-orange">projet</span>.
          </h2>
          <p className="mt-5 text-[#A0A0A0] text-lg max-w-xl">
            Une idée ? Une question ? On répond dans les 24h.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info panel */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#A0A0A0] leading-relaxed">
              Nous sommes disponibles pour discuter de vos projets et répondre à toutes vos questions. N'hésitez pas à nous écrire.
            </p>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Adresse', value: 'Dakar, Sénégal' },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'graphiquemotion@gmail.com',
                  href: 'mailto:graphiquemotion@gmail.com',
                },
                { icon: Phone, label: 'Téléphone', value: '+221 77 564 44 78', href: 'tel:+221775644478' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-[#A0A0A0] font-medium uppercase tracking-widest mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm hover:text-brand-teal transition-colors">{value}</a>
                    ) : (
                      <p className="text-white text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-[#A0A0A0] font-medium uppercase tracking-widest mb-4">Suivez-nous</p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/18ZbMPjH39/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://www.instagram.com/graphiquemotion"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8">
              {status === 'success' ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-16 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={48} className="text-brand-teal mb-4" />
                  <h3 className="text-xl font-black text-white mb-2">Message envoyé !</h3>
                  <p className="text-[#A0A0A0] text-sm">Nous vous répondrons dans les 24h.</p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Nom complet</label>
                      <input
                        type="text" id="name" name="from_name"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        required className={inputClass} placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Email</label>
                      <input
                        type="email" id="email" name="from_email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        required className={inputClass} placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="subject" className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Sujet</label>
                    <input
                      type="text" id="subject" name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                      required className={inputClass} placeholder="Sujet de votre message"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Message</label>
                    <textarea
                      id="message" name="message"
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      required rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Décrivez votre projet..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-5 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                      <AlertCircle size={16} />
                      Erreur lors de l'envoi. Réessayez ou contactez-nous sur WhatsApp.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-200 text-sm cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
