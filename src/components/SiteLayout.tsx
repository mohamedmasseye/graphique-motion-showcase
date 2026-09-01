import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function SiteLayout() {
  return (
    <>
      {/* Grain noise texture */}
      <div className="grain-overlay" aria-hidden="true" />

      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}
