import React, { useState } from 'react';
import { 
  Building, MapPin, CheckCircle2, Clock, Calendar, 
  ExternalLink, MessageSquare, AlertCircle, Sparkles, Filter 
} from 'lucide-react';
import { INFRA_PROJECTS } from '../data/projectsData';
import { TRANSLATIONS } from '../data/languages';
import PageBanner from './PageBanner';

export default function InfrastructureTracker({ currentLang }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feedbackProject, setFeedbackProject] = useState(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const categories = ['All', 'Irrigation & Canals', 'Cold Storage & Processing', 'Solar Power & Energy', 'Watershed & Rainwater Harvesting', 'Market Yards & Logistics'];

  const filteredProjects = INFRA_PROJECTS.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleSendFeedback = (e) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackProject(null);
      setFeedbackNote('');
    }, 2000);
  };

  return (
    <>
      {/* High-Impact Photographic Page Hero Banner */}
      <PageBanner
        badgeIcon={Building}
        badgeText="Public Transparency & NABARD Rural Infrastructure Tracker"
        badgeColor="blue"
        title={t.infraTitle || "Infrastructure Projects"}
        titleHighlight="& Cold-Chain Warehouses"
        description={t.infraDesc || "Track government and NABARD-funded irrigation canals, cold storages, solar micro-grids, and drone logistics hubs across rural districts with citizen verification."}
        breadcrumbs={[
          { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
          { label: 'Rural Infrastructure Tracker' }
        ]}
        imageSrc="/assets/images/hero_banner.jpg"
        imageAlt="Rural agricultural infrastructure and smart solar equipment"
        imageBadgeText="₹42.8 Cr Approved Projects"
        floatingStat={{
          label: 'Avg Project Delivery',
          value: '92% On-Track',
          icon: CheckCircle2
        }}
        stats={[
          { value: '₹42.8 Cr', label: 'Allocated Outlay', subtext: 'NABARD & AIF Funds' },
          { value: '18 Facilities', label: 'Active Cold Storages', subtext: 'Geotagged & Audited' },
          { value: '100% Public', label: 'Transparency Logs', subtext: 'Citizen Feedback' },
          { value: '14,000 Ha', label: 'Drip Network Added', subtext: 'Water Security' }
        ]}
        primaryAction={{
          label: 'View Geotagged Projects',
          onClick: () => {
            const el = document.querySelector('.projects-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          },
          icon: MapPin
        }}
        secondaryAction={{
          label: 'Report Field Progress',
          onClick: () => alert('Citizen field inspection portal loaded. Thank you for reporting real progress.'),
          icon: Sparkles
        }}
        quickChips={categories.map(c => ({ id: c, label: c }))}
        activeChip={selectedCategory}
        onChipClick={(cat) => setSelectedCategory(cat)}
      />

      <div className="section-pad">
        <div className="container">

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: '0.84rem' }}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredProjects.map((proj) => {
            const isCompleted = proj.progressPercent === 100;
            return (
              <div key={proj.id} className="glass-card glass-card-hover" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <span className="badge badge-green">{proj.category}</span>
                  <span 
                    className="badge" 
                    style={{
                      background: isCompleted ? '#dcfce7' : '#fef3c7',
                      color: isCompleted ? '#166534' : '#b45309'
                    }}
                  >
                    {isCompleted ? '✓ Completed' : '⚙️ Ongoing Work'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--dark-900)' }}>
                  {proj.title}
                </h3>

                <small style={{ color: 'var(--slate-600)', fontSize: '0.78rem', marginBottom: '12px', display: 'block' }}>
                  Implementing Agency: <strong>{proj.agency}</strong>
                </small>

                {/* Progress bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark-800)', marginBottom: '4px' }}>
                    <span>Project Completion:</span>
                    <span style={{ color: 'var(--primary-700)' }}>{proj.progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${proj.progressPercent}%`, height: '100%', background: isCompleted ? '#10b981' : '#f59e0b', borderRadius: '4px' }} />
                  </div>
                </div>

                {/* Specs Box */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--primary-700)" />
                    <span><strong>Location:</strong> {proj.location}</span>
                  </div>
                  <div>• <strong>Sanctioned Budget:</strong> {proj.budget}</div>
                  <div>• <strong>Timeline:</strong> {proj.startDate} → {proj.expectedCompletion}</div>
                  <div>• <strong>Target Beneficiaries:</strong> {proj.beneficiaryFarmers}</div>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.55, marginBottom: '16px', flex: 1 }}>
                  <strong>Farmer Benefits:</strong> {proj.farmerBenefits}
                </p>

                {/* Recent updates log */}
                {proj.updates && proj.updates.length > 0 && (
                  <div style={{ background: '#ecfdf5', padding: '10px 12px', borderRadius: '8px', fontSize: '0.74rem', color: '#065f46', marginBottom: '16px' }}>
                    <strong>Latest Milestone ({proj.updates[0].date}):</strong> {proj.updates[0].text}
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--slate-100)' }}>
                  <a 
                    href={proj.officialSource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => setFeedbackProject(proj)}
                    className="btn btn-sm btn-primary"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    <MessageSquare size={13} />
                    <span>Citizen Feedback</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Citizen Feedback Modal */}
      {feedbackProject && (
        <div className="modal-backdrop" onClick={() => setFeedbackProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={22} color="var(--primary-800)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Submit Ground Reality Field Feedback</h3>
                <small style={{ color: 'var(--slate-600)' }}>Project: {feedbackProject.title}</small>
              </div>
            </div>

            {feedbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '8px' }}>Feedback Registered!</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem' }}>
                  Your ground verification note has been logged with reference token <strong>FB-INFRA-{Math.floor(1000 + Math.random() * 9000)}</strong> and routed to the public vigilance cell.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Feedback Category:</label>
                  <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', background: '#fff' }}>
                    <option>Canal water reached our village land</option>
                    <option>Construction delay noticed on branch canal</option>
                    <option>Cold storage space needed for vegetable cluster</option>
                    <option>Praise for excellent quality work</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>Your Village & Observations:</label>
                  <textarea
                    rows="4"
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    required
                    placeholder="Provide details about the local benefit or issues observed on site..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Submit Field Report
                  </button>
                  <button type="button" onClick={() => setFeedbackProject(null)} className="btn btn-outline">
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
