import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SiteLayout from '@/components/SiteLayout';

/* ── Lazy-loaded page imports ──────────────────────────────────── */
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const About = lazy(() => import('./pages/About'));
const Founder = lazy(() => import('./pages/Founder'));
const Process = lazy(() => import('./pages/Process'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Boutique (preserve existing)
const Boutique = lazy(() => import('./pages/Boutique'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentReturn = lazy(() => import('./pages/PaymentReturn'));

// Admin (preserve existing)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const queryClient = new QueryClient();

/* ── Loading fallback ──────────────────────────────────────────── */
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AdminLoader() {
  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ── Auth guard for admin routes ───────────────────────────────── */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AdminLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ═══ Public site with shared layout ═══ */}
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Projects />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/realisations" element={<Navigate to="/portfolio" replace />} />
              <Route path="/realisations/:slug" element={<Navigate to="/portfolio" replace />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/a-propos/mohamed-diop" element={<Founder />} />
              <Route path="/processus" element={<Process />} />
              <Route path="/tarifs" element={<PricingPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* ═══ Boutique (standalone layout) ═══ */}
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/paiement" element={<PaymentReturn />} />

            {/* ═══ Admin ═══ */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
