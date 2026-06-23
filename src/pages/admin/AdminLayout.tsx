import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, FolderKanban, Settings, LogOut,
  Menu, X, ChevronLeft, Bell, Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useEffect, useState as useS } from 'react';
import { toast } from 'sonner';

// Petit son de notification (bip court encodé en base64 WAV)
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1175, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // ignore
  }
}

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Produits' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  { to: '/admin/portfolio', icon: FolderKanban, label: 'Portfolio' },
  { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useS(0);
  const [notifOpen, setNotifOpen] = useS(false);
  const [recentOrders, setRecentOrders] = useS<any[]>([]);

  const loadRecent = () => {
    supabase
      .from('orders')
      .select('id, order_number, customer_name, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setRecentOrders(data ?? []));
  };

  useEffect(() => {
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingOrders(count ?? 0));

    loadRecent();

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setPendingOrders((c) => c + 1);
        loadRecent();
        playNotificationSound();
        const order: any = payload.new;
        const fmt = new Intl.NumberFormat('fr-SN').format(order?.total ?? 0);
        toast.success('🛒 Nouvelle commande !', {
          description: `${order?.order_number ?? ''} — ${order?.customer_name ?? ''} · ${fmt} FCFA`,
          duration: 10000,
          action: {
            label: 'Voir',
            onClick: () => navigate('/admin/orders'),
          },
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [navigate]);

  const openNotif = () => {
    loadRecent();
    setNotifOpen((o: boolean) => !o);
  };

  const goToOrders = () => {
    setNotifOpen(false);
    navigate('/admin/orders');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[240px]';

  return (
    <div className="min-h-screen bg-[#08080C] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col bg-[#0C0C12] border-r border-white/[0.06] transition-all duration-300 ${sidebarWidth} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06]">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-black text-sm tracking-tight"
            >
              G&M <span className="text-brand-teal">Admin</span>
            </motion.span>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all hidden lg:block"
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-white/40 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-teal/10 text-brand-teal'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`
              }
            >
              <div className="relative shrink-0">
                <Icon size={18} />
                {label === 'Commandes' && pendingOrders > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-orange rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                    {pendingOrders}
                  </span>
                )}
              </div>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                  {label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/[0.06] bg-[#08080C]/80 backdrop-blur-xl sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <button
                onClick={openNotif}
                className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-white/40 hover:text-white/70 transition-colors" />
                {pendingOrders > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-brand-orange rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {pendingOrders}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#0C0C12] border border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <span className="text-white font-bold text-sm">Notifications</span>
                        {pendingOrders > 0 && (
                          <span className="text-brand-orange text-xs font-semibold">{pendingOrders} en attente</span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {recentOrders.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell size={24} className="text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-xs">Aucune commande</p>
                          </div>
                        ) : (
                          recentOrders.map((o) => (
                            <button
                              key={o.id}
                              onClick={goToOrders}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left border-b border-white/[0.04]"
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${o.status === 'pending' ? 'bg-brand-orange/15' : 'bg-brand-teal/15'}`}>
                                {o.status === 'pending'
                                  ? <Clock size={14} className="text-brand-orange" />
                                  : <ShoppingCart size={14} className="text-brand-teal" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-semibold truncate">{o.customer_name}</p>
                                <p className="text-white/40 text-[10px] font-mono">{o.order_number}</p>
                              </div>
                              <span className="text-brand-teal text-xs font-bold shrink-0">
                                {new Intl.NumberFormat('fr-SN').format(o.total)} F
                              </span>
                            </button>
                          ))
                        )}
                      </div>

                      <button
                        onClick={goToOrders}
                        className="w-full px-4 py-3 text-center text-brand-teal text-xs font-semibold hover:bg-white/[0.03] transition-colors border-t border-white/[0.06]"
                      >
                        Voir toutes les commandes
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center">
              <span className="text-brand-teal text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
