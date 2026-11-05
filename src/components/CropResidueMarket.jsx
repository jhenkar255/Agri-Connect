import React, { useState } from 'react';
import { 
  Flame, Leaf, PlusCircle, Check, Search, MapPin, 
  Truck, ArrowRight, ShieldCheck, PhoneCall, Sparkles 
} from 'lucide-react';
import { CROP_WASTE_LISTINGS } from '../data/valueAdditionData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function CropResidueMarket({ currentLang }) {
  const [wasteList, setWasteList] = useState(CROP_WASTE_LISTINGS);
  const [searchResidue, setSearchResidue] = useState('');
  const [isResidueModalOpen, setIsResidueModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // New residue listing state
  const [newResidue, setNewResidue] = useState({
    residueType: 'Paddy Straw Bales (Round)',
    quantityTons: '50',
    pricePerTon: '1900',
    moisturePercent: '11%',
    location: 'Mandya, Karnataka',
    recommendedUse: 'Mushroom cultivation & cattle fodder',
    pickupWindow: '05 Oct - 20 Oct 2026'
  });

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const totalCO2Saved = wasteList.reduce((acc, item) => acc + item.avoidedBurningCO2Tons, 0);

  const filteredWaste = wasteList.filter(item => 
    item.residueType.toLowerCase().includes(searchResidue.toLowerCase()) ||
    item.location.toLowerCase().includes(searchResidue.toLowerCase()) ||
    item.recommendedUse.toLowerCase().includes(searchResidue.toLowerCase())
  );

  const handleCreateResidue = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsResidueModalOpen(false);
      setWasteList(prev => [
        {
          id: 'waste-' + Date.now(),
          residueType: newResidue.residueType,
          farmerName: 'Ravi Kumar (You)',
          phone: '+91 98451 22891',
          location: newResidue.location,
          state: 'Karnataka',
          quantityTons: Number(newResidue.quantityTons),
          pricePerTon: Number(newResidue.pricePerTon),
          moisturePercent: newResidue.moisturePercent,
          recommendedUse: newResidue.recommendedUse,
          pickupWindow: newResidue.pickupWindow,
          avoidedBurningCO2Tons: Math.round(Number(newResidue.quantityTons) * 1.5),
          transportSupport: 'Self-arranged trolley available'
        },
        ...prev
      ]);
    }, 1800);
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Flame}
        badgeText="Stop Stubble Burning • Turn Crop Waste into Clean Green Cash"
        badgeColor="green"
        title={t.residueTitle || "Crop Residue & Biomass"}
        titleHighlight="Monetization Marketplace"
        description={t.residueDesc || "Sell paddy straw bales, sugarcane bagasse, cotton stalks, and coconut coir to verified bio-pellet factories, 2G ethanol plants, and power plants instead of harmful stubble burning."}
        breadcrumbs={[
          { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { label: 'Crop Residue & Biomass' }
        ]}
        imageSrc="/assets/images/crop_biomass_hero.jpg"
        imageAlt="Tractor baler packing golden paddy straw in clean field"
        imageBadgeText="Zero Smoke Certified"
        floatingStat={{
          label: 'Avoided CO2 Smog',
          value: `${totalCO2Saved} Tons`,
          icon: Leaf
        }}
        stats={[
          { value: '₹2,200/Ton', label: 'Extra Income', subtext: 'Per Acre Average' },
          { value: `${totalCO2Saved}+ Tons`, label: 'CO2 Prevented', subtext: 'Clean Air Certified' },
          { value: '18 Factories', label: 'Biofuel Buyers', subtext: 'Factory Offtake' },
          { value: '100% Escrow', label: 'Guaranteed Pay', subtext: 'Weighbridge Weighed' }
        ]}
        primaryAction={{
          label: t.btnListResidue || 'List My Stubble / Biomass',
          onClick: () => setIsResidueModalOpen(true),
          icon: PlusCircle
        }}
        secondaryAction={{
          label: 'Calculate Carbon Credit',
          onClick: () => alert(`Your farm has prevented ${totalCO2Saved} tons of smog carbon emissions, earning eligible Carbon Credit tokens!`),
          icon: Sparkles
        }}
        quickChips={[
          { id: '', label: 'All Biomass' },
          { id: 'Paddy', label: '🌾 Paddy Straw' },
          { id: 'Sugarcane', label: '🎋 Sugarcane Bagasse' },
          { id: 'Cotton', label: '☁️ Cotton Stalks' },
          { id: 'Groundnut', label: '🥜 Groundnut Shells' }
        ]}
        activeChip={searchResidue}
        onChipClick={(val) => setSearchResidue(val)}
      />

      <div className="section-pad">
        <div className="container">

        {/* Environmental Impact Counter Banner */}
        <div 
          className="glass-card" 
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
            color: '#fff',
            padding: '28px 36px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a7f3d0', fontSize: '0.86rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Leaf size={16} />
              <span>Agri-Connect Environmental Impact Score</span>
            </div>
            <h3 style={{ fontSize: '2rem', color: '#fde68a', margin: '4px 0' }}>
              {totalCO2Saved.toLocaleString('en-IN')} Metric Tons of CO2 Prevented
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', maxWidth: '640px' }}>
              Every ton of straw sold instead of torched spares 1.5 tons of CO2, hazardous PM2.5 smoke, and saves billions of beneficial nitrogen-fixing soil microbes.
            </p>
          </div>

          <button
            onClick={() => setIsResidueModalOpen(true)}
            className="btn btn-amber btn-lg"
          >
            <PlusCircle size={18} />
            <span>{t.listResidueBtn || 'List Your Crop Residue for Sale'}</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--slate-400)" />
            <input
              type="text"
              value={searchResidue}
              onChange={(e) => setSearchResidue(e.target.value)}
              placeholder="Search residue type (Paddy straw, Bagasse, Arecanut fronds, Fodder)..."
              className="filter-input"
            />
          </div>
          <span style={{ fontSize: '0.84rem', color: 'var(--slate-600)', alignSelf: 'center' }}>
            Showing {filteredWaste.length} verified biomass lots
          </span>
        </div>

        {/* Residue Listings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredWaste.map((item) => (
            <div key={item.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <span className="badge badge-amber">{item.quantityTons} Metric Tons</span>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  Moisture: {item.moisturePercent}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--dark-900)' }}>
                {item.residueType}
              </h3>

              <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '10px', border: '1px solid #a7f3d0', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700 }}>ASKING PRICE:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                  ₹{item.pricePerTon.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '0.76rem', color: 'var(--slate-600)', fontWeight: 400 }}>/ Metric Ton</span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>• <strong>Ideal Industrial Use:</strong> {item.recommendedUse}</div>
                <div>• <strong>Pickup Window:</strong> {item.pickupWindow}</div>
                <div>• <strong>CO2 Offset:</strong> {item.avoidedBurningCO2Tons} Tons GHG Saved</div>
                <div>• <strong>Logistics:</strong> {item.transportSupport}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--slate-600)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--primary-700)" />
                <span><strong>{item.farmerName}</strong> • {item.location}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`tel:${item.phone}`} className="btn btn-outline" style={{ flex: 1 }}>
                  <PhoneCall size={15} />
                  <span>Call Seller</span>
                </a>
                <button 
                  onClick={() => alert(`Purchase inquiry sent to ${item.farmerName} for ${item.quantityTons} Tons! Dispatch coordination team will call you.`)}
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                >
                  <span>Book Biomass</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* "List Residue" Modal */}
      {isResidueModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsResidueModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="#b45309" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>List Crop Residue for Sale</h3>
                <small style={{ color: 'var(--slate-600)' }}>Turn stubble and husks into money while protecting our atmosphere</small>
              </div>
            </div>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '8px' }}>Biomass Lot Published!</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                  Your listing for <strong>{newResidue.quantityTons} Tons of {newResidue.residueType}</strong> is now visible to industrial buyers and mushroom growers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateResidue} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Residue / Biomass Type:</label>
                  <select
                    value={newResidue.residueType}
                    onChange={(e) => setNewResidue({ ...newResidue, residueType: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                  >
                    <option value="Paddy Straw Bales (Round / Square)">Paddy Straw Bales (Round / Square)</option>
                    <option value="Arecanut Husk & Shredded Fronds">Arecanut Husk & Shredded Fronds</option>
                    <option value="Sugarcane Bagasse & Trash">Sugarcane Bagasse & Trash</option>
                    <option value="Cotton Stalk Shreds">Cotton Stalk Shreds</option>
                    <option value="Wheat Straw Chaff (Bhusa / Turi)">Wheat Straw Chaff (Bhusa / Turi)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Total Tons:</label>
                    <input
                      type="number"
                      value={newResidue.quantityTons}
                      onChange={(e) => setNewResidue({ ...newResidue, quantityTons: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Expected Price (₹/Ton):</label>
                    <input
                      type="number"
                      value={newResidue.pricePerTon}
                      onChange={(e) => setNewResidue({ ...newResidue, pricePerTon: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Moisture %:</label>
                    <input
                      type="text"
                      value={newResidue.moisturePercent}
                      onChange={(e) => setNewResidue({ ...newResidue, moisturePercent: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Farm Location / Taluk:</label>
                    <input
                      type="text"
                      value={newResidue.location}
                      onChange={(e) => setNewResidue({ ...newResidue, location: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Pickup Dates Window:</label>
                    <input
                      type="text"
                      value={newResidue.pickupWindow}
                      onChange={(e) => setNewResidue({ ...newResidue, pickupWindow: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Publish Residue Lot
                  </button>
                  <button type="button" onClick={() => setIsResidueModalOpen(false)} className="btn btn-outline">
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
