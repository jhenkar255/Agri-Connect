import React from 'react';
import { 
  Sprout, PhoneCall, ShieldCheck, ExternalLink, Globe, 
  Smartphone, WifiOff, HeartHandshake, CheckCircle2 
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';

export default function Footer({ 
  currentLang, 
  setCurrentLang, 
  setActiveTab,
  setIsWildlifeModalOpen,
  setIsFarmerFundModalOpen 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <footer style={{ background: '#090d16', color: '#94a3b8', borderTop: '1px solid #1e293b', paddingTop: '60px', paddingBottom: '30px' }}>
      <div className="container">
        
        {/* Main 4-Column Footer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '36px', marginBottom: '48px' }}>
          
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={22} color="#fff" />
              </div>
              <span>Agri-Connect</span>
            </div>

            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '18px' }}>
              India's first unified digital agriculture ecosystem. Empowering farmers through AI diagnostics, direct-to-buyer trade, distress food preservation, crop residue monetization, and verified government subsidies.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                <PhoneCall size={14} />
                <span>Kisan Helpline: <strong>1800-180-1551</strong> (Toll-Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171' }}>
                <ShieldCheck size={14} />
                <span>Wildlife Damage: <strong>1926</strong> (Forest Control)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '16px' }}>Key Ecosystem Modules</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
              <li><button onClick={() => setActiveTab('login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Farmer Sign In & Registration</button></li>
              <li><button onClick={() => setActiveTab('advisory')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Kisan AI Crop Doctor & Vision</button></li>
              <li><button onClick={() => setActiveTab('mandi')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• APMC Mandi Daily Rates & Ticker</button></li>
              <li><button onClick={() => setActiveTab('marketplace')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Direct Farm Produce Marketplace</button></li>
              <li><button onClick={() => setActiveTab('schemes')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Government Schemes & Subsidies</button></li>
              <li><button onClick={() => setActiveTab('surplus')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Surplus Rescue & Value Addition</button></li>
              <li><button onClick={() => setActiveTab('waste')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Crop Residue & Biomass Market</button></li>
              <li><button onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Irrigation & Rural Infra Projects</button></li>
              <li><button onClick={() => setActiveTab('community')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left' }}>• Farmer Community & Workshops</button></li>
            </ul>
          </div>

          {/* Column 3: Official Portals Linkout */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '16px' }}>Official National Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <li>
                <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <span>e-NAM (National Agriculture Market)</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <span>Agmarknet Price Gateway</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <span>PMFBY Crop Insurance</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://icar.org.in" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <span>ICAR - Agricultural Research</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>

            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setIsFarmerFundModalOpen(true)}
                className="btn btn-sm btn-amber"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <HeartHandshake size={14} />
                <span>Small Farmer Support Fund</span>
              </button>
            </div>
          </div>

          {/* Column 4: Offline-First Roadmap & Languages */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '16px' }}>Future Offline PWA Roadmap</h4>
            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '10px', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fde68a', fontWeight: 700, marginBottom: '4px' }}>
                <WifiOff size={14} />
                <span>Offline Rural Mode (In Development)</span>
              </div>
              <p style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                Phase 2 PWA caching will enable full access to crop disease guides, mandi records, and scheme forms without active 4G/5G mobile connectivity.
              </p>
              <button
                onClick={() => {
                  setActiveTab('roadmap');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn btn-sm btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.76rem' }}
              >
                <span>🚀 View 4-Phase Roadmap & Plan</span>
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Switch Interface Language:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                    style={{
                      background: currentLang === lang.code ? '#10b981' : '#1e293b',
                      color: currentLang === lang.code ? '#fff' : '#cbd5e1',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip: Copyright & Disclaimers */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.76rem', color: '#64748b' }}>
          <div>
            © 2026 Agri-Connect Platform. Developed for Indian Agriculture & Farmer Welfare.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>APMC Legal Disclaimers</span>
            <span>•</span>
            <span>Agricultural Safety Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
