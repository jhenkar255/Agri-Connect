import React from 'react';
import { ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PageBanner({
  badgeIcon: BadgeIcon = Sparkles,
  badgeText,
  badgeColor = 'green',
  title,
  titleHighlight,
  description,
  breadcrumbs = [],
  stats = [],
  imageSrc,
  imageAlt = 'Agricultural illustration',
  imageBadgeText,
  floatingStat,
  primaryAction,
  secondaryAction,
  quickChips = [],
  activeChip,
  onChipClick,
  customRightCard = null,
  bgGradient
}) {
  const badgeStyles = {
    green: {
      bg: 'rgba(16, 185, 129, 0.22)',
      border: 'rgba(52, 211, 153, 0.45)',
      text: '#ecfdf5',
      dot: '#34d399'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.22)',
      border: 'rgba(251, 191, 36, 0.45)',
      text: '#fffbeb',
      dot: '#fbbf24'
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.22)',
      border: 'rgba(96, 165, 250, 0.45)',
      text: '#eff6ff',
      dot: '#60a5fa'
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.22)',
      border: 'rgba(192, 132, 252, 0.45)',
      text: '#faf5ff',
      dot: '#c084fc'
    }
  }[badgeColor] || {
    bg: 'rgba(16, 185, 129, 0.22)',
    border: 'rgba(52, 211, 153, 0.45)',
    text: '#ecfdf5',
    dot: '#34d399'
  };

  return (
    <div 
      className="page-hero-banner"
      style={{
        position: 'relative',
        background: bgGradient || 'linear-gradient(135deg, rgba(6, 78, 59, 0.96) 0%, rgba(15, 23, 42, 0.94) 100%)',
        color: '#ffffff',
        padding: '48px 0 52px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      {/* Decorative dot matrix background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Breadcrumb Navigation Strip */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '14px', flexWrap: 'wrap' }}>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    style={{ background: 'none', border: 'none', color: '#a7f3d0', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight size={13} style={{ opacity: 0.6 }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="page-hero-grid">
          {/* Left Column: Heading, Subtitle, Key Values & CTA buttons */}
          <div>
            {badgeText && (
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: badgeStyles.bg, 
                  border: `1px solid ${badgeStyles.border}`, 
                  color: badgeStyles.text, 
                  padding: '5px 14px', 
                  borderRadius: 'var(--radius-full)', 
                  marginBottom: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeStyles.dot, display: 'inline-block', boxShadow: `0 0 10px ${badgeStyles.dot}`, flexShrink: 0 }} />
                {BadgeIcon && <BadgeIcon size={14} />}
                <span>{badgeText}</span>
              </div>
            )}

            <h1 className="page-hero-title">
              {title} {titleHighlight && <span>{titleHighlight}</span>}
            </h1>

            {description && (
              <p className="page-hero-desc">
                {description}
              </p>
            )}

            {/* Quick Action Buttons */}
            {(primaryAction || secondaryAction) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="btn btn-lg btn-amber"
                    style={{ fontWeight: 700, boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)' }}
                  >
                    {primaryAction.icon && <primaryAction.icon size={18} />}
                    <span>{primaryAction.label}</span>
                  </button>
                )}

                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="btn btn-lg btn-outline-white"
                  >
                    {secondaryAction.icon && <secondaryAction.icon size={18} />}
                    <span>{secondaryAction.label}</span>
                  </button>
                )}
              </div>
            )}

            {/* Quick Filter Chips (Optional) */}
            {quickChips && quickChips.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Quick Browse:</span>
                {quickChips.map((chip, idx) => {
                  const isChipActive = activeChip === chip.id || activeChip === chip.label || (typeof activeChip === 'string' && chip.id && activeChip.toLowerCase().includes(chip.id.toLowerCase()));
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onChipClick && onChipClick(chip.id || chip.label)}
                      style={{
                        background: isChipActive ? 'rgba(52, 211, 153, 0.28)' : 'rgba(255, 255, 255, 0.08)',
                        border: isChipActive ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.16)',
                        color: isChipActive ? '#fef08a' : '#f1f5f9',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Floating Highlights Bar */}
            {stats && stats.length > 0 && (
              <div className="page-hero-stats-row">
                {stats.map((s, idx) => (
                  <div key={idx} className="page-hero-stat-box">
                    <div className="page-stat-val">{s.value}</div>
                    <div className="page-stat-lbl">{s.label}</div>
                    {s.subtext && <div className="page-stat-sub">{s.subtext}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Visual Photographic Showcase or Custom Interactive Card */}
          <div>
            {customRightCard ? (
              customRightCard
            ) : imageSrc ? (
              <div className="page-hero-media-card">
                <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(6, 78, 59, 0.55) 100%)'
                    }}
                  />
                  
                  {/* Top Badge on Image */}
                  {imageBadgeText && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        background: 'rgba(15, 23, 42, 0.78)',
                        backdropFilter: 'blur(10px)',
                        color: '#fef08a',
                        border: '1px solid rgba(254, 240, 138, 0.35)',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={13} color="#34d399" />
                      <span>{imageBadgeText}</span>
                    </div>
                  )}

                  {/* Bottom Floating Stat Chip */}
                  {floatingStat && (
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        color: 'var(--dark-900)',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      {floatingStat.icon && (
                        <div style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                          <floatingStat.icon size={18} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-800)', lineHeight: 1.1 }}>
                          {floatingStat.value}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                          {floatingStat.label}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
