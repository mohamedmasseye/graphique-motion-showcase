import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clock, CheckCircle, Package, Truck, XCircle, ChevronDown, X, Phone, MapPin, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/formatPrice';
import type { Order, OrderStatus, OrderItem } from '@/types/database';

const statusConfig: Record<OrderStatus, { icon: any; color: string; label: string }> = {
  pending:   { icon: Clock,       color: '#F5821F', label: 'En attente' },
  confirmed: { icon: CheckCircle, color: '#00B2AA', label: 'Confirmée' },
  preparing: { icon: Package,     color: '#378ADD', label: 'En préparation' },
  shipped:   { icon: Truck,       color: '#7F77DD', label: 'Expédiée' },
  delivered: { icon: CheckCircle, color: '#28C840', label: 'Livrée' },
  cancelled: { icon: XCircle,     color: '#FF5F57', label: 'Annulée' },
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const loadOrders = async () => {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data } = await query;
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filterStatus]);

  const openOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    setOrderItems((data ?? []) as OrderItem[]);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
    loadOrders();
  };

  const filtered = orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">Commandes</h1>
          <p className="text-white/40 text-sm mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            filterStatus === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Toutes
        </button>
        {Object.entries(statusConfig).map(([key, { icon: Icon, color, label }]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key as OrderStatus)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              filterStatus === key ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
            style={filterStatus === key ? { background: color + '20', color } : undefined}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <ShoppingCart size={32} className="text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm">Aucune commande</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">N°</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Client</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Total</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Paiement</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Statut</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = statusConfig[order.status];
                  return (
                    <tr
                      key={order.id}
                      onClick={() => openOrder(order)}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-brand-teal font-mono font-bold text-xs">{order.order_number}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-semibold">{order.customer_name}</p>
                        <p className="text-white/30 text-xs">{order.customer_phone}</p>
                      </td>
                      <td className="px-5 py-3.5 text-white font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-3.5 text-white/50 text-xs capitalize">
                        {order.payment_method === 'cash_on_delivery' ? 'Livraison' : 'Wave'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{ background: sc.color + '15', color: sc.color }}
                        >
                          <sc.icon size={10} /> {sc.label}
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
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0C0C12] border-l border-white/10 z-50 flex flex-col overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <div>
                  <span className="text-brand-teal font-mono font-bold">{selectedOrder.order_number}</span>
                  <p className="text-white/30 text-xs mt-0.5">
                    {new Date(selectedOrder.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Client info */}
                <div className="space-y-2">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Client</p>
                  <p className="text-white font-bold">{selectedOrder.customer_name}</p>
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Phone size={13} /> {selectedOrder.customer_phone}
                  </div>
                  {selectedOrder.customer_address && (
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <MapPin size={13} /> {selectedOrder.customer_address}, {selectedOrder.city}
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="flex items-start gap-2 text-white/30 text-xs">
                      <MessageSquare size={13} className="mt-0.5 shrink-0" /> {selectedOrder.notes}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Articles</p>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white/[0.04] rounded-xl px-4 py-3">
                        <div>
                          <p className="text-white text-sm font-semibold">{item.product_name}</p>
                          {item.variant_name && <p className="text-white/30 text-xs">{item.variant_name}</p>}
                          <p className="text-white/40 text-xs">× {item.quantity}</p>
                        </div>
                        <span className="text-white font-bold text-sm">{formatPrice(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white/[0.04] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Sous-total</span>
                    <span className="text-white/60">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Livraison</span>
                    <span className="text-white/60">{selectedOrder.shipping_fee === 0 ? 'Gratuite' : formatPrice(selectedOrder.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-white/[0.06]">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-brand-teal font-black">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-white/[0.04] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Méthode</span>
                    <span className="text-white/70">{selectedOrder.payment_method === 'wave' ? 'Wave' : 'À la livraison'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Statut paiement</span>
                    <span className={selectedOrder.payment_status === 'paid' ? 'text-brand-teal font-semibold' : 'text-white/60'}>
                      {selectedOrder.payment_status === 'paid' ? 'Payé ✓' : selectedOrder.payment_status === 'failed' ? 'Échoué' : 'En attente'}
                    </span>
                  </div>
                  {selectedOrder.wave_transaction_id && (
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-white/40">ID Transaction Wave</span>
                      <span className="text-white/80 font-mono text-xs bg-white/[0.06] px-2 py-1 rounded select-all">{selectedOrder.wave_transaction_id}</span>
                    </div>
                  )}
                </div>

                {/* Status update */}
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Mettre à jour le statut</p>
                  <div className="grid grid-cols-2 gap-2">
                    {statusFlow.map((s) => {
                      const sc = statusConfig[s];
                      const isActive = selectedOrder.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedOrder.id, s)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive ? 'ring-2' : 'hover:bg-white/[0.04]'
                          }`}
                          style={isActive ? { background: sc.color + '15', color: sc.color, ringColor: sc.color } : { color: sc.color + '80' }}
                        >
                          <sc.icon size={14} /> {sc.label}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => updateStatus(selectedOrder.id, 'cancelled')}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedOrder.status === 'cancelled'
                          ? 'bg-red-500/15 text-red-400 ring-2 ring-red-500'
                          : 'text-red-400/50 hover:bg-red-400/5'
                      }`}
                    >
                      <XCircle size={14} /> Annuler
                    </button>
                  </div>
                </div>

                {/* WhatsApp contact */}
                <a
                  href={`https://wa.me/${selectedOrder.customer_phone.replace(/\s/g, '').replace(/^\+/, '')}?text=${encodeURIComponent(`Bonjour ${selectedOrder.customer_name} ! Concernant votre commande ${selectedOrder.order_number} chez Graphique & Motion...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-[#25D366]/15 text-[#25D366] font-bold py-3 rounded-xl text-sm hover:bg-[#25D366]/20 transition-colors"
                >
                  Contacter sur WhatsApp
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
