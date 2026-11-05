import React, { useState, useEffect } from 'react';
import { 
  Sprout, Globe, ShoppingCart, User, PhoneCall, ShieldAlert, 
  Menu, X, CheckCircle, ChevronDown, Sparkles, LayoutDashboard, LogIn, LogOut, MoreHorizontal 
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/languages';
import { MOCK_USERS } from '../data/mockUsers';

export default function Navbar({ 
  currentLang, 
  setCurrentLang, 
  activeTab, 
  setActiveTab, 
  currentRole, 
  setCurrentRole, 
  cartCount, 
  setIsCartOpen,
  setIsAuthOpen,
  setIsWildlifeModalOpen,
  setIsVideoTourOpen,
  userProfile,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const user = userProfile || MOCK_USERS[currentRole] || MOCK_USERS.farmer;

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    try {
      window.location.hash = tabId;
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setUserMenuOpen(false);
  };

  const toggleMoreDropdown = (e) => {
    if (e) e.stopPropagation();
    setMoreDropdownOpen(prev => !prev);
    setUserMenuOpen(false);
  };

  const toggleUserMenu = (e) => {
    if (e) e.stopPropagation();
    setUserMenuOpen(prev => !prev);
    setMoreDropdownOpen(false);
  };

  // Close open dropdowns when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-more-wrapper') && !e.target.closest('.nav-user-wrapper')) {
        setMoreDropdownOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: 'home', label: t.navHome || 'Home' },
    { id: 'advisory', label: t.navAdvisory || 'AI Advisory' },
    { id: 'mandi', label: t.navMandi || 'Mandi Rates' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'schemes', label: t.navSchemes || 'Govt Schemes' },
    ...(!userProfile?.isLoggedIn ? [{ id: 'login', label: '🔑 Login / Register' }] : []),
  ];

  const moreNavItems = [
    { id: 'profile', label: t.navProfile || 'Profile View', icon: '👤' },
    { id: 'dashboard', label: t.navDashboard || 'Dashboard', icon: '📊' },
    { id: 'roadmap', label: t.navRoadmap || 'Future Roadmap & Offline Plan', icon: '🚀' },
    { id: 'community', label: t.navCommunity, icon: '👥' },
    { id: 'surplus', label: t.navSurplus, icon: '🥫' },
    { id: 'waste', label: t.navWaste, icon: '🌾' },
    { id: 'projects', label: t.navProjects, icon: '🏗️' }
  ];

  const isMoreActive = ['profile', 'dashboard', 'roadmap', 'community', 'surplus', 'waste', 'projects'].includes(activeTab);

  return (
    <header className="navbar-wrapper">
      {/* Top Emergency & Helpline Bar */}
      <div className="top-bar-emergency">
        <div className="container top-bar-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <PhoneCall size={14} />
            <span>{t.emergencyHelpline}</span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span>Wildlife Forest Control: <strong>1926</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleNavClick('roadmap')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.22)', 
                border: '1px solid rgba(255, 255, 255, 0.45)', 
                color: '#fff', 
                fontSize: '0.74rem', 
                fontWeight: 700, 
                padding: '3px 12px', 
                borderRadius: '999px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px' 
              }}
            >
              <span>🚀 Offline-First & Future Plan</span>
            </button>

            <button 
              onClick={() => setIsWildlifeModalOpen(true)}
              className="btn btn-sm btn-emergency"
              style={{ padding: '3px 10px', fontSize: '0.74rem' }}
            >
              <ShieldAlert size={13} />
              <span>{t.btnReportWildlife}</span>
            </button>

            <button 
              onClick={() => setIsVideoTourOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
            >
              <Sparkles size={13} />
              <span>{t.heroWatchTour}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Multilingual Language Switcher Strip - 100% Unmissable */}
      <div className="top-language-bar">
        <div className="container top-language-content">
          <div className="top-language-label">
            <Globe size={14} style={{ color: 'var(--primary-400)', flexShrink: 0 }} />
            <span>{t.langPrompt || 'Language / भाषा / ಭಾಷೆ:'}</span>
          </div>

          <div className="top-language-pills" role="radiogroup" aria-label="Select website language">
            {LANGUAGES.map((lang) => {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setCurrentLang(lang.code)}
                  className={`top-lang-pill ${isActive ? 'active' : ''}`}
                  aria-checked={isActive}
                  title={`Switch language to ${lang.name}`}
                >
                  <span style={{ fontSize: '0.9rem' }}>{lang.flag}</span>
                  <span className="lang-text">{lang.native}</span>
                  {isActive && <CheckCircle size={11} className="lang-check" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <nav className="navbar-sticky">
        <div className="container navbar-inner">
          {/* Logo & Brand */}
          <div 
            className="nav-brand" 
            onClick={() => handleNavClick('home')} 
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <div className="nav-brand-logo">
              <Sprout size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.24rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Agri-Connect</span>
                <span className="badge badge-green" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>Govt Verified</span>
              </div>
              <small className="nav-brand-tagline" style={{ fontSize: '0.67rem', color: 'var(--slate-600)', fontWeight: 500, display: 'block', marginTop: '-2px' }}>
                {t.tagline}
              </small>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <ul className="nav-links">
            {primaryNavItems.map((item) => (
              <li key={item.id}>
                <button
                  id={item.id === 'login' ? 'nav-login-register-btn' : undefined}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}

            {/* "Explore More" Dropdown */}
            <li className="nav-more-wrapper" style={{ position: 'relative' }}>
              <button
                onClick={toggleMoreDropdown}
                className={`nav-item-btn ${isMoreActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>
                  {{
                    kn: 'ಇನ್ನಷ್ಟು',
                    te: 'మరిన్ని',
                    ta: 'மேலும்',
                    ml: 'കൂടുതൽ',
                    hi: 'अन्य सुविधाएं',
                    en: 'More'
                  }[currentLang] || 'More'}
                </span>
                <ChevronDown size={14} style={{ transform: moreDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '215px',
                    padding: '8px',
                    zIndex: 250,
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff',
                    border: '1px solid var(--slate-200)'
                  }}
                >
                  {moreNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: activeTab === item.id ? 'var(--primary-100)' : 'transparent',
                        color: activeTab === item.id ? 'var(--primary-800)' : 'var(--dark-800)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        textAlign: 'left'
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Right Action Bar */}
          <div className="nav-actions">
            {/* Language Selector Pill */}
            <div className="nav-lang-picker">
              <Globe size={15} color="var(--primary-700)" style={{ flexShrink: 0 }} />
              <select
                value={currentLang}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = LANGUAGES.find(l => l.code === val || `${l.flag} ${l.native}` === val || l.native === val || l.name === val);
                  setCurrentLang(match ? match.code : val);
                }}
                className="nav-lang-select"
                aria-label="Language Selector"
              >
                {LANGUAGES.map((lang) => {
                  const labelStr = `${lang.flag} ${lang.native}`;
                  return (
                    <React.Fragment key={lang.code}>
                      <option value={lang.code} label={labelStr}>
                        {labelStr}
                      </option>
                      <option value={labelStr} label={labelStr} style={{ display: 'none' }}>
                        {labelStr}
                      </option>
                    </React.Fragment>
                  );
                })}
              </select>
            </div>

            {userProfile?.isLoggedIn && (
              <div className="nav-user-wrapper" style={{ position: 'relative' }}>
                <button
                  id="nav-user-profile-btn"
                  type="button"
                  onClick={toggleUserMenu}
                  className="nav-user-pill"
                  title="View Account Profile"
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  <span>
                    👤 {userProfile.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }} />
                </button>

                {userMenuOpen && (
                  <div 
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '230px',
                      maxWidth: 'calc(100vw - 20px)',
                      padding: '12px',
                      zIndex: 350,
                      boxShadow: 'var(--shadow-xl)',
                      borderRadius: '12px',
                      background: '#ffffff',
                      border: '1px solid var(--slate-200)'
                    }}
                  >
                    <div style={{ borderBottom: '1px solid var(--slate-200)', paddingBottom: '10px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--dark-900)', fontSize: '0.92rem' }}>{userProfile.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', marginTop: '2px' }}>{userProfile.phone || userProfile.email}</div>
                      <span className="badge badge-green" style={{ fontSize: '0.65rem', marginTop: '6px', display: 'inline-block' }}>
                        {(userProfile.role || 'Farmer').toUpperCase()}
                      </span>
                    </div>

                    <button
                      onClick={() => { setActiveTab('profile'); setUserMenuOpen(false); }}
                      className="btn btn-sm btn-primary"
                      style={{ width: '100%', marginBottom: '6px', justifyContent: 'center' }}
                    >
                      <User size={14} />
                      <span>{t.navProfile || 'View Profile'}</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('dashboard'); setUserMenuOpen(false); }}
                      className="btn btn-sm btn-outline"
                      style={{ width: '100%', marginBottom: '6px', justifyContent: 'center' }}
                    >
                      <LayoutDashboard size={14} />
                      <span>{t.navDashboard || 'Open Dashboard'}</span>
                    </button>

                    <button
                      onClick={() => { if (onLogout) onLogout(); setUserMenuOpen(false); }}
                      className="btn btn-sm btn-outline"
                      style={{ width: '100%', justifyContent: 'center', color: '#b91c1c', borderColor: '#fca5a5' }}
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="cart-btn-indicator"
              aria-label="View Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            {/* Mobile Language Switcher Row */}
            <div style={{ padding: '8px 4px 12px', borderBottom: '1px solid var(--slate-200)', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {t.langPrompt || 'Select Language:'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: currentLang === lang.code ? '1.5px solid var(--primary-600)' : '1px solid var(--slate-300)',
                      background: currentLang === lang.code ? 'var(--primary-100)' : '#fff',
                      color: currentLang === lang.code ? 'var(--primary-800)' : 'var(--dark-800)',
                      cursor: 'pointer'
                    }}
                  >
                    {lang.flag} {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {[...primaryNavItems, ...moreNavItems].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${activeTab === item.id ? 'active' : ''}`}
              >
                <span>{item.icon ? (typeof item.icon === 'string' ? item.icon : <item.icon size={16} />) : '•'}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--slate-200)', marginTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <LogIn size={15} />
                <span>{t.navSignIn || 'Sign In / Register'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
