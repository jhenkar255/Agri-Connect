import React, { useState } from 'react';
import { 
  ShieldCheck, Check, Heart, X, Sparkles, AlertCircle, FileCheck, ArrowRight 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/languages';

export default function FarmerFundModal({ isOpen, onClose, currentLang = 'en' }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [applicantName, setApplicantName] = useState('Ravi Kumar');
  const [landAcres, setLandAcres] = useState('1.25');
  const [annualIncome, setAnnualIncome] = useState('42000');
  const [requestedSupport, setRequestedSupport] = useState('Free High-Yield Seed Kit & Bio-Fertilizer Package');
  const [fpoRecommendation, setFpoRecommendation] = useState('Tunga Malnad Farmer Producer Co. (Verified)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [grantToken, setGrantToken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = 'AGRI-FUND-2026-' + Math.floor(1000 + Math.random() * 9000);
    setGrantToken(token);
    setIsSuccess(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} color="#b45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--earth-800)' }}>
                Agri-Connect Farmer Support Grant Programme
              </h3>
              <small style={{ color: 'var(--slate-600)' }}>
                Targeted assistance for smallholders (&lt; 1.5 Acres & Income &lt; ₹50,000)
              </small>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={36} />
            </div>

            <h4 style={{ fontSize: '1.3rem', color: '#166534', marginBottom: '6px' }}>
              Application Successfully Registered!
            </h4>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-800)', margin: '8px 0' }}>
              Grant Application Token: {grantToken}
            </div>
            
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '20px' }}>
              Your application for <strong>{requestedSupport}</strong> has been forwarded to the local FPO verification committee. Upon physical inspection of cultivation proof, the input kit will be dispatched to your village cooperative center.
            </p>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Return to Platform
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '12px 16px', borderRadius: '10px', fontSize: '0.82rem', color: '#065f46', marginBottom: '18px' }}>
              <strong>Program Criteria:</strong> Annual farm income &le; ₹50,000 • Landholding &le; 1.5 Acres • Priority for women farmers, tenant farmers, and climate-affected dryland areas.
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Applicant Farmer Name:</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Total Landholding (Acres):</label>
                  <input
                    type="number"
                    step="0.05"
                    value={landAcres}
                    onChange={(e) => setLandAcres(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Annual Household Income (₹):</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Recommending FPO / SHG / NGO:</label>
                  <input
                    type="text"
                    value={fpoRecommendation}
                    onChange={(e) => setFpoRecommendation(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Desired Support Package (100% Subsidized):</label>
                <select
                  value={requestedSupport}
                  onChange={(e) => setRequestedSupport(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                >
                  <option value="Free Organic Fertilizer & Seed Kit (200kg Vermicompost + 50kg Neem Cake + Bio-NPK + Certified Seeds)">Free Organic Fertilizer & Seed Kit (200kg Vermicompost + 50kg Neem Cake + Bio-NPK + Certified Seeds)</option>
                  <option value="Free Fertilizer Application Tools & 16L Battery Knapsack Sprayer + Wheel Hoe">Free Fertilizer Application Tools & 16L Battery Knapsack Sprayer + Wheel Hoe</option>
                  <option value="Micro Drip Irrigation Starter Kit (0.5 Acre) for Water Saving">Micro Drip Irrigation Starter Kit (0.5 Acre) for Water Saving</option>
                  <option value="Rapid Soil Testing Kit & Heavy Metal Lab Voucher">Rapid Soil Testing Kit & Heavy Metal Lab Voucher</option>
                  <option value="Perishable Post-Harvest Storage Crates & Mini Solar Dryer">Perishable Post-Harvest Storage Crates & Mini Solar Dryer</option>
                </select>
              </div>

              {/* Mandatory Valid Proofs Verification Checklist */}
              <div style={{ background: '#f8fafc', border: '1px solid var(--slate-200)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck size={16} color="var(--primary-700)" />
                  <span>Mandatory Valid Proofs Required for Verification:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked required />
                    <span><strong>1. Landholding Proof:</strong> RTC / Pahani / 7/12 copy confirming &lt; 1.5 acres</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked required />
                    <span><strong>2. Income Proof:</strong> Tahsildar / Revenue Inspector Certificate confirming income &lt; ₹50,000/yr</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked required />
                    <span><strong>3. Identity Proof:</strong> Aadhaar Card copy (DBT / NPCI bank active)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked required />
                    <span><strong>4. Financial Proof:</strong> Bank Passbook copy with clear Account Number and IFSC</span>
                  </label>
                </div>
              </div>

              {(parseFloat(landAcres) > 1.5 || parseFloat(annualIncome) > 50000) && (
                <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={15} />
                  <span>Note: Special committee review required as values exceed standard thresholds (&le; 1.5 acres, &le; ₹50,000).</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Support Fund Request
                </button>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
