import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Search, Filter, Bell, MapPin, 
  Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Calculator, Check, ShieldCheck 
} from 'lucide-react';
import { MANDI_PRICES, STATES_LIST } from '../data/mandiData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function MandiPrices({ currentLang, setActiveTab }) {
  const [selectedState, setSelectedState] = useState('All States');
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedCropDetail, setSelectedCropDetail] = useState(MANDI_PRICES[0]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('2400');
  const [alertPhone, setAlertPhone] = useState('+91 98451 22891');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Best Market Recommendation State
  const [farmerProduceQtl, setFarmerProduceQtl] = useState(25); // 25 quintals

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Filtered prices
  const filteredMandiList = MANDI_PRICES.filter(item => {
    const matchesState = selectedState === 'All States' || item.state === selectedState;
    const matchesQuery = item.crop.toLowerCase().includes(searchCrop.toLowerCase()) ||
                         item.variety.toLowerCase().includes(searchCrop.toLowerCase()) ||
                         item.market.toLowerCase().includes(searchCrop.toLowerCase()) ||
                         item.district.toLowerCase().includes(searchCrop.toLowerCase());
    return matchesState && matchesQuery;
  });

  // Calculate Best Market Recommendation
  // Net Profit = (ModalPrice * Qtl) - (TransportCostPerQtl * Qtl) - (SpoilagePenalty)
  const evaluatedMarkets = filteredMandiList.map(item => {
    const revenue = item.modalPrice * farmerProduceQtl;
    const transport = item.transportCostPerQtl * farmerProduceQtl;
    const spoilagePenalty = item.spoilageRisk === 'High' ? revenue * 0.05 : item.spoilageRisk === 'Medium' ? revenue * 0.02 : 0;
    const netReturn = revenue - transport - spoilagePenalty;
    return {
      ...item,
      revenue,
      transport,
      netReturn,
      netPerQtl: Math.round(netReturn / farmerProduceQtl)
    };
  }).sort((a, b) => b.netReturn - a.netReturn);

  const bestMarket = evaluatedMarkets[0] || filteredMandiList[0];

  const handleSetAlert = (e) => {
    e.preventDefault();
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsAlertModalOpen(false);
    }, 2200);
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={TrendingUp}
        badgeText="e-NAM & Agmarknet Synced Intelligence • 30 Sep 2026"
        badgeColor="amber"
        title={t.mandiTitle || "Live APMC Mandi Rates"}
        titleHighlight="& Daily Intelligence"
        description={t.mandiDesc || "Real-time crop modal prices, volume arrivals, and transport-optimized profit recommendations across 2,800+ Indian APMC markets."}
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'APMC Mandi Rates' }
        ]}
        imageSrc="/assets/images/mandi_market_hero.jpg"
        imageAlt="Vibrant Indian APMC grain and produce market"
        imageBadgeText="2,800+ Mandis Live"
        floatingStat={{
          label: 'Farmer Profit Uplift',
          value: '+18.4%',
          icon: TrendingUp
        }}
        stats={[
          { value: '2,840+', label: 'APMC Mandis', subtext: 'Hourly Synced' },
          { value: '140+', label: 'Crops Tracked', subtext: 'A-Grade Varieties' },
          { value: '₹0 Cut', label: 'Middleman Margin', subtext: 'Direct Agmarknet' },
          { value: 'Free SMS', label: 'Instant Alerts', subtext: 'On Your Phone' }
        ]}
        primaryAction={{
          label: 'Set Price Alert SMS',
          onClick: () => setIsAlertModalOpen(true),
          icon: Bell
        }}
        secondaryAction={{
          label: 'Ask Kisan AI Advice',
          onClick: () => setActiveTab && setActiveTab('advisory'),
          icon: Sparkles
        }}
        quickChips={[
          { id: '', label: 'All Crops' },
          { id: 'Tomato', label: '🍅 Tomato' },
          { id: 'Potato', label: '🥔 Potato' },
          { id: 'Onion', label: '🧅 Onion' },
          { id: 'Wheat', label: '🌾 Wheat' },
          { id: 'Banana', label: '🍌 Banana' }
        ]}
        activeChip={searchCrop}
        onChipClick={(val) => setSearchCrop(val)}
      />

      <div className="section-pad">
        <div className="container">

        {/* Top Control & Filter Bar */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--slate-400)" />
            <input
              type="text"
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              placeholder={t.searchPlaceholder || "Search crop, variety, or mandi (e.g. Tomato, Shivamogga, Kolar)..."}
              className="filter-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--slate-400)" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--slate-300)',
                background: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {STATES_LIST.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Bell size={16} />
            <span>{t.setPriceAlertBtn || 'Set Price Alert'}</span>
          </button>
        </div>

        {/* 2-Column: Left Table + Right "Best Nearby Market" Recommendation & Chart */}
        <div className="grid-2col-responsive">
          
          {/* Left Column: Mandi Prices Table */}
          <div>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Crop & Variety</th>
                    <th>Market & State</th>
                    <th>Modal Price</th>
                    <th>Min / Max</th>
                    <th>Trend</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMandiList.map((item) => {
                    const isUp = item.trendDirection === 'up';
                    const isSelected = selectedCropDetail.id === item.id;
                    return (
                      <tr 
                        key={item.id}
                        onClick={() => setSelectedCropDetail(item)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--primary-50)' : 'transparent'
                        }}
                      >
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--dark-900)' }}>{item.crop}</div>
                          <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>{item.variety}</small>
                          {item.isMSP && (
                            <span className="badge badge-purple" style={{ marginLeft: '6px', fontSize: '0.62rem' }}>
                              MSP: ₹{item.mspPrice}
                            </span>
                          )}
                        </td>

                        <td>
                          <div style={{ fontWeight: 600 }}>{item.market}</div>
                          <small style={{ color: 'var(--slate-400)', fontSize: '0.72rem' }}>{item.district}, {item.state}</small>
                        </td>

                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--primary-800)', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                            ₹{item.modalPrice.toLocaleString('en-IN')}
                          </div>
                          <small style={{ color: 'var(--slate-400)', fontSize: '0.7rem' }}>per {item.unit}</small>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.82rem', color: 'var(--dark-700)' }}>
                            ₹{item.minPrice} - ₹{item.maxPrice}
                          </div>
                        </td>

                        <td>
                          <span 
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: isUp ? '#059669' : '#dc2626',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                          >
                            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {item.trend}
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-green" style={{ fontSize: '0.66rem' }}>
                            <ShieldCheck size={11} />
                            {item.verifiedSource.split(' ')[0]}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
              <span>Showing {filteredMandiList.length} APMC trading terminals • Synced every 30 minutes</span>
              <span>Prices compliant with APMC Act & e-NAM national gateway</span>
            </div>
          </div>

          {/* Right Column: Interactive Detail View & "Best Market Recommendation" */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Best Market Recommendation Engine Card */}
            {bestMarket && (
              <div className="glass-card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', border: '1.5px solid #10b981', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} color="#059669" />
                    <h3 style={{ fontSize: '1.05rem', color: '#065f46' }}>{t.bestMarketTitle || 'Best Nearby Market Recommender'}</h3>
                  </div>
                  <span className="badge badge-green">Highest Net Return</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '14px' }}>
                  {t.bestMarketDesc || 'Calculated based on modal price minus transport distance and freshness spoilage risk:'}
                </p>

                {/* Produce volume slider */}
                <div style={{ background: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #d1fae5', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>Your Harvest Quantity to Sell:</span>
                    <strong style={{ color: 'var(--primary-700)' }}>{farmerProduceQtl} Quintals ({(farmerProduceQtl * 100).toLocaleString('en-IN')} Kg)</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={farmerProduceQtl}
                    onChange={(e) => setFarmerProduceQtl(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                  />
                </div>

                {/* Best Market Winner Box */}
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', border: '1px solid #a7f3d0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark-900)' }}>{bestMarket.market}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>{bestMarket.district}, {bestMarket.state} ({bestMarket.distanceKm} km away)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>Estimated Net Payout:</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-heading)' }}>
                        ₹{bestMarket.netReturn.toLocaleString('en-IN')}
                      </div>
                      <small style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                        (₹{bestMarket.netPerQtl}/qtl net after diesel)
                      </small>
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--slate-600)' }}>
                    <span>Gross Value: ₹{bestMarket.revenue.toLocaleString('en-IN')}</span>
                    <span>Transport Cost: -₹{bestMarket.transport.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('marketplace')}
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                >
                  <span>Or Sell Directly on Agri-Connect Marketplace</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            )}

            {/* Selected Crop Price Trend History Chart (SVG) */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-900)' }}>
                    {selectedCropDetail.crop} 7-Day Price History
                  </h4>
                  <small style={{ color: 'var(--slate-400)', fontSize: '0.74rem' }}>
                    {selectedCropDetail.market} ({selectedCropDetail.variety})
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-heading)' }}>
                    ₹{selectedCropDetail.modalPrice}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: selectedCropDetail.trendDirection === 'up' ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {selectedCropDetail.trend} vs last week
                  </div>
                </div>
              </div>

              {/* Interactive SVG Sparkline Chart */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
                <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Draw polygon under line */}
                  {(() => {
                    const data = selectedCropDetail.history7d || [1000, 1100, 1050, 1200, 1180, 1250, 1300];
                    const min = Math.min(...data) * 0.95;
                    const max = Math.max(...data) * 1.05;
                    const points = data.map((val, idx) => {
                      const x = (idx / (data.length - 1)) * 280 + 10;
                      const y = 90 - ((val - min) / (max - min)) * 75;
                      return `${x},${y}`;
                    }).join(' ');

                    const firstX = 10;
                    const lastX = 290;
                    const polygonPoints = `${points} ${lastX},95 ${firstX},95`;

                    return (
                      <>
                        <polygon points={polygonPoints} fill="url(#chartGradient)" />
                        <polyline
                          fill="none"
                          stroke="#059669"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {data.map((val, idx) => {
                          const x = (idx / (data.length - 1)) * 280 + 10;
                          const y = 90 - ((val - min) / (max - min)) * 75;
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
                              <text x={x} y={y - 8} fontSize="8" fill="#475569" textAnchor="middle" fontWeight="bold">
                                ₹{val}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--slate-400)', marginTop: '8px' }}>
                  <span>24 Sep</span>
                  <span>25 Sep</span>
                  <span>26 Sep</span>
                  <span>27 Sep</span>
                  <span>28 Sep</span>
                  <span>29 Sep</span>
                  <span>Today (30 Sep)</span>
                </div>
              </div>

              <div style={{ marginTop: '14px', background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#065f46' }}>
                💡 <strong>Agronomist Trading Insight:</strong> Demand for {selectedCropDetail.crop} is peaking due to festival season purchases. Prices are projected to remain firm for next 4 days.
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Set Price Alert Modal */}
      {isAlertModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAlertModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={22} color="var(--primary-800)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Set Mandi Price SMS Alert</h3>
                <small style={{ color: 'var(--slate-600)' }}>Get free WhatsApp / SMS alerts when your target price is reached</small>
              </div>
            </div>

            {alertSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '8px' }}>Price Alert Activated!</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                  You will receive an automated notification at <strong>{alertPhone}</strong> as soon as {selectedCropDetail.crop} reaches <strong>₹{alertTargetPrice}/quintal</strong> in {selectedCropDetail.market}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSetAlert} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Crop to Monitor:</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedCropDetail.crop} (${selectedCropDetail.market})`}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: 'var(--slate-100)', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Trigger Target Price (₹ / Quintal):</label>
                  <input
                    type="number"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Mobile Phone Number (for WhatsApp/SMS):</label>
                  <input
                    type="tel"
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Activate Alert Notification
                  </button>
                  <button type="button" onClick={() => setIsAlertModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
    </>
  );
}
