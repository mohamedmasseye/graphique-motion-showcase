import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { SITE, SOCIAL_LINKS, BUDGET_OPTIONS, SERVICES, getWhatsAppUrl } from '@/data/content';
import Head from '@/components/Head';

type Status = 'idle' | 'loading' | 'success' | 'error';

async function sendViaBrevo(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch('/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur ${res.status}`);
  }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await sendViaBrevo({
        name: formData.name,
        email: formData.email,
        subject: formData.service || formData.subject || 'Nouvelle demande via le site',
        message: [
          formData.whatsapp ? `WhatsApp: ${formData.whatsapp}` : '',
          formData.company ? `Entreprise: ${formData.company}` : '',
          formData.service ? `Service: ${formData.service}` : '',
          formData.budget ? `Budget: ${formData.budget}` : '',
          '',
          formData.message,
        ]
          .filter(Boolean)
          .join('\n'),
      });
      setStatus('success');
      setFormData({ name: '', email: '', whatsapp: '', company: '', service: '', budget: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal/50 text-white placeholder:text-white/30 transition-all duration-200 text-sm';

  return (
    <>
      <Head title="Contact" description="Contactez Graphique & Motion pour votre projet digital. Réponse sous 24h. WhatsApp, email ou formulaire." />

      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(140deg, #080508 0%, #0D0810 50%, #0A0608 100%)' }}>
        <div className="pointer-events-none absolute -top-32 left-0 w-[500px] h-[500px] rounded-full bg-brand-purple/5 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[130px]" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-16">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Contact</p>
            <h1 className="font-syne text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              Parlons de votre <span className="text-brand-orange">projet</span>
            </h1>
            <p className="mt-5 text-[#A0A0A0] text-lg max-w-xl">
              Une idée ? Une question ? On répond dans les 24h.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info panel */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              <p className="text-[#A0A0A0] leading-relaxed">
                Disponibles pour discuter de vos projets et répondre à toutes vos questions.
              </p>

              <div className="space-y-5">
                {[
                  { icon: MapPin, label: 'Adresse', value: SITE.address },
                  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
                  { icon: Phone, label: 'Téléphone', value: SITE.phoneFormatted, href: `tel:${SITE.phone}` },
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

              {/* Quick WhatsApp */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-4 hover:bg-[#25D366]/15 transition-all"
              >
                <MessageCircle size={20} className="text-[#25D366]" />
                <div>
                  <p className="text-white text-sm font-semibold">Discuter sur WhatsApp</p>
                  <p className="text-white/40 text-xs">Réponse immédiate</p>
                </div>
              </a>

              {/* Social */}
              <div>
                <p className="text-xs text-[#A0A0A0] font-medium uppercase tracking-widest mb-4">Suivez-nous</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LINKS.filter((s) => s.name !== 'WhatsApp').map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs font-medium hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <CheckCircle size={48} className="text-brand-teal mb-4" />
                    <h3 className="text-xl font-black text-white mb-2">Message envoyé !</h3>
                    <p className="text-[#A0A0A0] text-sm">Nous vous répondrons dans les 24h.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Nom complet *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Votre nom" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="votre@email.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">WhatsApp</label>
                        <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} placeholder="+221 77 xxx xx xx" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Entreprise</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Nom de votre entreprise" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Service souhaité</label>
                        <select name="service" value={formData.service} onChange={handleChange} className={inputClass}>
                          <option value="">Sélectionnez un service</option>
                          {SERVICES.map((s) => (
                            <option key={s.slug} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Budget estimé</label>
                        <select name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                          <option value="">Sélectionnez une fourchette</option>
                          {BUDGET_OPTIONS.map((b) => (
                            <option key={b.value} value={b.label}>{b.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-[#A0A0A0] uppercase tracking-widest mb-2">Décrivez votre projet *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-none`} placeholder="Parlez-nous de votre projet, vos objectifs, vos délais..." />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mb-5 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                        <AlertCircle size={16} />
                        Erreur lors de l'envoi. Réessayez ou contactez-nous sur WhatsApp.
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-xl transition-all text-sm cursor-pointer"
                      >
                        {status === 'loading' ? (
                          <><Loader2 size={16} className="animate-spin" /> Envoi...</>
                        ) : (
                          <>Envoyer <Send size={15} /></>
                        )}
                      </button>
                      <a
                        href={getWhatsAppUrl(`Bonjour, je suis intéressé par vos services. ${formData.service ? `Service: ${formData.service}` : ''}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-bold py-3.5 px-8 rounded-xl transition-all text-sm hover:bg-[#25D366]/25"
                      >
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
