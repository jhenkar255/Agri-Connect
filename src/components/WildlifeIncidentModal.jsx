import React, { useState } from 'react';
import { 
  ShieldAlert, PhoneCall, CheckCircle, Camera, MapPin, 
  X, AlertTriangle, FileText, Download 
} from 'lucide-react';

export default function WildlifeIncidentModal({ isOpen, onClose }) {
  const [incidentType, setIncidentType] = useState('Crop Damage (Wild Elephants)');
  const [animalType, setAnimalType] = useState('Elephant Herd (5-6 animals)');
  const [location, setLocation] = useState('Kudumallige Village, Thirthahalli, Shivamogga');
  const [description, setDescription] = useState('Elephant herd entered arecanut and banana plantation at 03:00 AM, trampled 45 arecanut trees and destroyed 120 banana bunches.');
  const [contactPhone, setContactPhone] = useState('+91 98451 22891');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = 'WL-KA-2026-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedRefId(token);
    setIsSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={24} color="#dc2626" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#991b1b' }}>Wildlife Incident & Compensation Support</h3>
              <small style={{ color: 'var(--slate-600)' }}>Document crop damage or livestock loss for Forest Department Ex-Gratia Claim</small>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Emergency Speed Dial Notice */}
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 14px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>State Forest Department 24/7 Control Room:</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626' }}>Toll-Free Helpline: 1926</div>
          </div>
          <a href="tel:1926" className="btn btn-sm btn-emergency" style={{ padding: '6px 14px' }}>
            <PhoneCall size={14} />
            <span>Call 1926 Now</span>
          </a>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={36} />
            </div>

            <h4 style={{ fontSize: '1.3rem', color: '#166534', marginBottom: '4px' }}>
              Incident Dossier Created!
            </h4>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-800)', margin: '8px 0' }}>
              Incident Reference Token: {generatedRefId}
            </div>
            
            <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', lineHeight: 1.55, maxWidth: '480px', margin: '0 auto 18px' }}>
              Your damage report has been logged and queued for electronic transmission to the <strong>Thirthahalli Range Forest Officer (RFO)</strong>. An automated SMS confirmation has been sent to {contactPhone}.
            </p>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '20px' }}>
              <strong>Next Immediate Steps for Compensation:</strong>
              <ol style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Do not clean up or alter the damaged spot until RFO conducts Spot Mahazar.</li>
                <li>Keep your Pahani/RTC land document and Bank Passbook ready.</li>
                <li>Inspection officer will visit within 48 hours to complete formal claim verification.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} className="btn btn-outline" style={{ flex: 1 }}>
                <Download size={15} />
                <span>Print Dossier Summary</span>
              </button>
              <button onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Incident Type:</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}
                >
                  <option value="Crop Damage (Wild Elephants)">Crop Damage (Wild Elephants)</option>
                  <option value="Crop Depredation (Wild Boars)">Crop Depredation (Wild Boars)</option>
                  <option value="Livestock Loss (Leopard / Tiger)">Livestock Loss (Leopard / Tiger)</option>
                  <option value="Physical Injury / Medical">Physical Injury / Medical</option>
                  <option value="Fence & Irrigation Property Damage">Fence & Irrigation Property Damage</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Animal Involved:</label>
                <input
                  type="text"
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Exact Farm Location & Taluk:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Description of Damage Observed:</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Farmer Contact Phone Number:</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)' }}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px dashed var(--slate-300)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <Camera size={18} color="var(--primary-700)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                Attach Photos / Video Evidence (Simulated geo-tagged upload)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Submit Wildlife Incident Report
              </button>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
