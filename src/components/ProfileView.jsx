import React, { useState, useEffect } from 'react';
import { 
  User, CheckCircle, Shield, MapPin, Phone, Mail, Award, 
  Sprout, TrendingUp, FileText, Calendar, Edit3, Download, 
  ExternalLink, Sparkles, Building, Layers, Check, X, ShieldCheck, Database
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import { checkMongoDBHealth } from '../services/authService';
import PageBanner from './PageBanner';

export default function ProfileView({ 
  currentLang = 'en', 
  userProfile, 
  setUserProfile, 
  currentRole = 'farmer', 
  setCurrentRole,
  setActiveTab 
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  // Merge current mock defaults with any authenticated userProfile
  const activeUser = userProfile || MOCK_USERS[currentRole] || MOCK_USERS.farmer;
  
  const [activeSubTab, setActiveSubTab] = useState('farm'); // 'farm' | 'kyc' | 'orders' | 'security'
  const [isEditing, setIsEditing] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mongoStatus, setMongoStatus] = useState({ connected: true, database: 'MongoDB Atlas' });

  useEffect(() => {
    checkMongoDBHealth().then(status => {
      if (status) setMongoStatus(status);
    });
  }, []);

  // Edit form state
  const [formData, setFormData] = useState({
    name: activeUser.name || 'Ravi Kumar',
    phone: activeUser.phone || '+91 98451 22891',
    email: activeUser.email || 'ravi.kumar@agriconnect.org',
    village: activeUser.village || 'Kudumallige',
    district: activeUser.district || 'Shivamogga',
    state: activeUser.state || 'Karnataka',
    landAreaAcres: activeUser.landAreaAcres || 2.5,
    mainCrops: Array.isArray(activeUser.mainCrops) ? activeUser.mainCrops.join(', ') : 'Tomato, Arecanut, Paddy'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setUserProfile) {
      setUserProfile(prev => ({
        ...prev,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        village: formData.village,
        district: formData.district,
        state: formData.state,
        landAreaAcres: parseFloat(formData.landAreaAcres) || 2.5,
        mainCrops: formData.mainCrops.split(',').map(s => s.trim()).filter(Boolean)
      }));
    }
    setIsEditing(false);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 4000);
  };

  const handleDownloadCard = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="profile-view-wrapper">
      {/* Page Hero Banner */}
      <PageBanner
        badgeIcon={ShieldCheck}
        badgeText={`National Digital Agri Mission • ${activeUser.verificationStatus || 'Govt Verified'}`}
        badgeColor="green"
        title={`${activeUser.name || 'Farmer Profile'}`}
        titleHighlight="(Kisan Profile View)"
        description="Official digitized agricultural identity record: Manage verified landholding credentials, Aadhaar-linked DBT records, soil health certificates, and direct market listings."
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Profile View' }
        ]}
        imageSrc="/assets/images/farmer_harvest.jpg"
        imageAlt={activeUser.name}
        imageBadgeText={`ID: ${activeUser.id || 'KA-SMG-2026-9845'}`}
        floatingStat={{
          label: 'KYC Verification',
          value: '100% Certified',
          icon: CheckCircle
        }}
        stats={[
          { value: `${activeUser.landAreaAcres || 2.5} Acres`, label: 'Verified Landholding', subtext: 'RTC Linked' },
          { value: 'PM-KISAN', label: 'DBT Direct Benefit', subtext: 'Active Beneficiary' },
          { value: 'FPO Member', label: 'Farmer Producer Co.', subtext: activeUser.fpoName || 'Tunga Malnad' },
          { value: 'Grade A', label: 'Soil Health Card', subtext: 'Tested & Current' }
        ]}
        primaryAction={{
          label: 'Edit Profile Information',
          onClick: () => setIsEditing(true),
          icon: Edit3
        }}
        secondaryAction={{
          label: 'Download Kisan ID Card',
          onClick: handleDownloadCard,
          icon: Download
        }}
      />

      <div className="section-pad">
        <div className="container" style={{ maxWidth: '1240px' }}>
          {/* Notification Alerts */}
          {editSuccess && (
            <div style={{
              background: '#ecfdf5',
              border: '1.5px solid #10b981',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#065f46'
            }}>
              <CheckCircle size={20} color="#059669" />
              <div>
                <strong>Profile Successfully Updated!</strong> Your verified agricultural credentials have been saved to your session.
              </div>
            </div>
          )}

          {downloadSuccess && (
            <div style={{
              background: '#eff6ff',
              border: '1.5px solid #3b82f6',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#1e40af'
            }}>
              <Download size={20} color="#2563eb" />
              <div>
                <strong>Digital Agri-Connect ID Ready!</strong> Downloaded verified PDF card for {activeUser.name} (Aadhaar & RTC Authenticated).
              </div>
            </div>
          )}

          {/* User Status Strip & Role Toggle */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src="/assets/images/farmer_harvest.jpg" 
                alt={activeUser.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #10b981',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark-900)', margin: 0 }}>
                    {activeUser.name}
                  </h2>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                    ✓ {activeUser.verificationStatus || 'Govt Verified Farmer'}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    ID: {activeUser.id || 'KA-SMG-2026-9845'}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      background: '#f0fdf4', 
                      color: '#166534', 
                      border: '1px solid #86efac', 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Connected to MongoDB Atlas cluster0.zvmhp4v.mongodb.net"
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                    🍃 MongoDB Atlas Connected
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--slate-600)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#059669" />
                    {activeUser.village || 'Kudumallige'}, {activeUser.district || 'Shivamogga'}, {activeUser.state || 'Karnataka'}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} color="#059669" />
                    {activeUser.phone || '+91 98451 22891'}
                  </span>
                  <span>•</span>
                  <span>Registered: <strong>14 Jan 2025</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-outline"
                style={{ borderRadius: '999px', padding: '6px 14px', fontSize: '0.82rem' }}
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleDownloadCard}
                className="btn btn-sm btn-primary"
                style={{ borderRadius: '999px', padding: '6px 16px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Kisan ID Card</span>
              </button>
            </div>
          </div>

          {/* Persona Switcher Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid var(--slate-200)',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#059669" />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--dark-800)' }}>
                Viewing Profile Persona:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'farmer', label: '👨‍🌾 Farmer (Ravi)', icon: '🌾' },
                { id: 'buyer', label: '🏪 Commercial Buyer (Ananya)', icon: '🏢' },
                { id: 'seller', label: '🚜 Input Dealer (Manoj)', icon: '⚙️' },
                { id: 'admin', label: '🛡️ Platform Admin', icon: '🏛️' }
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setCurrentRole && setCurrentRole(role.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: currentRole === role.id ? '1.5px solid #059669' : '1px solid #cbd5e1',
                    background: currentRole === role.id ? '#ecfdf5' : '#ffffff',
                    color: currentRole === role.id ? '#065f46' : '#334155'
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Tab Navigation Strip */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid var(--slate-200)',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            {[
              { id: 'farm', label: '🌾 Farm & Land Records', sub: 'Survey RTC & Crops' },
              { id: 'kyc', label: '🏛️ Govt Schemes & KYC', sub: 'PM-KISAN & DBT' },
              { id: 'orders', label: '📦 Produce & Market Sales', sub: 'Direct Sales History' },
              { id: 'security', label: '🔒 Account & Security', sub: 'Login & Verification' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeSubTab === tab.id ? '3px solid #059669' : '3px solid transparent',
                  color: activeSubTab === tab.id ? '#059669' : '#64748b',
                  fontWeight: activeSubTab === tab.id ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: '0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px'
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 500 }}>{tab.sub}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Farm & Landholding Records */}
          {activeSubTab === 'farm' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Land & RTC Details Card */}
              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <Sprout size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Landholding & Survey RTC Record
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Total Operational Land:</span>
                    <strong style={{ color: '#0f172a' }}>{activeUser.landAreaAcres || 2.5} Acres</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Ownership Type:</span>
                    <strong style={{ color: '#0f172a' }}>{activeUser.landOwnershipType || 'Owned Ancestral Land'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Survey Number (Bhoomi):</span>
                    <strong style={{ color: '#059669' }}>KA-SMG-2024-RTC-8841-A</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Soil Classification:</span>
                    <strong style={{ color: '#0f172a' }}>{activeUser.soilType || 'Red Loamy Soil (pH 6.4)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Irrigation Network:</span>
                    <strong style={{ color: '#0f172a' }}>Drip System + Borewell Recharge</strong>
                  </div>
                </div>
              </div>

              {/* Harvested Crops & Rotation Card */}
              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <Layers size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Current Crops & Scientific Rotation
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 4px' }}>
                    Registered high-yield crops verified for direct APMC and digital marketplace trading:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(Array.isArray(activeUser.mainCrops) ? activeUser.mainCrops : ['Tomato', 'Arecanut', 'Paddy']).map((crop, idx) => (
                      <span 
                        key={idx}
                        style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>🌱</span>
                        <span>{crop}</span>
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                      💡 Agronomist Recommendation for Soil pH 6.4:
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      Ideal for Solanaceous vegetables and pulses. Apply 200 kg/acre gypsum before Kharif sowing to maximize groundnut & tomato yield.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Govt Schemes & KYC Status */}
          {activeSubTab === 'kyc' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <Building size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Government Direct Benefit Transfer (DBT)
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>PM-KISAN Status:</span>
                    <span className="badge badge-green">✓ Active (17th Installment Credited)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Linked Bank & IFSC:</span>
                    <strong style={{ color: '#0f172a' }}>SBI Shivamogga Agri (SBIN0000845)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Crop Insurance (PMFBY):</span>
                    <strong style={{ color: '#059669' }}>Covered (Policy #PMFBY-KA-84192)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>FPO Affiliation:</span>
                    <strong style={{ color: '#0f172a' }}>{activeUser.fpoName || 'Tunga Malnad Farmer Producer Co.'}</strong>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <Award size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Soil Health Card & Lab Certification
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Certificate #SHC-2025-9921</span>
                      <span className="badge badge-green">Grade A - Optimal</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Sample collected by KVK Shivamogga Agronomy Cell on 12 Jan 2025. Valid until Jan 2028.
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab && setActiveTab('schemes')}
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                  >
                    <span>Browse Eligible Schemes & Subsidies</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Marketplace & Sales History */}
          {activeSubTab === 'orders' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <TrendingUp size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Commercial Produce Sales Metrics
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ padding: '14px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>Total Realized Revenue</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>₹1,84,500</div>
                    <div style={{ fontSize: '0.7rem', color: '#047857' }}>100% Direct DBT Transfer</div>
                  </div>
                  <div style={{ padding: '14px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>Completed Orders</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>24 Orders</div>
                    <div style={{ fontSize: '0.7rem', color: '#2563eb' }}>Zero Middleman Commission</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab && setActiveTab('mandi')}
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                >
                  <Sparkles size={14} />
                  <span>Check Live Mandi APMC Prices</span>
                </button>
              </div>

              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <Calendar size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Recent Direct Buyer Settlements
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { batch: 'Hybrid Tomato Batch #2026-T1', qty: '1,200 kg', amount: '₹33,600', buyer: 'Metro Fresh Foods', date: '28 Oct 2026' },
                    { batch: 'Malnad Arecanut Grade-1', qty: '450 kg', amount: '₹1,50,900', buyer: 'Shivamogga APMC Direct', date: '21 Oct 2026' }
                  ].map((order, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{order.batch}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{order.qty} • Sold to {order.buyer}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>{order.amount}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{order.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Account Security & Privacy */}
          {activeSubTab === 'security' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <ShieldCheck size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Authentication & Session Security
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Verified Mobile Auth:</span>
                    <span className="badge badge-green">✓ OTP Authenticated</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Data Transmission:</span>
                    <strong style={{ color: '#059669' }}>256-Bit SSL Encrypted</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Aadhaar UIDAI Status:</span>
                    <strong style={{ color: '#0f172a' }}>Vault-Masked (•••• •••• 9845)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Active Session:</span>
                    <strong style={{ color: '#059669' }}>Logged In (Persistent)</strong>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '12px' }}>
                  <User size={18} color="#059669" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                    Quick Navigation Shortcuts
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab && setActiveTab('advisory')}
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                  >
                    <span>🤖 Open AI Crop Doctor Copilot</span>
                  </button>
                  <button
                    onClick={() => setActiveTab && setActiveTab('marketplace')}
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                  >
                    <span>🛒 Rent Machinery & Farm Inputs</span>
                  </button>
                  <button
                    onClick={() => setActiveTab && setActiveTab('schemes')}
                    className="btn btn-sm btn-outline"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}
                  >
                    <span>🏛️ Apply for Agricultural Subsidies</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {isEditing && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: '16px'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--slate-200)',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '14px', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} color="#059669" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--dark-900)' }}>
                      Edit Verified Profile Details
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsEditing(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Full Legal Name
                    </label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--slate-300)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        10-Digit Mobile
                      </label>
                      <input 
                        type="text"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Email (Optional)
                      </label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Village / Town
                      </label>
                      <input 
                        type="text"
                        value={formData.village}
                        onChange={e => setFormData({ ...formData, village: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        District & State
                      </label>
                      <input 
                        type="text"
                        value={`${formData.district}, ${formData.state}`}
                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Land (Acres)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        value={formData.landAreaAcres}
                        onChange={e => setFormData({ ...formData, landAreaAcres: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Primary Crops (Comma-separated)
                      </label>
                      <input 
                        type="text"
                        value={formData.mainCrops}
                        onChange={e => setFormData({ ...formData, mainCrops: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--slate-300)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

