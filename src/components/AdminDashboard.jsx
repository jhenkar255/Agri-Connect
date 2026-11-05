import React, { useState } from 'react';
import { 
  ShieldCheck, Users, ShoppingBag, TrendingUp, CheckCircle, 
  XCircle, AlertTriangle, FileText, Lock, Eye, Download, ShieldAlert 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function AdminDashboard({ setActiveTab, currentLang = 'en' }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const admin = MOCK_USERS.admin;
  
  const [activeTab, setActiveTabLocal] = useState('approvals'); // 'approvals' | 'moderation' | 'wildlife' | 'audit'

  // Pending user KYC approvals state
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: 'usr-pend-1',
      name: 'Basavaraj Patil',
      role: 'Farmer',
      district: 'Mandya, Karnataka',
      landAcres: '3.2 Acres',
      crop: 'Sugarcane & Paddy',
      document: 'Pahani RTC Sy. No. 112/3 (Scanned PDF)',
      appliedDate: '30 Sep 2026',
      status: 'Pending'
    },
    {
      id: 'usr-pend-2',
      name: 'Cauvery Bio-Agro Inputs',
      role: 'Input Seller',
      district: 'Mysuru, Karnataka',
      landAcres: 'Retail Yard',
      crop: 'Bio-Fertilizer Dealer',
      document: 'Fertilizer Control Order (FCO) Lic. 2024-89',
      appliedDate: '29 Sep 2026',
      status: 'Pending'
    }
  ]);

  // Pending listings moderation
  const [pendingListings, setPendingListings] = useState([
    {
      id: 'mod-1',
      crop: 'High Grade Red Chilli (50 Quintals)',
      farmer: 'Venkat Reddy (Guntur)',
      price: '₹185 / Kg',
      claim: 'Pesticide-Free Residue Tested',
      status: 'Pending'
    },
    {
      id: 'mod-2',
      crop: 'Paddy Straw Bales (100 Tons)',
      farmer: 'Sardar Baldev Singh (Karnal)',
      price: '₹1,800 / Ton',
      claim: 'Moisture 11% (Anti-Burning Lot)',
      status: 'Pending'
    }
  ]);

  const handleApproveUser = (id) => {
    setPendingUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Approved' } : u));
  };

  const handleRejectUser = (id) => {
    setPendingUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Rejected' } : u));
  };

  const handleApproveListing = (id) => {
    setPendingListings(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={ShieldCheck}
        badgeText="Root System Administration • Security, Moderation & KYC Audit"
        badgeColor="purple"
        title={t.dashAdminTitle || "Central Administration"}
        titleHighlight="(Command Control)"
        description="System-wide oversight: verify farmer landownership RTC titles, review pesticide-free marketplace claims, monitor wildlife emergency reports, and audit escrow transactions."
        breadcrumbs={[
          { label: 'Home', onClick: () => setActiveTab && setActiveTab('home') },
          { label: 'Admin Command Control' }
        ]}
        imageSrc={admin.avatar || "/assets/images/hero_banner.jpg"}
        imageAlt="Platform Administrator"
        imageBadgeText="Govt Verified SuperAdmin"
        floatingStat={{
          label: 'System Health Status',
          value: '100% Secure',
          icon: CheckCircle
        }}
        stats={[
          { value: '2,40,000+', label: 'Registered Farmers', subtext: 'KYC Verified' },
          { value: '₹18.4 Cr', label: 'Escrow Volume', subtext: 'Zero Fraud Rate' },
          { value: '2,840+', label: 'APMC Mandis', subtext: 'Live Sync Gateway' },
          { value: '4 Pending', label: 'KYC Verifications', subtext: 'Action Needed' }
        ]}
        primaryAction={{
          label: 'Audit Escrow Logs',
          onClick: () => setActiveTabLocal('audit'),
          icon: FileText
        }}
        secondaryAction={{
          label: 'Review KYC Documents',
          onClick: () => setActiveTabLocal('approvals'),
          icon: ShieldCheck
        }}
        quickChips={[
          { id: 'approvals', label: '📋 Farmer KYC Approvals' },
          { id: 'moderation', label: '🔍 Listing Moderation' },
          { id: 'wildlife', label: '🚨 Wildlife Incidents' },
          { id: 'audit', label: '🔒 Financial Audit Log' }
        ]}
        activeChip={activeTab}
        onChipClick={(id) => setActiveTabLocal(id)}
      />

      <div className="section-pad">
        <div className="container">
        
        {/* Admin Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #dc2626, #991b1b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--dark-900)' }}>
                  {t.dashAdminTitle || 'Agri-Connect Central Administration'}
                </h2>
                <span className="badge badge-red">
                  SuperAdmin
                </span>
              </div>
              <small style={{ color: 'var(--slate-600)', fontSize: '0.84rem' }}>
                {t.dashAdminSub || 'National Agri Telemetry & Governance Dashboard'} • {admin.name}
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid #fca5a5' }}>
            <Lock size={14} color="#dc2626" />
            <span style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: 700 }}>
              Audit Log Active • Role-Based Protected
            </span>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>{t.statFarmers || 'Verified Farmers'}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-800)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              12,540
            </div>
            <small style={{ color: '#059669', fontWeight: 700 }}>Across 11 Indian States</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>{t.statVerifiedSuppliers || 'Commercial Buyers'}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--info-600)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              1,820
            </div>
            <small style={{ color: 'var(--slate-600)' }}>Retail chains, exporters, SHGs</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>{t.statVolume || 'Produce Trade Volume'}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--amber-600)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              ₹28.4 Cr
            </div>
            <small style={{ color: '#059669', fontWeight: 700 }}>Zero middleman commission</small>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-600)', textTransform: 'uppercase', fontWeight: 700 }}>{t.statMandis || 'Active Mandis Synced'}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark-900)', fontFamily: 'var(--font-heading)', margin: '4px 0' }}>
              450 Mandis
            </div>
            <small style={{ color: 'var(--slate-600)' }}>e-NAM API Gateway live</small>
          </div>

        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTabLocal('approvals')}
            className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <span>KYC & License Approvals ({pendingUsers.filter(u => u.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('moderation')}
            className={`btn ${activeTab === 'moderation' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <span>Produce Moderation ({pendingListings.filter(l => l.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTabLocal('audit')}
            className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <span>Audit Trail & Security Logs</span>
          </button>
        </div>

        {/* TAB 1: USER APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Pending Farmer KYC & Dealer Licenses</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingUsers.map((user) => (
                <div key={user.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--dark-900)' }}>{user.name}</span>
                      <span className="badge badge-amber">{user.role}</span>
                      <span className="badge" style={{ background: user.status === 'Approved' ? '#dcfce7' : user.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: user.status === 'Approved' ? '#166534' : user.status === 'Rejected' ? '#991b1b' : '#b45309' }}>
                        {user.status}
                      </span>
                    </div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.78rem', display: 'block', marginTop: '2px' }}>
                      {user.district} • Land: {user.landAcres} • Applied: {user.appliedDate}
                    </small>
                    <div style={{ fontSize: '0.76rem', color: 'var(--primary-800)', marginTop: '4px' }}>
                      Attached Proof: <strong>{user.document}</strong>
                    </div>
                  </div>

                  {user.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleApproveUser(user.id)}
                        className="btn btn-sm btn-primary"
                        style={{ padding: '6px 14px' }}
                      >
                        <CheckCircle size={14} />
                        <span>Approve & Verify</span>
                      </button>
                      <button 
                        onClick={() => handleRejectUser(user.id)}
                        className="btn btn-sm btn-outline"
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: user.status === 'Approved' ? '#16a34a' : '#dc2626' }}>
                      Status: {user.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCE MODERATION */}
        {activeTab === 'moderation' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Harvest & Residue Listings Moderation Queue</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingListings.map((item) => (
                <div key={item.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>{item.crop}</div>
                    <small style={{ color: 'var(--slate-600)', fontSize: '0.78rem' }}>
                      Farmer: {item.farmer} • Price: {item.price}
                    </small>
                    <div style={{ fontSize: '0.76rem', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
                      Verification Claim: {item.claim}
                    </div>
                  </div>

                  {item.status === 'Pending' ? (
                    <button 
                      onClick={() => handleApproveListing(item.id)}
                      className="btn btn-sm btn-primary"
                    >
                      <CheckCircle size={14} />
                      <span>Verify & Publish</span>
                    </button>
                  ) : (
                    <span className="badge badge-green">✓ Published Live</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL LOGS */}
        {activeTab === 'audit' && (
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>Platform Immutable Security & Audit Log</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                [2026-09-30 22:15:02] ADMIN_LOGIN: Dr. Srinivas Rao authenticated via 2FA token from Bengaluru HQ.
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                [2026-09-30 21:50:44] MANDI_SYNC: 450 APMC endpoints updated successfully via Agmarknet gateway.
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
                [2026-09-30 20:30:19] ORDER_SETTLEMENT: ₹12,000 escrow released to Farmer Ravi Kumar (Order #8812).
              </div>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                [2026-09-30 19:12:10] SCHEME_VERIFIED: PM-KISAN 19th installment advisory updated.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
