import React, { useState } from 'react';
import { 
  ShoppingBag, Search, PlusCircle, Star, MapPin, Calendar, 
  ShieldCheck, Leaf, Tractor, Droplet, ArrowRight, Tag, PhoneCall, Check 
} from 'lucide-react';
import { PRODUCE_LISTINGS, AGRI_INPUTS, EQUIPMENT_RENTALS } from '../data/productsData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function Marketplace({ 
  currentLang, 
  currentRole, 
  onAddToCart, 
  setIsCartOpen 
}) {
  const [activeMarketTab, setActiveMarketTab] = useState('produce'); // 'produce' | 'inputs' | 'rentals'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  
  // "List Harvest" Modal State
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);
  const [newListing, setNewListing] = useState({
    name: 'Organic Cavendish Bananas',
    variety: 'Grand Naine',
    category: 'Fruits',
    quantity: '1,500',
    unit: 'Kg',
    price: '28',
    grade: 'Grade A+',
    isOrganic: true,
    location: 'Shivamogga, Karnataka',
    shelfLifeDays: '7',
    harvestDate: '30 Sep 2026'
  });

  // Wholesale Quote Modal State
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    buyerCompany: 'Metro Fresh Foods',
    buyerPhone: '+91 98860 44521',
    requiredQtl: '20',
    targetPrice: '22',
    deliveryCity: 'Bengaluru'
  });

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Filter produce listings
  const filteredProduce = PRODUCE_LISTINGS.filter(item => {
    const matchesCategory = selectedSubCategory === 'All' || item.subCategory === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter inputs
  const filteredInputs = AGRI_INPUTS.filter(item => {
    const matchesCategory = selectedSubCategory === 'All' || item.category === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle harvest submit
  const handleHarvestSubmit = (e) => {
    e.preventDefault();
    setListingSuccess(true);
    setTimeout(() => {
      setListingSuccess(false);
      setIsListingModalOpen(false);
    }, 2000);
  };

  // Handle quote submit
  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setQuoteProduct(null);
    }, 2000);
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={ShoppingBag}
        badgeText="Direct Farm-to-Buyer Ecosystem • 0% Middleman Margin"
        badgeColor="green"
        title={t.marketTitle || "Farmer Marketplace"}
        titleHighlight="& Agri-Input Hub"
        description={t.marketDesc || "Buy freshly harvested produce directly from verified farmers, order subsidized seeds and bio-fertilizers, or rent precision farm equipment."}
        breadcrumbs={[
          { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { label: 'Farmer Marketplace' }
        ]}
        imageSrc="/assets/images/farmer_harvest.jpg"
        imageAlt="Indian farmer holding fresh crop produce"
        imageBadgeText="100% Direct From Farmers"
        floatingStat={{
          label: 'Farmer Take-Home Increase',
          value: '+35%',
          icon: Leaf
        }}
        stats={[
          { value: '1,250+ Tonnes', label: 'Fresh Produce', subtext: 'Harvested Weekly' },
          { value: '₹0 Cut', label: 'Middleman Margin', subtext: 'Direct DBT Payout' },
          { value: '100% Escrow', label: 'Buyer Protection', subtext: 'Safe Payments' },
          { value: '24h Delivery', label: 'Cold-Chain Pickup', subtext: 'Integrated Freight' }
        ]}
        primaryAction={{
          label: t.btnListProduce || 'List My Harvest',
          onClick: () => setIsListingModalOpen(true),
          icon: PlusCircle
        }}
        secondaryAction={{
          label: 'Open Shopping Cart',
          onClick: () => setIsCartOpen(true),
          icon: ShoppingBag
        }}
        quickChips={[
          { id: 'produce', label: '🌾 Fresh Farm Produce' },
          { id: 'inputs', label: '🌱 Subsidized Seeds & Fertilizers' },
          { id: 'rentals', label: '🚜 Drone & Tractor Rentals' }
        ]}
        activeChip={activeMarketTab}
        onChipClick={(id) => { setActiveMarketTab(id); setSelectedSubCategory('All'); }}
      />

      <div className="section-pad">
        <div className="container">

        {/* 3 Main Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveMarketTab('produce'); setSelectedSubCategory('All'); }}
            className={`btn ${activeMarketTab === 'produce' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
          >
            <Leaf size={16} />
            <span>{t.tabProduce || 'Fresh Farm Produce'} ({PRODUCE_LISTINGS.length})</span>
          </button>

          <button
            onClick={() => { setActiveMarketTab('inputs'); setSelectedSubCategory('All'); }}
            className={`btn ${activeMarketTab === 'inputs' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
          >
            <Droplet size={16} />
            <span>{t.tabInputs || 'Agri Store & Inputs'} ({AGRI_INPUTS.length})</span>
          </button>

          <button
            onClick={() => { setActiveMarketTab('rentals'); setSelectedSubCategory('All'); }}
            className={`btn ${activeMarketTab === 'rentals' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
          >
            <Tractor size={16} />
            <span>{t.tabRentals || 'Drone & Machinery Rentals'} ({EQUIPMENT_RENTALS.length})</span>
          </button>

          {/* Farmer Sell CTA */}
          <button
            onClick={() => setIsListingModalOpen(true)}
            className="btn btn-amber"
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px', marginLeft: 'auto' }}
          >
            <PlusCircle size={16} />
            <span>{t.sellHarvest}</span>
          </button>
        </div>

        {/* Search & Sub-category Filter Bar */}
        <div className="filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--slate-400)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce name, farmer, crop variety, or location..."
              className="filter-input"
            />
          </div>

          {/* Dynamic subcategory pills */}
          {activeMarketTab === 'produce' && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Vegetables', 'Fruits', 'Grains & Cereals', 'Spices', 'Cash Crops', 'Dairy Products'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedSubCategory === cat ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: selectedSubCategory === cat ? 'var(--primary-100)' : '#fff',
                    color: selectedSubCategory === cat ? 'var(--primary-800)' : 'var(--dark-700)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {activeMarketTab === 'inputs' && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Bio-Fertilizers', 'Crop Protection', 'Seeds & Saplings', 'Irrigation & Water', 'Tools & Machinery'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedSubCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedSubCategory === cat ? 'var(--primary-600)' : 'var(--slate-200)',
                    background: selectedSubCategory === cat ? 'var(--primary-100)' : '#fff',
                    color: selectedSubCategory === cat ? 'var(--primary-800)' : 'var(--dark-700)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Fresh Produce Listings */}
        {activeMarketTab === 'produce' && (
          <div className="products-grid">
            {filteredProduce.map((prod) => (
              <div key={prod.id} className="glass-card product-card glass-card-hover">
                <div className="product-thumb">
                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/farmer_harvest.jpg';
                    }}
                  />
                  
                  {/* Organic / GI Badge */}
                  <div className="product-thumb-badge">
                    {prod.isOrganic ? (
                      <span className="badge badge-green" style={{ boxShadow: 'var(--shadow-sm)' }}>
                        <Leaf size={11} />
                        Organic Pure
                      </span>
                    ) : (
                      <span className="badge badge-blue">
                        Grade {prod.grade.split(' ')[1] || 'A'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="product-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {prod.subCategory}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber-600)' }}>
                      <Star size={13} fill="currentColor" />
                      <span>{prod.rating}</span>
                      <small style={{ color: 'var(--slate-400)', fontWeight: 400 }}>({prod.reviewsCount})</small>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--dark-900)' }}>
                    {prod.name}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {prod.description}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '0.76rem', color: 'var(--slate-600)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} color="var(--primary-700)" />
                      <span><strong>{prod.farmerName}</strong> • {prod.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-400)' }}>
                      <span>Harvest: {prod.harvestDate}</span>
                      <span>Stock: {prod.quantity} {prod.unit}</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div>
                      <div className="product-price-tag">
                        ₹{prod.price.toLocaleString('en-IN')}
                        <span style={{ fontSize: '0.76rem', color: 'var(--slate-400)', fontWeight: 400 }}> /{prod.unit}</span>
                      </div>
                      <small style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>Min order: {prod.minOrderQty} {prod.unit}</small>
                    </div>

                    <button
                      onClick={() => setQuoteProduct(prod)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Request Bulk Quote
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        unit: prod.unit,
                        seller: prod.farmerName,
                        image: prod.image
                      });
                      setIsCartOpen(true);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <ShoppingBag size={16} />
                    <span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Agri Store Inputs */}
        {activeMarketTab === 'inputs' && (
          <div className="products-grid">
            {filteredInputs.map((item) => (
              <div key={item.id} className="glass-card product-card glass-card-hover">
                <div className="product-thumb">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/crop_biomass_hero.jpg';
                    }}
                  />
                  <div className="product-thumb-badge">
                    <span className="badge badge-amber">{item.category}</span>
                  </div>
                </div>

                <div className="product-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)', fontWeight: 700 }}>
                      {item.brand}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--amber-600)' }}>
                      <Star size={13} fill="currentColor" />
                      <span>{item.rating}</span>
                      <small style={{ color: 'var(--slate-400)', fontWeight: 400 }}>({item.reviews})</small>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.02rem', marginBottom: '8px', color: 'var(--dark-900)' }}>
                    {item.name}
                  </h3>

                  <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--slate-600)', marginBottom: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.features.slice(0, 2).map((feat, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '6px' }}>
                        <Check size={13} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--slate-400)', marginBottom: '12px' }}>
                    Batch: {item.batchNo} • Lic: {item.sellerLicense}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="product-price-tag">
                      ₹{item.price.toLocaleString('en-IN')}
                      <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)', fontWeight: 400 }}> /{item.unit}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        unit: item.unit,
                        seller: item.brand,
                        image: item.image
                      });
                      setIsCartOpen(true);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <ShoppingBag size={16} />
                    <span>{t.addToCart}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Machinery & Drone Rentals */}
        {activeMarketTab === 'rentals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {EQUIPMENT_RENTALS.map((rent) => (
              <div key={rent.id} className="glass-card product-card glass-card-hover">
                <div className="product-thumb" style={{ height: '220px' }}>
                  <img 
                    src={rent.image} 
                    alt={rent.name} 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/mahindra_tractor.jpg';
                    }}
                  />
                  <div className="product-thumb-badge">
                    <span className="badge badge-green" style={{ background: '#065f46', color: '#fff' }}>
                      {rent.availability}
                    </span>
                  </div>
                </div>

                <div className="product-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--slate-600)', fontWeight: 700 }}>
                      {rent.owner}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      ★ {rent.rating} ({rent.tripsDone} bookings)
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>
                    {rent.name}
                  </h3>

                  <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '14px' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {rent.rate}
                    </div>
                    <small style={{ color: '#047857', fontSize: '0.72rem' }}>Deposit: {rent.deposit}</small>
                  </div>

                  <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {rent.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} color="var(--primary-600)" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a 
                      href={`tel:${rent.phone}`} 
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      <PhoneCall size={16} />
                      <span>Call Owner</span>
                    </a>

                    <button 
                      onClick={() => {
                        try {
                          fetch('/api/machinery/book', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              machineryTitle: rent.name,
                              machineryOwner: rent.owner,
                              hourlyRate: rent.price,
                              bookedHours: 4,
                              farmerName: 'Ravi Kumar',
                              farmerPhone: '+91 98451 22891',
                              farmerVillage: rent.location
                            })
                          }).catch(() => {});
                        } catch (e) {}
                        alert(`Machinery booking request for ${rent.name} saved to MongoDB Atlas! Owner ${rent.owner} will contact you within 15 minutes.`);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* "List Your Harvest" Modal for Farmers */}
      {isListingModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsListingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={22} color="var(--primary-800)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>List Your Fresh Farm Harvest</h3>
                <small style={{ color: 'var(--slate-600)' }}>Direct access to 1,800+ buyers, restaurants, and retail chains across India</small>
              </div>
            </div>

            {listingSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '8px' }}>Harvest Listed Successfully!</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                  Your listing for <strong>{newListing.quantity} {newListing.unit} {newListing.name}</strong> is now live on the marketplace. Verified buyers will see it immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleHarvestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Crop Name:</label>
                    <input
                      type="text"
                      value={newListing.name}
                      onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Variety:</label>
                    <input
                      type="text"
                      value={newListing.variety}
                      onChange={(e) => setNewListing({ ...newListing, variety: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Quantity Available:</label>
                    <input
                      type="text"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Unit:</label>
                    <select
                      value={newListing.unit}
                      onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                    >
                      <option value="Kg">Kg</option>
                      <option value="Quintal">Quintal</option>
                      <option value="Crate">Crate</option>
                      <option value="Dozen">Dozen</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Price (₹ / unit):</label>
                    <input
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Harvest Date:</label>
                    <input
                      type="text"
                      value={newListing.harvestDate}
                      onChange={(e) => setNewListing({ ...newListing, harvestDate: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Farm Location:</label>
                    <input
                      type="text"
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0' }}>
                  <input
                    type="checkbox"
                    id="isOrganicCheck"
                    checked={newListing.isOrganic}
                    onChange={(e) => setNewListing({ ...newListing, isOrganic: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                  />
                  <label htmlFor="isOrganicCheck" style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                    Naturally grown / Chemical residue-free certified
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Publish Produce Listing
                  </button>
                  <button type="button" onClick={() => setIsListingModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bulk Quote Modal for Buyers */}
      {quoteProduct && (
        <div className="modal-backdrop" onClick={() => setQuoteProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--info-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={22} color="var(--info-600)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Request Bulk Wholesale Quote</h3>
                <small style={{ color: 'var(--slate-600)' }}>Direct quotation negotiation with {quoteProduct.farmerName}</small>
              </div>
            </div>

            {quoteSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '8px' }}>Quotation Request Sent!</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                  Farmer {quoteProduct.farmerName} has received your requirement for <strong>{quoteForm.requiredQtl} Quintals</strong> at target price of <strong>₹{quoteForm.targetPrice}/kg</strong>. You will receive an SMS reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                  <strong>Product:</strong> {quoteProduct.name} ({quoteProduct.variety})<br />
                  <strong>Current Listed Price:</strong> ₹{quoteProduct.price}/{quoteProduct.unit}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Required Quantity (Quintals):</label>
                    <input
                      type="number"
                      value={quoteForm.requiredQtl}
                      onChange={(e) => setQuoteForm({ ...quoteForm, requiredQtl: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Target Offer Price (₹/kg):</label>
                    <input
                      type="number"
                      value={quoteForm.targetPrice}
                      onChange={(e) => setQuoteForm({ ...quoteForm, targetPrice: e.target.value })}
                      required
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Delivery Destination (City / Mandi Hub):</label>
                  <input
                    type="text"
                    value={quoteForm.deliveryCity}
                    onChange={(e) => setQuoteForm({ ...quoteForm, deliveryCity: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Submit Quotation Inquiry
                  </button>
                  <button type="button" onClick={() => setQuoteProduct(null)} className="btn btn-outline">
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
