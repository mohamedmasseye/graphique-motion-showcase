import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, DollarSign, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/formatPrice';
import type { Order } from '@/types/database';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
}

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending:   { icon: Clock,       color: '#F5821F', label: 'En attente' },
  confirmed: { icon: CheckCircle, color: '#00B2AA', label: 'Confirmée' },
  preparing: { icon: Package,     color: '#378ADD', label: 'En préparation' },
  shipped:   { icon: Truck,       color: '#7F77DD', label: 'Expédiée' },
  delivered: { icon: CheckCircle, color: '#28C840', label: 'Livrée' },
  cancelled: { icon: XCircle,     color: '#FF5F57', label: 'Annulée' },
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ordersRes, productsRes, recentRes] = await Promise.all([
        supabase.from('orders').select('total, status'),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const orders = ordersRes.data ?? [];
      const delivered = orders.filter((o) => o.status === 'delivered' || o.status === 'confirmed');
      const pending = orders.filter((o) => o.status === 'pending');

      setStats({
        totalRevenue: delivered.reduce((s, o) => s + o.total, 0),
        totalOrders: orders.length,
        totalProducts: productsRes.count ?? 0,
        pendingOrders: pending.length,
      });
      setRecentOrders((recentRes.data ?? []) as Order[]);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Chiffre d\'affaires', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: '#00B2AA' },
    { label: 'Commandes', value: stats.totalOrders.toString(), icon: ShoppingCart, color: '#F5821F' },
    { label: 'Produits', value: stats.totalProducts.toString(), icon: Package, color: '#378ADD' },
    { label: 'En attente', value: stats.pendingOrders.toString(), icon: Clock, color: '#7F77DD' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white font-black text-2xl">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.color + '15' }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <TrendingUp size={14} className="text-white/15" />
            </div>
            <p className="text-white font-black text-xl">{loading ? '—' : card.value}</p>
            <p className="text-white/40 text-xs font-semibold mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 className="text-white font-bold text-sm">Dernières commandes</h2>
          <a href="/admin/orders" className="text-brand-teal text-xs font-semibold hover:underline">Voir tout</a>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingCart size={32} className="text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm">Aucune commande pour le moment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">N° Commande</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Client</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Total</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Paiement</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Statut</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const sc = statusConfig[order.status] ?? statusConfig.pending;
                  return (
                    <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-brand-teal font-mono font-bold text-xs">{order.order_number}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-semibold">{order.customer_name}</p>
                        <p className="text-white/30 text-xs">{order.customer_phone}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-white/50 text-xs capitalize">
                          {order.payment_method === 'cash_on_delivery' ? 'À la livraison' : 'Wave'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{ background: sc.color + '15', color: sc.color }}
                        >
                          <sc.icon size={10} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/30 text-xs">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
