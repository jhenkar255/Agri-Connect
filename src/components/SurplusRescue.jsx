import React, { useState } from 'react';
import { 
  ShieldAlert, Sparkles, TrendingUp, ArrowRight, Check, 
  HelpCircle, PhoneCall, Warehouse, Calculator, ChefHat, HeartHandshake 
} from 'lucide-react';
import { VALUE_ADDITION_GUIDES, PROCESSING_PARTNERS } from '../data/valueAdditionData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function SurplusRescue({ currentLang, setActiveTab }) {
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [rawQuantityKg, setRawQuantityKg] = useState(500); // 500 kg raw produce
  const [partnerModal, setPartnerModal] = useState(null);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentGuide = VALUE_ADDITION_GUIDES[selectedCropIndex];
  const primarySolution = currentGuide.solutions[0];

  // Dynamic calculations for Profit Multiplier
  const distressRevenue = rawQuantityKg * primarySolution.rawPricePerKg;
  // Yield: for tomato 4:1 => 0.25
  const yieldMultiplier = selectedCropIndex === 0 ? 0.25 : selectedCropIndex === 1 ? 0.45 : selectedCropIndex === 2 ? 0.28 : 0.6;
  const processedQty = Math.round(rawQuantityKg * yieldMultiplier);
  const grossValueAdded = processedQty * primarySolution.sellingPricePerKg;
  const totalProcessingCost = rawQuantityKg * (primarySolution.processingCostPerKg / 4);
  const netValueAddedReturn = Math.round(grossValueAdded - totalProcessingCost);
  const extraProfit = netValueAddedReturn - distressRevenue;
  const multiplier = (netValueAddedReturn / Math.max(1, distressRevenue)).toFixed(1);

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={HeartHandshake}
        badgeText="Market Crash Rescue & Anti-Waste Mission • 4x-12x Farmer Profit"
        badgeColor="amber"
        title={t.surplusTitle || "Surplus Crop Rescue"}
        titleHighlight="& Food Value-Addition"
        description={t.surplusDesc || "Convert market-glut tomatoes, mangoes, potatoes, and onions into high-shelf-life purees, dehydrated slices, and solar-dried chips with 4x-10x farmer profit multipliers."}
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Surplus Crop Rescue' }
        ]}
        imageSrc="/assets/images/surplus_value.jpg"
        imageAlt="Women self-help group farmer bottling tomato puree"
        imageBadgeText="Zero Food Waste Model"
        floatingStat={{
          label: 'Value Addition Multiplier',
          value: '4.8x - 12x',
          icon: TrendingUp
        }}
        stats={[
          { value: '18,500 Kg', label: 'Rescued Crops', subtext: 'Prevented Distress' },
          { value: '₹95 / Kg', label: 'Processed Puree', subtext: 'vs ₹4 Raw Dump' },
          { value: '12 Months', label: 'Shelf Life', subtext: 'Zero Rotting Loss' },
          { value: '120+ SHGs', label: 'Farmer Cooperatives', subtext: 'Micro-Processing' }
        ]}
        primaryAction={{
          label: 'Calculate Value-Added Profit',
          onClick: () => {
            const el = document.querySelector('.surplus-calculator-box');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
          icon: Calculator
        }}
        secondaryAction={{
          label: 'Explore Marketplace',
          onClick: () => setActiveTab && setActiveTab('marketplace'),
          icon: ArrowRight
        }}
        quickChips={VALUE_ADDITION_GUIDES.map((g, idx) => ({ id: idx, label: g.cropName }))}
        activeChip={selectedCropIndex}
        onChipClick={(idx) => setSelectedCropIndex(idx)}
      />

      <div className="section-pad">
        <div className="container">

        {/* Hero Visual Feature Banner (with generated image) */}
        <div 
          className="glass-card surplus-feature-grid" 
          style={{
            marginBottom: '40px',
            border: '1.5px solid rgba(217, 119, 6, 0.3)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ padding: '32px' }}>
            <span className="badge badge-amber" style={{ marginBottom: '12px' }}>
              Rural Cooperative Success Model
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--dark-900)', marginBottom: '12px', lineHeight: 1.25 }}>
              "We Turned Distress ₹4/kg Tomatoes into ₹95/kg Gourmet Puree!"
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px' }}>
              In Shivamogga and Kolar, when mandi prices dropped below harvesting costs, our 120-member Women Farmer Producer SHG utilized solar pasteurizers to bottle 18 tons of aseptic tomato puree and spicy pickle jars. Every single bottle was bought by Bangalore cloud kitchens and retail stores!
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#ecfdf5', padding: '10px 16px', borderRadius: '10px', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>+480%</div>
                <small style={{ color: '#047857', fontSize: '0.72rem' }}>Net Farmer Revenue</small>
              </div>
              <div style={{ background: '#fef3c7', padding: '10px 16px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e' }}>12 Months</div>
                <small style={{ color: '#b45309', fontSize: '0.72rem' }}>Extended Shelf Life</small>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: '300px' }}>
            <img 
              src="/assets/images/surplus_value.jpg" 
              alt="Rural Women Cooperative Food Preservation"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Crop Guide Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {VALUE_ADDITION_GUIDES.map((guide, idx) => (
            <button
              key={guide.id}
              onClick={() => setSelectedCropIndex(idx)}
              className={`btn ${selectedCropIndex === idx ? 'btn-amber' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
            >
              <span>{guide.crop} Rescue Guide</span>
            </button>
          ))}
        </div>

        {/* 2-Column: Left Interactive Profit Calculator + Right Recipe Solutions */}
        <div className="grid-2col-responsive">
          
          {/* Left Column: Interactive Profit Multiplier Calculator */}
          <div className="glass-card" style={{ padding: '26px', border: '1.5px solid var(--amber-400)', background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Calculator size={22} color="var(--amber-600)" />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--earth-800)' }}>
                Surplus Value-Addition ROI Calculator
              </h3>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              Slide to adjust your surplus {currentGuide.crop} quantity to compare the distress selling loss vs value-added net earnings:
            </p>

            {/* Slider */}
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #fde68a', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                <span>Surplus {currentGuide.crop} Quantity:</span>
                <strong style={{ color: 'var(--amber-600)' }}>{rawQuantityKg.toLocaleString('en-IN')} Kg</strong>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={rawQuantityKg}
                onChange={(e) => setRawQuantityKg(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--amber-600)' }}
              />
            </div>

            {/* Comparison Cards: Loss vs Win */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              
              {/* Option A: Distress Sale */}
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '14px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>
                      Distress Raw Sale (Crash Price @ ₹{primarySolution.rawPricePerKg}/kg):
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginTop: '2px' }}>
                      ₹{distressRevenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="badge badge-red">High Loss</span>
                </div>
                <small style={{ color: '#7f1d1d', fontSize: '0.72rem' }}>Often barely covers labor & diesel transport charges.</small>
              </div>

              {/* Option B: Value Added Puree / Pickle */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                      Processed into {processedQty} Kg {primarySolution.product.split('(')[0]}:
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46', fontFamily: 'var(--font-heading)' }}>
                      ₹{netValueAddedReturn.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
                    {multiplier}x Extra Profit!
                  </span>
                </div>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #a7f3d0', fontSize: '0.76rem', color: '#065f46', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gross Value: ₹{grossValueAdded.toLocaleString('en-IN')}</span>
                  <span>Net Gain: +₹{extraProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            <button 
              onClick={() => setActiveTab('waste')}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Explore Crop Residue & Biomass Too</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Column: Processing Methods & Local Partners */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Value Addition Products List */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <ChefHat size={20} color="var(--primary-700)" />
                <h4 style={{ fontSize: '1.15rem' }}>{currentGuide.crop} Transformation Pathways</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentGuide.solutions.map((sol, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                      <h5 style={{ fontSize: '0.96rem', color: 'var(--dark-900)' }}>{sol.product}</h5>
                      <span className="badge badge-amber">{sol.profitMultiplier}</span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '8px 0' }}>
                      <div>• <strong>Yield:</strong> {sol.yieldRatio}</div>
                      <div>• <strong>Shelf Life:</strong> {sol.shelfLife}</div>
                      <div>• <strong>Selling Price:</strong> ₹{sol.sellingPricePerKg}/kg</div>
                      <div>• <strong>Equipment:</strong> {sol.equipmentNeeded}</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.74rem', color: 'var(--primary-800)', border: '1px solid var(--primary-100)' }}>
                      <strong>Ready Buyers:</strong> {sol.buyerDemand}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Processing Partners & Cold Storage Centers */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Warehouse size={20} color="var(--primary-700)" />
                <h4 style={{ fontSize: '1.15rem' }}>Empanelled Local Agro-Processing Units</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PROCESSING_PARTNERS.map((partner) => (
                  <div key={partner.id} style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{partner.name}</div>
                        <small style={{ color: 'var(--slate-600)', fontSize: '0.74rem' }}>{partner.location}</small>
                      </div>
                      <span className="badge badge-green">FSSAI Certified</span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--slate-600)', margin: '8px 0' }}>
                      Services: {partner.services.join(' • ')}<br />
                      Capacity: {partner.capacityPerDay} • Fee: {partner.charges}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <a href={`tel:${partner.phone}`} className="btn btn-sm btn-outline" style={{ flex: 1, padding: '6px' }}>
                        <PhoneCall size={13} />
                        <span>Call Facility</span>
                      </a>
                      <button 
                        onClick={() => alert(`Processing request sent to ${partner.name}! They will call you to arrange batch processing.`)} 
                        className="btn btn-sm btn-primary" 
                        style={{ flex: 1, padding: '6px' }}
                      >
                        Book Processing Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
    </>
  );
}
