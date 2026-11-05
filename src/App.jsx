import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AIAdvisor from './components/AIAdvisor';
import MandiPrices from './components/MandiPrices';
import Marketplace from './components/Marketplace';
import CartDrawer from './components/CartDrawer';
import SchemesDirectory from './components/SchemesDirectory';
import SurplusRescue from './components/SurplusRescue';
import CropResidueMarket from './components/CropResidueMarket';
import CommunityEvents from './components/CommunityEvents';
import InfrastructureTracker from './components/InfrastructureTracker';
import FarmerDashboard from './components/FarmerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';
import WildlifeIncidentModal from './components/WildlifeIncidentModal';
import VideoTourModal from './components/VideoTourModal';
import FarmerFundModal from './components/FarmerFundModal';
import FutureRoadmap from './components/FutureRoadmap';
import ProfileView from './components/ProfileView';
import Footer from './components/Footer';
import { MOCK_USERS } from './data/mockUsers';
import { getActiveUser, setActiveUser, logoutActiveUser } from './services/authService';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');

  // Derive initial tab from URL hash, path, or query param
  const getInitialTab = () => {
    try {
      const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
      const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search || '');
      const tabParam = (searchParams.get('tab') || '').toLowerCase();

      const candidate = tabParam || hash || path;
      if (['profile', 'login', 'register', 'advisory', 'mandi', 'marketplace', 'schemes', 'roadmap', 'surplus', 'waste', 'projects', 'community', 'dashboard'].includes(candidate)) {
        return candidate;
      }
    } catch (e) {}
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentRole, setCurrentRole] = useState('farmer'); // 'farmer' | 'buyer' | 'seller' | 'admin'

  // User Profile state
  const [userProfile, setUserProfile] = useState({
    name: 'Ravi Kumar',
    role: 'farmer',
    email: 'ravi.kumar@agriconnect.org',
    phone: '+91 98451 22891',
    district: 'Shivamogga',
    state: 'Karnataka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
    isLoggedIn: false
  });

  // Cart State
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      name: 'Farm Fresh Organic Tomatoes (Hybrid Vaishali)',
      price: 24,
      unit: 'Kg',
      quantity: 50,
      seller: 'Ravi Kumar',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWildlifeModalOpen, setIsWildlifeModalOpen] = useState(false);
  const [isVideoTourOpen, setIsVideoTourOpen] = useState(false);
  const [isFarmerFundModalOpen, setIsFarmerFundModalOpen] = useState(false);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState(null);

  const isFirstRender = useRef(true);

  // Setup initial history trap so browser back navigation stays in-app and never hits about:blank
  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.agriApp) {
        window.history.replaceState({ agriApp: true, tab: activeTab, root: true }, '', window.location.hash || `#${activeTab}`);
        window.history.pushState({ agriApp: true, tab: activeTab }, '', window.location.hash || `#${activeTab}`);
      }
    } catch (e) {}
  }, []);

  // Sync tab with URL hash & scroll to top
  useEffect(() => {
    try {
      const targetHash = `#${activeTab}`;
      const currentHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();

      if (currentHash !== activeTab) {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          window.history.replaceState({ agriApp: true, tab: activeTab }, '', targetHash);
        } else {
          window.history.pushState({ agriApp: true, tab: activeTab }, '', targetHash);
        }
      } else if (isFirstRender.current) {
        isFirstRender.current = false;
      }
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  useEffect(() => {
    const handleHashOrPopState = (e) => {
      try {
        const rawHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
        const hash = rawHash || e?.state?.tab || 'home';
        if (hash) {
          setActiveTab((prev) => (hash !== prev ? hash : prev));
        }
        if (e?.state?.root || rawHash === '') {
          window.history.pushState({ agriApp: true, tab: hash }, '', `#${hash}`);
        }
      } catch (e) {}
    };

    window.addEventListener('hashchange', handleHashOrPopState);
    window.addEventListener('popstate', handleHashOrPopState);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPopState);
      window.removeEventListener('popstate', handleHashOrPopState);
    };
  }, []);

  // Protected Route Guard (SEC_004, TC_047)
  useEffect(() => {
    if (activeTab === 'dashboard' && !userProfile?.isLoggedIn) {
      setActiveTab('login');
      showToast('🔒 Access Denied: Please sign in to access your dashboard.');
    }
  }, [activeTab, userProfile?.isLoggedIn]);

  // Restore active user session from localStorage
  useEffect(() => {
    try {
      const active = getActiveUser();
      if (active && active.name) {
        setUserProfile({ ...active, isLoggedIn: true });
        if (active.role) setCurrentRole(active.role);
      }
    } catch (e) {
      console.warn('Error reading active session:', e);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.name.split('(')[0]}" to cart!`);
  };

  const handleUpdateQty = (id, newQty) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUniversalSearch = (query) => {
    const q = query.toLowerCase();
    if (q.includes('price') || q.includes('mandi') || q.includes('rate') || q.includes('market')) {
      setActiveTab('mandi');
    } else if (q.includes('scheme') || q.includes('subsidy') || q.includes('pm-kisan') || q.includes('kisan')) {
      setActiveTab('schemes');
    } else if (q.includes('disease') || q.includes('leaf') || q.includes('doctor') || q.includes('ai') || q.includes('blight')) {
      setActiveTab('advisory');
    } else if (q.includes('surplus') || q.includes('puree') || q.includes('pickle') || q.includes('crash')) {
      setActiveTab('surplus');
    } else if (q.includes('waste') || q.includes('straw') || q.includes('stubble') || q.includes('biomass')) {
      setActiveTab('waste');
    } else {
      setActiveTab('marketplace');
    }
  };

  const handleLogout = () => {
    logoutActiveUser();
    setUserProfile(prev => ({ ...prev, isLoggedIn: false }));
    showToast('Logged out of session.');
    setActiveTab('home');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  return (
    <div className="app-root">
      {/* Toast popup */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            background: 'var(--dark-900)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            borderLeft: '4px solid var(--primary-500)',
            fontSize: '0.88rem',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={(r) => {
          setCurrentRole(r);
          setUserProfile(prev => ({
            ...prev,
            role: r,
            name: MOCK_USERS[r]?.name || prev.name,
            email: MOCK_USERS[r]?.email || prev.email,
            phone: MOCK_USERS[r]?.phone || prev.phone,
            avatar: MOCK_USERS[r]?.avatar || prev.avatar
          }));
          showToast(`Switched active profile to ${r.toUpperCase()}`);
        }}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        setIsAuthOpen={setIsAuthOpen}
        setIsWildlifeModalOpen={setIsWildlifeModalOpen}
        setIsVideoTourOpen={setIsVideoTourOpen}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Page Routing Switcher */}
      <main>
        {activeTab === 'home' && (
          <>
            <HeroSection
              currentLang={currentLang}
              setActiveTab={setActiveTab}
              setIsAuthOpen={setIsAuthOpen}
              setIsVideoTourOpen={setIsVideoTourOpen}
              setIsFarmerFundModalOpen={setIsFarmerFundModalOpen}
              onSearchSubmit={handleUniversalSearch}
            />

            {/* AI Crop Doctor Section Preview */}
            <AIAdvisor 
              currentLang={currentLang} 
              setActiveTab={setActiveTab}
              onEscalateExpert={() => alert('Connected to Dr. Ramesh Gowda, Senior Agronomist at UAS Bangalore. Calling +91 80 2341 5500...')}
            />

            {/* Live APMC Mandi Prices Section */}
            <MandiPrices 
              currentLang={currentLang} 
              setActiveTab={setActiveTab} 
            />

            {/* Direct Marketplace Section */}
            <Marketplace 
              currentLang={currentLang}
              currentRole={currentRole}
              onAddToCart={handleAddToCart}
              setIsCartOpen={setIsCartOpen}
            />

            {/* Surplus Rescue & Food Preservation */}
            <SurplusRescue 
              currentLang={currentLang}
              setActiveTab={setActiveTab}
            />

            {/* Crop Residue & Biomass */}
            <CropResidueMarket 
              currentLang={currentLang} 
            />

            {/* Verified Government Schemes */}
            <SchemesDirectory 
              currentLang={currentLang} 
            />

            {/* Infrastructure Tracker */}
            <InfrastructureTracker 
              currentLang={currentLang} 
            />

            {/* Farmer Community & Workshops */}
            <CommunityEvents 
              currentLang={currentLang} 
            />

            {/* Offline-First & Multilingual Future Implementation Section */}
            <FutureRoadmap 
              currentLang={currentLang} 
              setActiveTab={setActiveTab} 
            />
          </>
        )}

        {/* Dedicated Future Roadmap Tab */}
        {activeTab === 'roadmap' && (
          <FutureRoadmap 
            currentLang={currentLang} 
            setActiveTab={setActiveTab} 
          />
        )}

        {/* Dedicated Login & Registration Page */}
        {(activeTab === 'login' || activeTab === 'register') && (
          <AuthPage
            initialMode={activeTab === 'register' ? 'register' : 'login'}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            setActiveTab={setActiveTab}
            setUserProfile={setUserProfile}
            userProfile={userProfile}
            currentLang={currentLang}
          />
        )}

        {activeTab === 'advisory' && (
          <AIAdvisor 
            currentLang={currentLang} 
            setActiveTab={setActiveTab}
            onEscalateExpert={() => alert('Connected to Dr. Ramesh Gowda, Senior Agronomist at UAS Bangalore. Calling +91 80 2341 5500...')}
          />
        )}

        {activeTab === 'mandi' && (
          <MandiPrices 
            currentLang={currentLang} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace 
            currentLang={currentLang}
            currentRole={currentRole}
            onAddToCart={handleAddToCart}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {activeTab === 'schemes' && (
          <SchemesDirectory 
            currentLang={currentLang} 
          />
        )}

        {activeTab === 'surplus' && (
          <SurplusRescue 
            currentLang={currentLang}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'waste' && (
          <CropResidueMarket 
            currentLang={currentLang} 
          />
        )}

        {activeTab === 'projects' && (
          <InfrastructureTracker 
            currentLang={currentLang} 
          />
        )}

        {activeTab === 'community' && (
          <CommunityEvents 
            currentLang={currentLang} 
          />
        )}

        {/* Dedicated Profile View Tab */}
        {activeTab === 'profile' && (
          <ProfileView 
            currentLang={currentLang}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'farmer' && (
              <FarmerDashboard 
                currentLang={currentLang}
                setActiveTab={setActiveTab}
                setIsWildlifeModalOpen={setIsWildlifeModalOpen}
              />
            )}

            {currentRole === 'buyer' && (
              <BuyerDashboard 
                currentLang={currentLang}
                setActiveTab={setActiveTab}
                setIsCartOpen={setIsCartOpen}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard 
                currentLang={currentLang}
                setActiveTab={setActiveTab}
              />
            )}

            {currentRole === 'seller' && (
              <FarmerDashboard 
                currentLang={currentLang}
                setActiveTab={setActiveTab}
                setIsWildlifeModalOpen={setIsWildlifeModalOpen}
              />
            )}
          </>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentLang={currentLang}
      />

      {/* Role Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentRole={currentRole}
        currentLang={currentLang}
        setCurrentRole={setCurrentRole}
        setUserProfile={setUserProfile}
        setActiveTab={setActiveTab}
      />

      {/* Wildlife Incident Documentation Modal */}
      <WildlifeIncidentModal
        isOpen={isWildlifeModalOpen}
        onClose={() => setIsWildlifeModalOpen(false)}
        currentLang={currentLang}
      />

      {/* Video Presentation Modal */}
      <VideoTourModal
        isOpen={isVideoTourOpen}
        onClose={() => setIsVideoTourOpen(false)}
        currentLang={currentLang}
      />

      {/* Smallholder Farmer Support Fund Modal */}
      <FarmerFundModal
        isOpen={isFarmerFundModalOpen}
        onClose={() => setIsFarmerFundModalOpen(false)}
        currentLang={currentLang}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        setActiveTab={setActiveTab}
        setIsWildlifeModalOpen={setIsWildlifeModalOpen}
        setIsFarmerFundModalOpen={setIsFarmerFundModalOpen}
      />
    </div>
  );
}
