import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Sparkles, CheckCircle2, Maximize2 } from 'lucide-react';

export default function VideoTourModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);

  if (!isOpen) return null;

  const chapters = [
    {
      title: '1. Autonomous Precision Spraying & Drone Tech',
      desc: 'High-payload DGCA drones delivering 95% water savings and ultra-fine pesticide micro-droplets on Indian crop canopies.',
      time: '0:00 - 0:45'
    },
    {
      title: '2. Kisan AI Vision Pathology Scan',
      desc: 'Instant leaf lesion scanning on smartphones detecting Early Blight, Koleroga, and leaf curl with 94%+ diagnostic precision.',
      time: '0:45 - 1:15'
    },
    {
      title: '3. Direct-to-Buyer Farm Logistics',
      desc: 'Bypassing exploitative 30% middleman APMC cess, connecting organic vegetable and grain growers with supermarket supply chains.',
      time: '1:15 - 1:45'
    },
    {
      title: '4. Surplus Rescue & Wealth from Stubble',
      desc: 'Turning crashed ₹4/kg tomatoes into ₹95/kg puree and transforming paddy straw into mushroom substrate instead of burning.',
      time: '1:45 - 2:15'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}>
        
        {/* Video Player Header Bar */}
        <div style={{ background: '#090d16', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#34d399" />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Agri-Connect Official Ecosystem Video Tour</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Video Presentation Screen / Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Visual Showcase based on active chapter */}
          <img 
            src={
              currentChapter === 0 ? '/assets/images/hero_banner.jpg' :
              currentChapter === 1 ? '/assets/images/ai_diagnosis.jpg' :
              '/assets/images/surplus_value.jpg'
            }
            alt="Agriculture Showcase"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          />

          {/* Video Overlay Tint */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)' }} />

          {/* Playing Badge */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse-danger 1.5s infinite' }} />
            <span style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 700 }}>4K ULTRA HD • 60 FPS</span>
          </div>

          {/* Center Play Overlay Text */}
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: '#fff' }}>
            <span className="badge badge-green" style={{ marginBottom: '6px', background: 'rgba(16, 185, 129, 0.4)', color: '#a7f3d0' }}>
              {chapters[currentChapter].title}
            </span>
            <p style={{ fontSize: '0.94rem', color: '#e2e8f0', lineHeight: 1.45, maxWidth: '640px' }}>
              {chapters[currentChapter].desc}
            </p>
          </div>
        </div>

        {/* Video Chapters Selector */}
        <div style={{ padding: '20px 24px', background: '#0f172a', color: '#fff' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>
            Interactive Chapters (Click to Jump):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentChapter(idx)}
                style={{
                  background: currentChapter === idx ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid',
                  borderColor: currentChapter === idx ? '#10b981' : 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: currentChapter === idx ? '#a7f3d0' : '#cbd5e1'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginBottom: '2px' }}>{ch.time}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.3 }}>{ch.title.split('.')[1]}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
