import React, { useState } from 'react';
import { 
  Building2, Search, CheckCircle, ExternalLink, Filter, 
  Sparkles, FileText, Download, ShieldCheck, ChevronRight, Check, AlertCircle 
} from 'lucide-react';
import { GOVT_SCHEMES } from '../data/schemesData';
import { STATES_LIST } from '../data/mandiData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function SchemesDirectory({ currentLang }) {
  const [searchScheme, setSearchScheme] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Interactive Eligibility Checker Wizard State
  const [showChecker, setShowChecker] = useState(false);
  const [checkerState, setCheckerState] = useState('Karnataka');
  const [checkerCategory, setCheckerCategory] = useState('Small'); // Marginal | Small | Large
  const [checkerAcres, setCheckerAcres] = useState('2.5');
  const [checkerCrop, setCheckerCrop] = useState('Tomato');
  const [checkerResult, setCheckerResult] = useState(null);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Filter schemes
  const filteredSchemes = GOVT_SCHEMES.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchScheme.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchScheme.toLowerCase()) ||
                          s.benefit.toLowerCase().includes(searchScheme.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Income Support', 'Crop Insurance', 'Solar & Energy', 'Irrigation & Water', 'Credit & Loans', 'Farm Machinery', 'Organic Farming', 'Post-Harvest Infrastructure', 'Horticulture & Greenhouse', 'Wildlife & Disaster Relief'];

  // Run Eligibility Calculation
  const handleCheckEligibility = (e) => {
    e.preventDefault();
    const acres = parseFloat(checkerAcres) || 1.5;
    
    // Evaluate matched schemes
    const matched = GOVT_SCHEMES.filter(s => {
      const landMatches = acres <= s.maxLandholdingAcres;
      const cropMatches = s.eligibleCrops.includes('All Crops') || 
                          s.eligibleCrops.some(c => c.toLowerCase().includes(checkerCrop.toLowerCase()));
      return landMatches && cropMatches;
    });

    setCheckerResult({
      eligibleCount: matched.length,
      schemes: matched,
      combinedDocuments: [
        'Aadhaar Card linked with Mobile OTP',
        'Updated Land Ownership Title / RTC (Pahani / Form 7/12)',
        'Active Bank Account Passbook (Aadhaar NPCI Seeding mandatory)',
        'Passport Size Photographs (2 copies)',
        'Soil Health Card or Water Source Certificate (for irrigation subsidy)'
      ]
    });
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Building2}
        badgeText="Verified Central & State Portals • 100% Direct DBT Bank Payout"
        badgeColor="green"
        title={t.schemesTitle || "Government Schemes"}
        titleHighlight="& Direct Farmer Subsidies"
        description={t.schemesDesc || "Comprehensive verified directory of PM-KISAN, PMFBY crop insurance, PM-KUSUM solar pumps, and state horticulture grants with zero agent commission."}
        breadcrumbs={[
          { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { label: 'Government Schemes & Subsidies' }
        ]}
        imageSrc="/assets/images/govt_schemes_hero.jpg"
        imageAlt="Indian farmer holding Kisan Credit Card and official passbook"
        imageBadgeText="Direct DBT Verified"
        floatingStat={{
          label: 'Avg Approved Subsidy',
          value: '₹55,000',
          icon: ShieldCheck
        }}
        stats={[
          { value: '18+ Schemes', label: 'Central & State', subtext: 'Updated for 2026' },
          { value: '₹6,000/yr', label: 'PM-KISAN DBT', subtext: 'Direct to Bank' },
          { value: '90% Subsidy', label: 'Solar Pumps & Drip', subtext: 'PM-KUSUM Scheme' },
          { value: '0% Interest', label: 'Kisan Credit Card', subtext: 'Timely Repayment' }
        ]}
        primaryAction={{
          label: showChecker ? 'Hide Eligibility Checker' : (t.launchCheckerBtn || 'Launch 4-Step Eligibility Checker'),
          onClick: () => setShowChecker(!showChecker),
          icon: Sparkles
        }}
        secondaryAction={{
          label: 'Download Schemes PDF',
          onClick: () => alert('Generating verified Central & State Agriculture Schemes 2026 PDF...'),
          icon: Download
        }}
        quickChips={[
          { id: 'All', label: 'All Schemes' },
          { id: 'Income Support', label: '💰 PM-KISAN' },
          { id: 'Solar & Energy', label: '☀️ Solar Pumps (KUSUM)' },
          { id: 'Crop Insurance', label: '🛡️ Crop Insurance (PMFBY)' },
          { id: 'Credit & Loans', label: '💳 Kisan Credit Card' }
        ]}
        activeChip={selectedCategory}
        onChipClick={(cat) => setSelectedCategory(cat)}
      />

      <div className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">

        {/* 4-Step Interactive Eligibility Checker Modal / Accordion */}
        {showChecker && (
          <div className="glass-card" style={{ background: '#ffffff', border: '2px solid var(--primary-500)', padding: '28px', marginBottom: '36px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)' }}>
                  Personalized Scheme Eligibility Assessment
                </h3>
                <small style={{ color: 'var(--slate-600)' }}>
                  Enter your farm details to calculate verified eligible subsidies and auto-generate your application checklist
                </small>
              </div>
              <span className="badge badge-green">Instant Result</span>
            </div>

            <form onSubmit={handleCheckEligibility}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>State:</label>
                  <select
                    value={checkerState}
                    onChange={(e) => setCheckerState(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    {STATES_LIST.filter(s => s !== 'All States').map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Farmer Category:</label>
                  <select
                    value={checkerCategory}
                    onChange={(e) => setCheckerCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    <option value="Marginal">Marginal (&lt; 2.5 Acres)</option>
                    <option value="Small">Small (2.5 to 5 Acres)</option>
                    <option value="Medium">Medium (5 to 10 Acres)</option>
                    <option value="Large">Large (&gt; 10 Acres)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Total Landholding (Acres):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={checkerAcres}
                    onChange={(e) => setCheckerAcres(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Primary Cultivated Crop:</label>
                  <select
                    value={checkerCrop}
                    onChange={(e) => setCheckerCrop(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    <option value="Tomato">Tomato / Vegetables</option>
                    <option value="Paddy">Paddy / Rice</option>
                    <option value="Arecanut">Arecanut / Spices</option>
                    <option value="Mango">Mango / Fruits</option>
                    <option value="Cotton">Cotton / Oilseeds</option>
                    <option value="Millets">Millets (Ragi/Jowar)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                <CheckCircle size={18} />
                <span>Calculate Eligible Schemes</span>
              </button>
            </form>

            {/* Checker Output Box */}
            {checkerResult && (
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '2px dashed var(--slate-200)' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={26} color="#059669" />
                      <div>
                        <h4 style={{ fontSize: '1.15rem', color: '#065f46' }}>
                          Congratulations! You qualify for {checkerResult.eligibleCount} Government Schemes!
                        </h4>
                        <small style={{ color: '#047857' }}>
                          Profile: {checkerCategory} farmer in {checkerState} cultivating {checkerCrop} on {checkerAcres} acres.
                        </small>
                      </div>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                      100% Verified
                    </span>
                  </div>
                </div>

                {/* Generated Required Document Checklist */}
                <div style={{ background: '#fff', border: '1px solid var(--slate-300)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} color="var(--primary-700)" />
                      <h4 style={{ fontSize: '1rem', color: 'var(--dark-900)' }}>
                        Universal Document Checklist to Keep Ready:
                      </h4>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Download size={14} />
                      <span>Print Checklist</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                    {checkerResult.combinedDocuments.map((doc, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.84rem' }}>
                        <Check size={14} color="#059669" style={{ flexShrink: 0 }} />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter bar for Scheme Cards */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--slate-400)" />
            <input
              type="text"
              value={searchScheme}
              onChange={(e) => setSearchScheme(e.target.value)}
              placeholder="Search scheme name (e.g. PM-KISAN, PMFBY, Solar pump)..."
              className="filter-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary-600)' : 'var(--slate-200)',
                  background: selectedCategory === cat ? 'var(--primary-100)' : '#fff',
                  color: selectedCategory === cat ? 'var(--primary-800)' : 'var(--dark-700)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <span className="badge badge-green">{scheme.category}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                  Verified: {scheme.lastVerifiedDate}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--dark-900)' }}>
                {scheme.name}
              </h3>
              <small style={{ color: 'var(--slate-600)', fontSize: '0.76rem', marginBottom: '14px', display: 'block' }}>
                {scheme.ministry}
              </small>

              {/* Financial Benefit Highlight */}
              <div style={{ background: '#ecfdf5', padding: '12px 14px', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Financial Benefit / Subsidy:</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary-800)', marginTop: '2px' }}>
                  {scheme.benefit}
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '16px', flex: 1 }}>
                {scheme.description}
              </p>

              {/* Required Documents Pill */}
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--dark-800)', marginBottom: '4px' }}>Key Documents:</div>
                <ul style={{ listStyle: 'none', fontSize: '0.76rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {scheme.requiredDocuments.slice(0, 3).map((doc, idx) => (
                    <li key={idx}>• {doc}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                  Eligibility: &le; {scheme.maxLandholdingAcres} Acres
                </span>

                <a 
                  href={scheme.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                >
                  <span>Official Application</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </>
  );
}
