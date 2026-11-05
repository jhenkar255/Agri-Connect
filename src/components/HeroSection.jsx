import React, { useState } from 'react';
import { 
  Search, Play, ArrowRight, TrendingUp, TrendingDown, 
  Sparkles, CheckCircle2, ShieldCheck, Tractor, CloudSun, Leaf, 
  ShoppingBag, Star, Heart, Award, ArrowUpRight 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/languages';
import { MANDI_PRICES } from '../data/mandiData';

export default function HeroSection({ 
  currentLang, 
  setActiveTab, 
  setIsAuthOpen, 
  setIsVideoTourOpen,
  setIsFarmerFundModalOpen,
  onSearchSubmit
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHeroPhoto, setActiveHeroPhoto] = useState('farmer'); // 'farmer' | 'woman'
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Selected top 4 ticker items
  const tickerItems = MANDI_PRICES.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) onSearchSubmit(searchQuery);
    }
  };

  return (
    <>
      {/* =========================================================================
          HERO BANNER SECTION
          ========================================================================= */}
      <div className="hero-wrapper">
        <div className="hero-pattern-overlay" />
        
        <div className="container hero-grid">
          {/* Left Column: Headline, Value Props, Search & CTAs */}
          <div>
            <button 
              type="button"
              onClick={() => setActiveTab('mandi')}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(16, 185, 129, 0.22)', 
                border: '1px solid rgba(52, 211, 153, 0.45)', 
                padding: '6px 14px', 
                borderRadius: 'var(--radius-full)', 
                marginBottom: '18px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              title="Click to view Live APMC Mandi Rates"
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', boxShadow: '0 0 10px #34d399', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a7f3d0', letterSpacing: '0.02em' }}>
                {t.badgeLiveMandi} • 30 Sep 2026
              </span>
            </button>

            <h1 className="hero-headline">
              {t.heroTitle}
            </h1>

            <p className="hero-subtext">
              {t.heroSub}
            </p>

            {/* Quick Universal Search Bar */}
            <form onSubmit={handleSearch} style={{ maxWidth: '580px', marginBottom: '26px', position: 'relative' }}>
              <div style={{
                display: 'flex',
                background: '#ffffff',
                borderRadius: 'var(--radius-full)',
                padding: '6px 8px 6px 20px',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}>
                <Search size={20} color="var(--primary-700)" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.94rem',
                    flex: 1,
                    color: 'var(--dark-900)'
                  }}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
                >
                  {currentLang === 'hi' ? 'खोजें' : currentLang === 'kn' ? 'ಹುಡುಕಿ' : currentLang === 'te' ? 'వెతకండి' : currentLang === 'ta' ? 'தேடுக' : currentLang === 'ml' ? 'തിരയുക' : 'Search'}
                </button>
              </div>
              
              {/* Quick tags */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', fontSize: '0.78rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                <span style={{ opacity: 0.8 }}>Popular Searches:</span>
                <button type="button" onClick={() => { setSearchQuery('Tomato'); setActiveTab('mandi'); }} style={{ background: 'none', border: 'none', color: '#fde68a', cursor: 'pointer', textDecoration: 'underline' }}>Tomato Rates</button>
                <button type="button" onClick={() => { setActiveTab('advisory'); }} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', textDecoration: 'underline' }}>AI Leaf Diagnosis</button>
                <button type="button" onClick={() => { setActiveTab('schemes'); }} style={{ background: 'none', border: 'none', color: '#fde68a', cursor: 'pointer', textDecoration: 'underline' }}>PM-KISAN ₹6,000</button>
                <button type="button" onClick={() => { setActiveTab('surplus'); }} style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', textDecoration: 'underline' }}>Surplus Puree</button>
              </div>
            </form>

            {/* Action CTAs */}
            <div className="hero-cta-group">
              <button 
                onClick={() => setActiveTab('register')}
                className="btn btn-lg btn-amber"
                style={{ fontWeight: 700 }}
              >
                {t.heroCtaRegister}
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => setActiveTab('marketplace')}
                className="btn btn-lg btn-outline-white"
              >
                <Leaf size={18} />
                {t.heroCtaBuyer}
              </button>

              <button 
                onClick={() => setIsVideoTourOpen(true)}
                className="btn btn-lg btn-outline-white"
                style={{ background: 'rgba(0,0,0,0.35)' }}
              >
                <Play size={16} fill="#ffffff" />
                {t.heroWatchTour}
              </button>
            </div>

            {/* Offline-First & Future Architecture Direct Quick-Link */}
            <div style={{ marginTop: '14px', marginBottom: '8px' }}>
              <button
                onClick={() => setActiveTab('roadmap')}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(253, 230, 138, 0.5)',
                  color: '#fef08a',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🚀 Offline-First Architecture & Future Implementation Roadmap</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* 4 Stats Counters */}
            <div className="hero-stats-strip">
              <div className="hero-stat-item">
                <h4>12,500+</h4>
                <p>{t.statFarmers}</p>
              </div>
              <div className="hero-stat-item">
                <h4>450+</h4>
                <p>{t.statMandis}</p>
              </div>
              <div className="hero-stat-item">
                <h4>₹28.4 Cr</h4>
                <p>{t.statVolume}</p>
              </div>
              <div className="hero-stat-item">
                <h4>₹14.2 Cr</h4>
                <p>{t.statSchemes}</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Farmer Holding Crops Photo Card */}
          <div>
            <div className="glass-card" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255, 255, 255, 0.2)', padding: '18px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              
              {/* Photo Switcher Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setActiveHeroPhoto('farmer')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: activeHeroPhoto === 'farmer' ? '#34d399' : 'rgba(255,255,255,0.2)',
                      background: activeHeroPhoto === 'farmer' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                      color: activeHeroPhoto === 'farmer' ? '#a7f3d0' : '#cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🌾 {t.farmerRaviTab || 'Farmer Ravi (Tomatoes & Wheat)'}
                  </button>

                  <button
                    onClick={() => setActiveHeroPhoto('woman')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid',
                      borderColor: activeHeroPhoto === 'woman' ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                      background: activeHeroPhoto === 'woman' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                      color: activeHeroPhoto === 'woman' ? '#fde68a' : '#cbd5e1',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🥭 {t.farmerKamalaTab || 'Farmer Kamala (Mangoes & Greens)'}
                  </button>
                </div>

                <span className="badge badge-green" style={{ fontSize: '0.64rem' }}>
                  {t.direct100 || '100% Direct'}
                </span>
              </div>

              {/* Main Photo Display with Floating Badges */}
              <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', height: '340px', boxShadow: 'var(--shadow-lg)' }}>
                <img 
                  src={activeHeroPhoto === 'farmer' ? '/assets/images/farmer_harvest.jpg' : '/assets/images/farmer_woman_harvest.jpg'}
                  alt="Farmer proudly holding freshly harvested crops in their hands"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.4s ease' }}
                />

                {/* Dark Gradient Overlay at bottom */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

                {/* Top Floating Badge */}
                <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(6, 78, 59, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(52, 211, 153, 0.5)', padding: '6px 12px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={14} color="#34d399" />
                  <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 700 }}>{t.proudIndianGrower || 'Proud Indian Grower'}</span>
                </div>

                {/* Bottom Crop & Farmer Details Badge */}
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800, marginBottom: '2px' }}>
                        {activeHeroPhoto === 'farmer' ? (t.raviTitle || 'Ravi Kumar • Shivamogga, KA') : (t.kamalaTitle || 'Kamala Devi • Ratnagiri, MH')}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                        {activeHeroPhoto === 'farmer' ? (t.raviHolding || 'Holding freshly picked vine tomatoes, green chillies & golden wheat') : (t.kamalaHolding || 'Holding tree-ripened Alphonso mangoes & fresh bell peppers')}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('marketplace')}
                      className="btn btn-sm btn-amber"
                      style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: 'var(--radius-full)' }}
                    >
                      <ShoppingBag size={13} />
                      <span>{t.btnBuyDirect || 'Buy Direct'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick APMC Ticker Strip under photo */}
              <div style={{ marginTop: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} color="#34d399" />
                  <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                    Tomato: ₹1,950/qtl <span style={{ color: '#34d399' }}>(+5.4%)</span>
                  </span>
                </div>

                <button 
                  onClick={() => setActiveTab('mandi')}
                  style={{ background: 'none', border: 'none', color: '#a7f3d0', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <span>{t.allMandis || 'All Mandis'}</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REAL FARMERS, REAL HARVESTS: SPOTLIGHT STRIP
          ========================================================================= */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid var(--slate-200)', padding: '48px 0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--amber-100)', color: 'var(--earth-800)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
              <Heart size={14} color="var(--amber-600)" />
              <span>{t.spotlightTag || 'Real Farmers • Authentic Hand-Picked Harvests'}</span>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--dark-900)' }}>
              {t.spotlightTitle || 'From Their Hands Directly to Your Table'}
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.96rem' }}>
              {t.spotlightSub || 'No brokers. No cold-storage manipulation. 100% of your payment reaches these dedicated growers within 24 hours.'}
            </p>
          </div>

          {/* 2 Big Featured Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            
            {/* Farmer 1 Card */}
            <div className="glass-card glass-card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '260px' }}>
                <img 
                  src="/assets/images/farmer_harvest.jpg" 
                  alt="Farmer Ravi Kumar holding fresh tomatoes and wheat" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-green">{t.organicVerified || 'Organic Verified'}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '6px', color: '#fde68a', fontWeight: 800, fontSize: '0.94rem' }}>
                  ₹24 / Kg
                </div>
              </div>

              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-900)' }}>{t.raviTitle || 'Ravi Kumar'}</h3>
                  <small style={{ color: 'var(--slate-600)', fontWeight: 600 }}>Shivamogga, Karnataka</small>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
                  "{t.raviQuote || 'I cultivate 2.5 acres using drip irrigation and neem pest repellent. When you buy through Agri-Connect, my family receives the complete fair market price with zero APMC deductions.'}"
                </p>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🍅 {t.raviStock || 'Available: 2,400 Kg Tomatoes'}</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{t.harvestedToday || 'Harvested: Today'}</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <ShoppingBag size={15} />
                    <span>{t.btnBuyRavi || "Purchase Ravi's Harvest"}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('advisory')}
                    className="btn btn-outline"
                    title="See how Ravi uses Kisan AI"
                  >
                    <span>{t.aiStory || 'AI Story'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Farmer 2 Card */}
            <div className="glass-card glass-card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '260px' }}>
                <img 
                  src="/assets/images/farmer_woman_harvest.jpg" 
                  alt="Farmer Kamala Devi holding Alphonso mangoes and bell peppers" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-amber">{t.giTag || 'GI Tag No. 139'}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '6px', color: '#fde68a', fontWeight: 800, fontSize: '0.94rem' }}>
                  ₹650 / Dozen
                </div>
              </div>

              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-900)' }}>{t.kamalaTitle || 'Kamala Devi'}</h3>
                  <small style={{ color: 'var(--slate-600)', fontWeight: 600 }}>Ratnagiri, Maharashtra</small>
                </div>

                <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '14px' }}>
                  "{t.kamalaQuote || 'Our coastal orchard produces authentic tree-ripened Alphonso mangoes and natural bell peppers. We use traditional hay curing and zero carbide ripening chemicals.'}"
                </p>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🥭 {t.kamalaStock || 'Available: 1,500 Dozen Mangoes'}</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{t.exportGrade || 'Export Grade (250g+)'}</span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <ShoppingBag size={15} />
                    <span>{t.btnBuyKamala || "Purchase Kamala's Mangoes"}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('surplus')}
                    className="btn btn-outline"
                    title="Learn about Kamala's SHG processing unit"
                  >
                    <span>{t.shgPulpUnit || 'SHG Pulp Unit'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
