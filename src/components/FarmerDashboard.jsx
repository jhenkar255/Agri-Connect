import React from 'react';
import { 
  User, CloudSun, MapPin, Sparkles, TrendingUp, ShieldAlert, 
  PlusCircle, ShoppingBag, CheckCircle, FileText, ArrowRight, DollarSign, Calendar 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import { MANDI_PRICES } from '../data/mandiData';
import PageBanner from './PageBanner';

export default function FarmerDashboard({ 
  currentLang, 
  setActiveTab, 
  setIsWildlifeModalOpen 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const farmer = MOCK_USERS.farmer;

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={User}
        badgeText={`Verified Progressive Farmer • ${farmer.verificationStatus || 'Govt Verified'}`}
        badgeColor="green"
        title={`${t.welcomeBack || 'Welcome Back'}, ${farmer.name}!`}
        titleHighlight="(Farmer Cockpit)"
        description="Your smart farm management cockpit: Track live mandi rates for your crops, manage listed harvests, view direct buyer payments, and access 24/7 AI crop advisory."
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Farmer Dashboard' }
        ]}
        imageSrc="/assets/images/farmer_harvest.jpg"
        imageAlt={farmer.name}
        imageBadgeText={`FPO: ${farmer.fpoName || 'Shivamogga Organic'}`}
        floatingStat={{
          label: 'Total Farm Take-Home',
          value: farmer.stats?.totalEarned || '₹3,45,000',
          icon: TrendingUp
        }}
        stats={[
          { value: farmer.stats?.cropsListed || '4 Batches', label: 'Active Harvests', subtext: 'Ready for Pickup' },
          { value: farmer.stats?.ordersFulfilled || '18 Orders', label: 'Completed Sales', subtext: 'Direct to Buyers' },
          { value: '₹0 Commission', label: 'Middleman Saved', subtext: '100% Retained' },
          { value: 'PM-KISAN', label: 'DBT Linked', subtext: 'SBI Shivamogga' }
        ]}
        primaryAction={{
          label: 'Ask Kisan AI Advice',
          onClick: () => setActiveTab('advisory'),
          icon: Sparkles
        }}
        secondaryAction={{
          label: 'Report Wildlife Crop Loss',
          onClick: () => setIsWildlifeModalOpen(true),
          icon: ShieldAlert
        }}
      />

      <div className="section-pad">
        <div className="container">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={farmer.avatar} 
              alt={farmer.name} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-500)' }} 
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/farmer_harvest.jpg';
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.65rem', color: 'var(--dark-900)' }}>
                  {t.welcomeBack}, {farmer.name}!
                </h2>
                <span className="badge badge-green">
                  ✓ {farmer.verificationStatus}
                </span>
              </div>
              <small style={{ color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                Member since {farmer.registeredDate} • FPO: <strong>{farmer.fpoName}</strong>
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setActiveTab('advisory')}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              <span>{t.btnSend || 'Ask Kisan AI'}</span>
            </button>
            <button 
              onClick={() => setIsWildlifeModalOpen(true)}
              className="btn btn-emergency"
            >
              <ShieldAlert size={16} />
              <span>{t.btnReportWildlife || 'Report Wildlife Attack'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statFarmRevenue || 'Total Sales YTD'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              ₹{farmer.totalEarningsYTD.toLocaleString('en-IN')}
            </div>
            <small style={{ color: '#059669', fontWeight: 700 }}>+18.4% vs last year</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statSoilHealth || 'Landholding & Soil'}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--dark-900)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              {farmer.landAreaAcres} Acres
            </div>
            <small style={{ color: 'var(--slate-600)' }}>{farmer.soilType}</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statActiveListings || 'Active Produce Listings'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--amber-600)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              {farmer.activeListingsCount} Active
            </div>
            <small style={{ color: 'var(--slate-600)' }}>{farmer.ordersCompleted} orders delivered</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.statPendingBids || 'Buyer Rating Score'}
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              ★ {farmer.rating} / 5.0
            </div>
            <small style={{ color: '#059669', fontWeight: 700 }}>Top 5% Rated Grower</small>
          </div>

        </div>

        {/* 2 Column Main Body */}
        <div className="grid-2col-responsive">
          
          {/* Left Column: Farm Profile + Weather + Active Listings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Live Weather Forecast Widget */}
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#bae6fd', textTransform: 'uppercase', fontWeight: 700 }}>Real-Time Agrometeorology</div>
                  <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>Shivamogga Taluk Weather</h3>
                  <small style={{ color: '#e0f2fe' }}>Kudumallige Farm Station • Updated 10 mins ago</small>
                </div>
                <CloudSun size={48} color="#fde047" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>27°C</div>
                  <small style={{ fontSize: '0.72rem', color: '#bae6fd' }}>Scattered Showers</small>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>82%</div>
                  <small style={{ fontSize: '0.72rem', color: '#bae6fd' }}>High Humidity</small>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>12 km/h</div>
                  <small style={{ fontSize: '0.72rem', color: '#bae6fd' }}>SW Wind</small>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>4.2 mm</div>
                  <small style={{ fontSize: '0.72rem', color: '#bae6fd' }}>Expected Rain</small>
                </div>
              </div>

              <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                🌧️ <strong>Farming Advisory:</strong> Mild showers forecasted tonight. Delay foliar pesticide spraying until tomorrow afternoon.
              </div>
            </div>

            {/* Active Produce Listings Table */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Your Live Marketplace Harvest Listings</h3>
                <button onClick={() => setActiveTab('marketplace')} className="btn btn-sm btn-primary">
                  <PlusCircle size={14} />
                  <span>List More Produce</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>Farm Fresh Organic Tomatoes (Hybrid Vaishali)</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.76rem' }}>
                      Stock: <strong>2,400 Kg</strong> • Listed: 29 Sep 2026 • Jaivik Bharat Certified
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>₹24 / Kg</div>
                    <span className="badge badge-green" style={{ fontSize: '0.64rem' }}>Active Live</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>Malnad White Arecanut (Chali Bette)</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.76rem' }}>
                      Stock: <strong>1,800 Kg</strong> • Cured Sun-dried • Zero Aflatoxin
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-800)' }}>₹540 / Kg</div>
                    <span className="badge badge-green" style={{ fontSize: '0.64rem' }}>Active Live</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Farm Profile Specs */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Registered Farm & Crop Profile</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.84rem' }}>
                <div>• <strong>Survey & Village:</strong> Sy. No. 44/2, Kudumallige, Thirthahalli</div>
                <div>• <strong>Land Holding:</strong> 2.50 Acres (Owned Ancestral)</div>
                <div>• <strong>Soil Classification:</strong> Red Laterite Loam (pH 6.4)</div>
                <div>• <strong>Irrigation Setup:</strong> 16mm Drip + Borewell Recharge</div>
                <div>• <strong>Main Crops:</strong> Tomato (Rabi), Arecanut (Perennial)</div>
                <div>• <strong>KYC Status:</strong> Aadhaar & Pahani RTC Linked (Grama One)</div>
              </div>
            </div>

          </div>

          {/* Right Column: Recommended Schemes & Action Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Recommended Schemes for this Farmer */}
            <div className="glass-card" style={{ padding: '22px', border: '1.5px solid #a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={20} color="var(--primary-700)" />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>
                  Recommended Subsidies for Your Farm
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '8px', border: '1px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#065f46' }}>PMKSY Drip Irrigation Subsidy</div>
                    <span className="badge badge-green" style={{ fontSize: '0.62rem' }}>70% Eligible</span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#047857', margin: '4px 0' }}>
                    Expand drip to your second 1-acre block. Subsidy saves up to ₹32,000 on Jain Irrigation kit.
                  </p>
                  <button onClick={() => setActiveTab('schemes')} style={{ background: 'none', border: 'none', color: '#065f46', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                    View Scheme Details →
                  </button>
                </div>

                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e' }}>PM-KISAN 19th Installment</div>
                    <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>e-KYC Done</span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: '#78350f', margin: '4px 0' }}>
                    ₹2,000 direct bank transfer scheduled for 15 Oct. Bank Account ending in **891 seeded.
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Mandi Rates Alert for Farmer's Crops */}
            <div className="glass-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Mandi Watch: Your Crops</h3>
                <button onClick={() => setActiveTab('mandi')} style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  Full Board →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.86rem' }}>Tomato (Shivamogga APMC)</strong>
                    <small style={{ display: 'block', color: 'var(--slate-400)', fontSize: '0.72rem' }}>Local Nati Variety</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>₹1,650/qtl</div>
                    <small style={{ color: '#dc2626', fontSize: '0.68rem', fontWeight: 700 }}>▼ -2.1%</small>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.86rem' }}>Arecanut (CAMPCO Mandi)</strong>
                    <small style={{ display: 'block', color: 'var(--slate-400)', fontSize: '0.72rem' }}>Rashi / Chali Grade</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-800)' }}>₹54,200/qtl</div>
                    <small style={{ color: '#059669', fontSize: '0.68rem', fontWeight: 700 }}>▲ +4.2%</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Surplus Alert Callout */}
            <div 
              onClick={() => setActiveTab('surplus')}
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%)',
                border: '1px solid #f87171',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.92rem', marginBottom: '4px' }}>
                💡 Distress Price Protection
              </div>
              <p style={{ fontSize: '0.78rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                If tomato rates fall further, don't dump produce! Use our Surplus Puree Calculator to process into shelf-stable puree with local Women SHGs.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
    </>
  );
}
