import React, { useState } from 'react';
import { 
  Wifi, WifiOff, Smartphone, Globe, CloudSun, Database, 
  Cpu, Radio, Layers, CheckCircle2, Clock, Sparkles, 
  ArrowRight, ShieldCheck, Download, Bot, Volume2, PhoneCall, 
  MapPin, Send, Zap, ChevronRight, AlertTriangle, FileText, Check
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function FutureRoadmap({ currentLang = 'en', setActiveTab }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  const [activePhaseFilter, setActivePhaseFilter] = useState('all'); // 'all' | 'phase1' | 'phase2' | 'phase3' | 'phase4'
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineFormText, setOfflineFormText] = useState('Organic Vaishali Tomatoes (40 Quintals)');
  const [offlineFormQueue, setOfflineFormQueue] = useState([]);
  const [smsQuery, setSmsQuery] = useState('RATES TOMATO SHIVAMOGGA');
  const [smsResponse, setSmsResponse] = useState('');

  const futureLanguages = [
    { name: 'Marathi', native: 'मराठी', region: 'Maharashtra (Vidarbha, Marathwada)', priority: 'High', status: 'Q3 2026' },
    { name: 'Gujarati', native: 'ગુજરાતી', region: 'Gujarat (Saurashtra, Anand)', priority: 'High', status: 'Q3 2026' },
    { name: 'Bengali', native: 'বাংলা', region: 'West Bengal & Sundarbans', priority: 'High', status: 'Q4 2026' },
    { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', region: 'Punjab & Haryana Basin', priority: 'Medium', status: 'Q4 2026' },
    { name: 'Odia', native: 'ଓଡ଼ಿଆ', region: 'Odisha Coastal & Tribal Belts', priority: 'Medium', status: 'Q1 2027' },
    { name: 'Assamese', native: 'অসমীয়া', region: 'Assam & Brahmaputra Valley', priority: 'Medium', status: 'Q1 2027' },
    { name: 'Urdu', native: 'اردو', region: 'Northern & Central Agro Belts', priority: 'Medium', status: 'Q1 2027' },
    { name: 'Konkani', native: 'कोंकणी', region: 'Coastal Goa, Karwar, Mangaluru', priority: 'Special', status: 'Q2 2027' },
    { name: 'Tulu', native: 'ತುಳು', region: 'Dakshina Kannada & Udupi', priority: 'Special', status: 'Q2 2027' },
    { name: 'Regional Dialects', native: 'ಸ್ಥಳೀಯ ಉಪಭಾಷೆಗಳು', region: 'Malnad, Rayalaseema, Bhojpuri, Maithili', priority: 'Adaptive', status: 'Research' }
  ];

  const handleQueueOfflineProduce = (e) => {
    e.preventDefault();
    if (!offlineFormText.trim()) return;
    const newItem = {
      id: Date.now(),
      text: offlineFormText,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Stored in IndexedDB (Pending Sync)'
    };
    setOfflineFormQueue([newItem, ...offlineFormQueue]);
    setOfflineFormText('');
  };

  const handleSimulateSms = (e) => {
    e.preventDefault();
    setSmsResponse('Searching APMC gateway via SMS-USSD bridge...');
    setTimeout(() => {
      setSmsResponse(`✓ KISAN-SMS (Free): Shivamogga APMC Tomato Modal ₹1,650/qtl (+₹75). Best nearby: Hubballi ₹1,820/qtl. Dial *99*51# for voice advisory.`);
    }, 600);
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Smartphone}
        badgeText="Offline-First Progressive Web Architecture & 16+ Language Roadmap"
        badgeColor="green"
        title="Zero-Internet Rural Architecture"
        titleHighlight="& Future Roadmap (2026–2028)"
        description="Enabling farmers to record harvests, access offline crop doctor manuals, and sync transactions even in zero-signal deep farmlands through IndexedDB, SMS fallback, and Edge-AI."
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Offline Architecture Roadmap' }
        ]}
        imageSrc="/assets/images/farmer_harvest.jpg"
        imageAlt="Indian farmer in rural farmland using mobile app"
        imageBadgeText="Zero Connectivity Sync"
        floatingStat={{
          label: 'Offline Data Footprint',
          value: '< 25 MB',
          icon: Database
        }}
        stats={[
          { value: '4-Phase Plan', label: 'Implementation Steps', subtext: 'PWA to Native Mesh' },
          { value: '16+ Languages', label: 'Pan-India Dialects', subtext: 'Konkani, Tulu & More' },
          { value: 'SMS / USSD', label: 'Feature Phone Mode', subtext: 'Zero Internet Needed' },
          { value: 'IndexedDB', label: 'Sync Queue', subtext: 'Automatic Reconnect' }
        ]}
        primaryAction={{
          label: isSimulatedOffline ? 'Switch to Online Mode' : 'Simulate Offline Mode',
          onClick: () => setIsSimulatedOffline(!isSimulatedOffline),
          icon: isSimulatedOffline ? Wifi : WifiOff
        }}
        secondaryAction={{
          label: 'Test SMS Fallback Tool',
          onClick: () => {
            const el = document.querySelector('.sms-simulator-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
          icon: Radio
        }}
        quickChips={[
          { id: 'all', label: 'All 4 Phases' },
          { id: 'phase1', label: 'Phase 1: Web Prototype' },
          { id: 'phase2', label: 'Phase 2: Hybrid Offline' },
          { id: 'phase3', label: 'Phase 3: Native App' },
          { id: 'phase4', label: 'Phase 4: Edge AI' }
        ]}
        activeChip={activePhaseFilter}
        onChipClick={(p) => setActivePhaseFilter(p)}
      />

      <div className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">

          {/* Quick Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
            <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              ✓ Phase 1 Active & Live
            </span>
            <span className="badge badge-blue" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              ⚙️ Phase 2 PWA In-Development
            </span>
            <span className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              📱 Phase 3 Native Mobile Planned
            </span>
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569', padding: '6px 12px', fontSize: '0.78rem' }}>
              📡 Phase 4 Satellite & IoT Vision
            </span>
          </div>

        {/* Phase Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'All 4 Phases' },
            { id: 'phase1', label: 'Phase 1: Web Prototype (Live)' },
            { id: 'phase2', label: 'Phase 2: Progressive Web App' },
            { id: 'phase3', label: 'Phase 3: Android & iOS Mobile' },
            { id: 'phase4', label: 'Phase 4: Advanced Rural Access' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePhaseFilter(tab.id)}
              className="btn btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                background: activePhaseFilter === tab.id ? 'var(--primary-700)' : '#ffffff',
                color: activePhaseFilter === tab.id ? '#ffffff' : 'var(--dark-800)',
                border: '1px solid',
                borderColor: activePhaseFilter === tab.id ? 'var(--primary-700)' : 'var(--slate-300)',
                fontWeight: 700,
                boxShadow: activePhaseFilter === tab.id ? 'var(--shadow-sm)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4 PHASES DETAILED TIMELINE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          
          {/* Phase 1 Card */}
          {(activePhaseFilter === 'all' || activePhaseFilter === 'phase1') && (
            <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>PHASE 1 • LIVE NOW</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 700 }}>Q1–Q2 2026</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--dark-900)', marginBottom: '8px' }}>
                Web Prototype & Core Ecosystem
              </h3>
              
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '16px' }}>
                The current operational production-ready foundation enabling direct farmer-to-buyer transactions, multimodal advisory, and mandi intelligence.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Responsive Web Application:</strong> Mobile-first UI optimized for 4.7" to 6.7" smartphone screens.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Core Role Dashboards:</strong> Dedicated experiences for Farmers, Wholesale Buyers, and SuperAdmins.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Produce & Residue Marketplace:</strong> Direct listings for crops, crop residue/stubble, and drone rentals.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Kisan AI Integration:</strong> Multilingual crop doctor with speech synthesis and leaf symptom analysis.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>6 Major Languages:</strong> Full coverage for English, Hindi, Kannada, Telugu, Tamil, and Malayalam.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Cloud Deployment:</strong> Automated CI/CD edge hosting with MongoDB document persistence schema.</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46', fontWeight: 600 }}>
                Status: 100% Operational in this live deployment.
              </div>
            </div>
          )}

          {/* Phase 2 Card */}
          {(activePhaseFilter === 'all' || activePhaseFilter === 'phase2') && (
            <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #0284c7', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>PHASE 2 • IN DEVELOPMENT</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 700 }}>Q3–Q4 2026</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--dark-900)', marginBottom: '8px' }}>
                Progressive Web App (PWA) Offline-First
              </h3>
              
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '16px' }}>
                Eliminates Play Store friction. Farmers can install directly from Chrome/Edge with zero store storage footprint and work in zero-connectivity fields.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Installable Web App:</strong> Add-to-homescreen manifest with native app shell feel.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Cached Offline Crop Leaf Guides:</strong> Visual pest & fungus diagnosis stored in Service Worker Cache API.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Saved 30-Day Mandi Trends:</strong> Historical APMC modal rates readable without internet connection.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Saved Scheme PDF Checklists:</strong> 70% drip subsidy and PM-KISAN documents available offline.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Offline Form Queuing:</strong> Enter harvest listing while in remote field; queued via IndexedDB.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Background Auto-Sync:</strong> Automatically flushes pending orders and listings the moment 4G reconnects.</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: '#f0f9ff', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#0369a1', fontWeight: 600 }}>
                Target: ServiceWorker caching & IndexedDB queuing integration.
              </div>
            </div>
          )}

          {/* Phase 3 Card */}
          {(activePhaseFilter === 'all' || activePhaseFilter === 'phase3') && (
            <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #f59e0b', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>PHASE 3 • NATIVE APPS</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 700 }}>2027</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--dark-900)', marginBottom: '8px' }}>
                Android & iOS Mobile Application
              </h3>
              
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '16px' }}>
                Deep hardware integration using Flutter / React Native with embedded local databases and cellular SMS/USSD fallback for 2G zones.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Flutter / React Native Cross-Platform:</strong> Single code base maintaining 60 FPS performance on ₹6,000 Android phones.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Downloadable Offline Language Packs:</strong> Audio pronunciation packs stored locally on SD card.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Local SQLite / Realm Storage:</strong> Encrypted on-device database storing 10,000+ mandi records and farmer ledgers.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Battery-Conscious Sync:</strong> Intelligent background sync scheduled during overnight charging or Wi-Fi windows.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Layers size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>SMS & USSD Fallback Gateway:</strong> When cellular data is zero, critical mandi alerts route via encoded 160-char SMS.</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: '#fffbeb', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#92400e', fontWeight: 600 }}>
                Target: SQLite schema & SMS gateway integration.
              </div>
            </div>
          )}

          {/* Phase 4 Card */}
          {(activePhaseFilter === 'all' || activePhaseFilter === 'phase4') && (
            <div className="glass-card" style={{ padding: '28px', borderTop: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '0.72rem' }}>PHASE 4 • ADVANCED RURAL</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 700 }}>2027–2028</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--dark-900)', marginBottom: '8px' }}>
                Advanced Rural Access & Deep Agri-Tech
              </h3>
              
              <p style={{ fontSize: '0.86rem', color: 'var(--slate-600)', lineHeight: 1.5, marginBottom: '16px' }}>
                Breaking all digital divide barriers: empowering non-smartphone users, village kiosks, FPOs, and smart IoT sensors.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>On-Device TFLite Leaf Diagnostics:</strong> Quantized mobile neural network running crop disease diagnosis 100% offline.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Local-Language Voice Assistant:</strong> Native dialogue understanding colloquial rural farmer phrasing.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>IVR Toll-Free Phone Helpline:</strong> Interactive Voice Response call service (1800-180-1551) for basic button feature phones.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Grama Panchayat Digital Kiosks:</strong> Touchscreen community kiosks in village secretariats with thermal bill printing.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>FPO & Cooperative Macro-Dashboard:</strong> Bulk procurement aggregation across 500+ smallholders.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Radio size={16} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Satellite & Drone Services:</strong> ISRO Bhuvan NDVI canopy health radar & autonomous spray drone booking.</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', background: '#faf5ff', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#6b21a8', fontWeight: 600 }}>
                Target: Edge AI quantization, Grama Kiosks & Drone Booking.
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            INTERACTIVE OFFLINE-FIRST SIMULATOR TOOL
            ========================================================================= */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '56px', border: isSimulatedOffline ? '2px solid #ef4444' : '2px solid #10b981', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isSimulatedOffline ? '#fee2e2' : '#dcfce7', color: isSimulatedOffline ? '#991b1b' : '#166534', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                {isSimulatedOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
                <span>{isSimulatedOffline ? 'SIMULATED: Rural Low-Bandwidth Mode (0 KB/s)' : 'SIMULATED: Urban High-Speed Mode (4G/5G Online)'}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--dark-900)' }}>
                Test Live Offline-First Resiliency
              </h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem' }}>
                Toggle offline mode below to test how Agri-Connect preserves critical functionality without active cellular signal.
              </p>
            </div>

            <button
              onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
              className={`btn ${isSimulatedOffline ? 'btn-primary' : 'btn-emergency'}`}
              style={{ padding: '10px 18px', fontWeight: 700 }}
            >
              {isSimulatedOffline ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>{isSimulatedOffline ? 'Reconnect Network (Go Online)' : 'Simulate Dropping Cellular Signal'}</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Simulation Block 1: Offline Form Queuing */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Database size={18} color="var(--primary-700)" />
                <h4 style={{ fontSize: '1rem', color: 'var(--dark-900)' }}>
                  1. Offline Form Queuing (IndexedDB)
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                Record a harvest batch while in the field. When offline, it queues locally on device storage and automatically posts upon reconnection.
              </p>

              <form onSubmit={handleQueueOfflineProduce} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={offlineFormText}
                  onChange={(e) => setOfflineFormText(e.target.value)}
                  placeholder="e.g. 50 Qtl Sonamukhi Cotton"
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--slate-300)', fontSize: '0.84rem' }}
                />
                <button type="submit" className="btn btn-sm btn-primary">
                  <span>Save Batch</span>
                </button>
              </form>

              <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', fontWeight: 600, marginBottom: '6px' }}>
                Local IndexedDB Storage Queue ({offlineFormQueue.length} items):
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {offlineFormQueue.length === 0 ? (
                  <div style={{ fontSize: '0.76rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                    No pending items. Type produce above to test queueing.
                  </div>
                ) : (
                  offlineFormQueue.map((item) => (
                    <div key={item.id} style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--slate-200)', fontSize: '0.76rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><strong>{item.text}</strong> ({item.timestamp})</span>
                      <span className="badge badge-amber" style={{ fontSize: '0.62rem' }}>Queued</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Simulation Block 2: SMS & USSD Cellular Fallback */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <PhoneCall size={18} color="var(--amber-600)" />
                <h4 style={{ fontSize: '1rem', color: 'var(--dark-900)' }}>
                  2. 2G SMS / USSD Price Query Fallback
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                For farmers without mobile data or using ₹1,200 Jio/Nokia feature phones, SMS query fallback delivers real-time modal APMC rates.
              </p>

              <form onSubmit={handleSimulateSms} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={smsQuery}
                  onChange={(e) => setSmsQuery(e.target.value)}
                  placeholder="SMS command"
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--slate-300)', fontSize: '0.84rem' }}
                />
                <button type="submit" className="btn btn-sm btn-amber">
                  <Send size={13} />
                  <span>Send SMS</span>
                </button>
              </form>

              {smsResponse && (
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46' }}>
                  {smsResponse}
                </div>
              )}
            </div>

            {/* Simulation Block 3: Pre-cached Manuals */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Download size={18} color="var(--primary-700)" />
                <h4 style={{ fontSize: '1rem', color: 'var(--dark-900)' }}>
                  3. Pre-Cached Diagnostic Leaf Library
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                High-resolution image manuals for Early Blight, Yellow Vein Mosaic, Leaf Borer, and Stem Canker cached locally on device storage (42 MB).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🍅 Tomato Leaf Blight & Borer Cure</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Cached (1.2 MB)</span>
                </div>
                <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🌾 Paddy Blast & Brown Plant Hopper</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Cached (2.4 MB)</span>
                </div>
                <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🥭 Mango Anthracnose & Fruit Fly</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Cached (1.8 MB)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            MULTILINGUAL DESIGN & EXPANSION ROADMAP
            ========================================================================= */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-100)', color: 'var(--primary-800)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
              <Globe size={16} />
              <span>Pan-India Linguistic Inclusivity Architecture</span>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--dark-900)' }}>
              Multilingual Design Strategy & Language Pipeline
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.96rem' }}>
              India has 22 scheduled languages and hundreds of agricultural dialects. 
              Our interface is intentionally engineered to empower rural growers in their mother tongue 
              while maintaining botanical English accuracy for buyers and agricultural scientists.
            </p>
          </div>

          {/* 7 Core Linguistic Design Practices Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            
            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Bot size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                1. Simple Vernacular Phrasing
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Strict avoidance of rigid bureaucratic terminology. We use straightforward terms like "Soil Food" instead of "Macro-amendment formulations" and "Direct Selling" instead of "Disintermediation logistics".
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Volume2 size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                2. Voice Input & Audio Speech (TTS)
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Farmers who find typing difficult can click the microphone to speak questions in Kannada, Hindi, Telugu, or Tamil. Kisan AI speaks the answer back aloud with native inflection.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Layers size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                3. Complete Surface Translation
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Every single interactive element is translated: navigation buttons, validation error messages, OTP authentication prompts, marketplace listings, and checkout receipts.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Globe size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                4. Always-Visible Language Switcher
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Language selection is placed prominently at the topmost banner of the website and inside onboarding flows, letting users switch anytime with zero page reload delay.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Database size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                5. Stored User Profile Preference
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Preferred language is stored in localStorage and user profile metadata, ensuring consistent mother-tongue experience across return visits and multi-device logins.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff1f2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Sparkles size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                6. Dual Vernacular & Botanical Naming
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Crops display their regional name alongside botanical Latin/English terms (e.g. ಟೊಮೆಟೊ / Tomato <em>Solanum lycopersicum</em>, ಅಡಿಕೆ / Arecanut <em>Areca catechu</em>) for precision contract trade.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)', marginBottom: '6px' }}>
                7. Native Agronomist Quality Reviews
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Translations are verified with agricultural extension scientists from UAS Bangalore (Kannada), TNAU Coimbatore (Tamil), PJTSAU Hyderabad (Telugu), and KAU Thrissur (Malayalam).
              </p>
            </div>

          </div>

          {/* Future Language Expansion Table */}
          <div className="glass-card" style={{ padding: '28px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--dark-900)' }}>
                  Language Pipeline: 6 Active Today + 10 Future Regional Languages
                </h3>
                <small style={{ color: 'var(--slate-600)' }}>
                  Phased rollout scheduled according to agricultural demographic clusters and major farming belts.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="badge badge-green">6 Active</span>
                <span className="badge badge-blue">10 Pipeline</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--slate-200)', color: 'var(--dark-800)' }}>
                    <th style={{ padding: '12px' }}>Language & Script</th>
                    <th style={{ padding: '12px' }}>Farming Geography & Demographics</th>
                    <th style={{ padding: '12px' }}>Priority</th>
                    <th style={{ padding: '12px' }}>Rollout Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current Active Languages */}
                  {LANGUAGES.map((lang) => (
                    <tr key={lang.code} style={{ borderBottom: '1px solid var(--slate-100)', background: 'rgba(16, 185, 129, 0.04)' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-800)' }}>
                        <span style={{ marginRight: '8px' }}>{lang.flag}</span>
                        {lang.name} ({lang.native})
                      </td>
                      <td style={{ padding: '12px', color: 'var(--slate-600)' }}>
                        National & Regional Hubs (Karnataka, AP, Telangana, Tamil Nadu, Kerala, North India)
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Active Live</span>
                      </td>
                      <td style={{ padding: '12px', color: '#059669', fontWeight: 700 }}>
                        ✓ 100% Operational
                      </td>
                    </tr>
                  ))}

                  {/* Future Languages */}
                  {futureLanguages.map((flang, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--dark-800)' }}>
                        <span style={{ marginRight: '8px' }}>🇮🇳</span>
                        {flang.name} ({flang.native})
                      </td>
                      <td style={{ padding: '12px', color: 'var(--slate-600)' }}>
                        {flang.region}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${flang.priority === 'High' ? 'badge-blue' : flang.priority === 'Medium' ? 'badge-amber' : ''}`} style={{ fontSize: '0.7rem' }}>
                          {flang.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>
                        {flang.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Back to Home CTA */}
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <button 
            onClick={() => setActiveTab('home')} 
            className="btn btn-lg btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <span>Return to Agri-Connect Home Page</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
    </>
  );
}
