
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez envoyer le formulaire à un backend
    console.log('Form submitted:', formData);
    toast({
      title: "Message envoyé!",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            elements.forEach(el => el.classList.add('active'));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section id="contact" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-design-dark"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-design-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-design-accent mb-2 reveal">Contact</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 reveal" data-delay="1">Discutons de votre projet</h3>
          <div className="w-20 h-1 bg-design-accent mx-auto mb-8 reveal" data-delay="2"></div>
          <p className="max-w-2xl mx-auto text-gray-300 reveal" data-delay="3">
            Une idée de projet ? Une question ? N'hésitez pas à me contacter.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="space-y-8 reveal-left">
              <h4 className="text-2xl font-bold mb-6">Informations de contact</h4>
              <p className="text-gray-300">
                Je suis disponible pour discuter de vos projets et répondre à toutes vos questions.
              </p>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-design-accent/10 flex items-center justify-center text-design-accent mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Adresse</h5>
                    <p className="text-gray-400">Votre adresse ici</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-design-accent/10 flex items-center justify-center text-design-accent mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Email</h5>
                    <p className="text-gray-400">votre@email.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-lg bg-design-accent/10 flex items-center justify-center text-design-accent mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Téléphone</h5>
                    <p className="text-gray-400">+1 234 567 890</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <h5 className="font-medium mb-4">Suivez-moi</h5>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-design-accent hover:border-design-accent transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-design-accent hover:border-design-accent transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-design-accent hover:border-design-accent transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 reveal-right">
            <div className="card-dark p-8">
              <h4 className="text-2xl font-bold mb-6">Envoyez-moi un message</h4>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="text-sm text-gray-400 block mb-2">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-design-accent/50 text-white"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="text-sm text-gray-400 block mb-2">Adresse email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-design-accent/50 text-white"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="text-sm text-gray-400 block mb-2">Sujet</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-design-accent/50 text-white"
                    placeholder="Sujet de votre message"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="text-sm text-gray-400 block mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-design-accent/50 text-white resize-none"
                    placeholder="Votre message ici..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="bg-design-accent hover:bg-design-accent/90 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center"
                >
                  Envoyer le message <Send size={16} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
