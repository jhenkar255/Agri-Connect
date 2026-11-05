import React from 'react';
import { 
  Building2, ShoppingBag, Truck, Download, Star, MapPin, 
  CheckCircle, Clock, ArrowRight, ShieldCheck, PhoneCall 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function BuyerDashboard({ setActiveTab, setIsCartOpen, currentLang = 'en' }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const buyer = MOCK_USERS.buyer;

  const mockOrders = [
    {
      id: 'AGRI-ORD-2026-8812',
      farmer: 'Ravi Kumar',
      farmerPhone: '+91 98451 22891',
      crop: 'Organic Tomatoes (Hybrid Vaishali)',
      qty: '500 Kg',
      totalAmount: 12000,
      orderDate: '28 Sep 2026',
      status: 'In Transit (Cold-Chain Reefer Truck)',
      deliveryETA: 'Tomorrow 08:00 AM',
      trackingNo: 'TRK-KA-5591'
    },
    {
      id: 'AGRI-ORD-2026-7490',
      farmer: 'Ganesh Sawant',
      farmerPhone: '+91 94220 89112',
      crop: 'GI-Tagged Ratnagiri Alphonso Mangoes',
      qty: '20 Dozen',
      totalAmount: 13000,
      orderDate: '24 Sep 2026',
      status: 'Delivered & Inspected',
      deliveryETA: 'Delivered on 26 Sep',
      trackingNo: 'TRK-MH-9921'
    }
  ];

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Building2}
        badgeText="Verified Wholesale & Retail Buyer Cockpit • Direct Farm Procurement"
        badgeColor="blue"
        title={buyer.company || "Wholesale Procurement"}
        titleHighlight="(Buyer Dashboard)"
        description="Procure directly from verified FPOs and farmers with zero middleman markups, real-time cold-chain truck tracking, and escrow-backed payments."
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Buyer Dashboard' }
        ]}
        imageSrc={buyer.avatar}
        imageAlt={buyer.name}
        imageBadgeText="GSTIN Verified Enterprise"
        floatingStat={{
          label: 'Sourcing Cost Saved',
          value: '-22%',
          icon: ShoppingBag
        }}
        stats={[
          { value: '₹4,80,000', label: 'Procured Volume', subtext: 'This Quarter' },
          { value: '42 Batches', label: 'Completed Deliveries', subtext: 'Cold-Chain Reefer' },
          { value: '98.8%', label: 'Quality Match', subtext: 'A+ Graded Produce' },
          { value: '₹0 Cut', label: 'Brokerage Paid', subtext: 'Direct Farm Escrow' }
        ]}
        primaryAction={{
          label: 'Browse Farm Produce',
          onClick: () => setActiveTab('marketplace'),
          icon: ShoppingBag
        }}
        secondaryAction={{
          label: 'Open Active Cart',
          onClick: () => setIsCartOpen(true),
          icon: Truck
        }}
      />

      <div className="section-pad">
        <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={buyer.avatar} 
              alt={buyer.name} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--info-500)' }} 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/farmer_harvest.jpg';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.65rem', color: 'var(--dark-900)' }}>
                  {buyer.company}
                </h2>
                <span className="badge badge-blue">
                  ✓ {buyer.verificationStatus}
                </span>
              </div>
              <small style={{ color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                Procurement Lead: <strong>{buyer.name}</strong> • GSTIN: {buyer.gstin}
              </small>
            </div>
          </div>

          <button onClick={() => setActiveTab('marketplace')} className="btn btn-primary">
            <ShoppingBag size={16} />
            <span>{t.heroCtaBuyer || 'Browse More Farm Harvests'}</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statTotalPurchased || 'Procurement Volume YTD'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--info-600)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              ₹{buyer.totalPurchasesYTD.toLocaleString('en-IN')}
            </div>
            <small style={{ color: '#059669', fontWeight: 700 }}>100% Direct Farmer Sourced</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statPendingDeliveries || 'Active Shipments'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              {mockOrders.filter(o => o.status.includes('Transit')).length} In Transit
            </div>
            <small style={{ color: 'var(--slate-600)' }}>Cold-chain temperature logged</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statVerifiedSuppliers || 'Saved Farm Suppliers'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--amber-600)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              {buyer.savedFarmersCount} Verified FPOs
            </div>
            <small style={{ color: 'var(--slate-600)' }}>Direct procurement contracts</small>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>{t.dashBuyerTitle || 'Recent Direct Farm Orders & Tracking'}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>Real-time GPS dispatch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mockOrders.map((order) => (
              <div key={order.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark-900)' }}>{order.crop}</span>
                      <span className="badge badge-green" style={{ fontSize: '0.64rem' }}>{order.qty}</span>
                    </div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.78rem' }}>
                      Farmer: <strong>{order.farmer}</strong> • Order ID: {order.id} • Placed: {order.orderDate}
                    </small>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-heading)' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed var(--slate-200)', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Truck size={14} color="var(--primary-700)" />
                    <span>Tracking: <strong>{order.trackingNo}</strong> • ETA: {order.deliveryETA}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href={`tel:${order.farmerPhone}`} style={{ color: 'var(--primary-700)', fontWeight: 600 }}>Call Farmer</a>
                    <span>•</span>
                    <button onClick={() => window.print()} style={{ background: 'none', border: 'none', color: 'var(--slate-600)', cursor: 'pointer', textDecoration: 'underline' }}>
                      Download Invoice PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </>
  );
}
