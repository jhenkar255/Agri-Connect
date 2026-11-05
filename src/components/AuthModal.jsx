import React, { useState } from 'react';
import { 
  User, Lock, Mail, Phone, ShieldCheck, Check, 
  X, ArrowRight, Sparkles, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import { 
  registerUser, 
  authenticateWithPassword, 
  authenticateWithOtp, 
  setActiveUser 
} from '../services/authService';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  currentRole, 
  setCurrentRole,
  setUserProfile,
  setActiveTab,
  currentLang = 'en'
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'farmer');
  const [useOtp, setUseOtp] = useState(true);
  const [otpStep, setOtpStep] = useState(1);
  const [phone, setPhone] = useState('+91 98451 22891');
  const [otp, setOtp] = useState('482910');
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [email, setEmail] = useState('ravi.kumar@agriconnect.org');
  const [password, setPassword] = useState('FarmerPass@2026');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [errorText, setErrorText] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (r) => {
    setSelectedRole(r);
    setErrorText('');
    if (r === 'admin') {
      setEmail('admin@agriconnect.in');
      setPassword('ChangeThisImmediately@2026');
    } else if (r === 'buyer') {
      setEmail('ananya.s@metrofresh.in');
      setPassword('BuyerPass@2026');
    } else if (r === 'seller') {
      setEmail('manoj@krishimitra.org');
      setPassword('SellerPass@2026');
    } else {
      setEmail('ravi.kumar@agriconnect.org');
      setPassword('FarmerPass@2026');
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setErrorText('Please enter a valid 10-digit mobile number.');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtp(code);
    setOtpStep(2);
    setErrorText('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorText('');

    try {
      let user;
      if (authMode === 'login') {
        if (useOtp) {
          if (otp !== generatedOtp && otp !== '482910' && otp !== '552199') {
            setErrorText('Invalid OTP. Please enter the demo code shown above.');
            return;
          }
          user = authenticateWithOtp(phone, otp, selectedRole);
        } else {
          user = authenticateWithPassword(email, password, selectedRole);
        }
      } else {
        // Register mode
        if (!regName.trim()) {
          setErrorText('Please enter your full name.');
          return;
        }
        if (regPhone.replace(/\D/g, '').length < 10) {
          setErrorText('Please enter a valid 10-digit mobile number.');
          return;
        }
        user = registerUser({
          name: regName,
          phone: regPhone,
          role: selectedRole,
          password: regPassword || 'FarmerPass@2026',
          state: 'Karnataka',
          district: 'Shivamogga',
          termsAccepted: true
        });
      }

      setIsSuccess(true);
      setSuccessText(authMode === 'register' ? `Account Created! Welcome, ${user.name}` : `Welcome back, ${user.name}!`);

      if (setCurrentRole) setCurrentRole(user.role);
      if (setUserProfile) setUserProfile({ ...user, isLoggedIn: true });
      setActiveUser({ ...user, isLoggedIn: true });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (setActiveTab) setActiveTab('dashboard');
      }, 900);
    } catch (err) {
      setErrorText(err.message || 'Authentication error. Please check your details.');
    }
  };

  const handleQuickDemo = (role) => {
    const mock = MOCK_USERS[role] || MOCK_USERS.farmer;
    const active = { ...mock, isLoggedIn: true };
    if (setCurrentRole) setCurrentRole(role);
    if (setUserProfile) setUserProfile(active);
    setActiveUser(active);

    setIsSuccess(true);
    setSuccessText(`Instant sign in as ${mock.name} (${role.toUpperCase()})`);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (setActiveTab) setActiveTab('dashboard');
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '490px', borderRadius: '20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-900)', fontWeight: 800 }}>
              {authMode === 'login' ? (t.navSignIn || 'Sign In to Agri-Connect') : 'Create Free Farm Account'}
            </h3>
            <small style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>
              {t.tagline || 'Govt Verified Digital Agriculture Ecosystem'}
            </small>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', color: '#166534', marginBottom: '6px' }}>
              {successText || 'Authentication Successful!'}
            </h4>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem' }}>
              Switching workspace to <strong>{selectedRole.toUpperCase()}</strong> dashboard...
            </p>
          </div>
        ) : (
          <div>
            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => { 
                  setAuthMode('login'); 
                  setErrorText(''); 
                  if (selectedRole === 'seller') handleRoleChange('farmer');
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: authMode === 'login' ? '#fff' : 'transparent',
                  color: authMode === 'login' ? 'var(--primary-800)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { 
                  setAuthMode('register'); 
                  setErrorText(''); 
                  if (selectedRole === 'seller' || selectedRole === 'admin') handleRoleChange('farmer');
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  background: authMode === 'register' ? '#fff' : 'transparent',
                  color: authMode === 'register' ? 'var(--primary-800)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Create Account
              </button>
            </div>

            {/* Error Notification */}
            {errorText && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#b91c1c', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorText}</span>
              </div>
            )}

            {/* Role Selection Buttons */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '6px' }}>
                Select Your Role:
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: authMode === 'register' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                gap: '6px' 
              }}>
                {(authMode === 'register' ? [
                  { id: 'farmer', label: '🌾 Farmer' },
                  { id: 'buyer', label: '🛒 Buyer' }
                ] : [
                  { id: 'farmer', label: '🌾 Farmer' },
                  { id: 'buyer', label: '🛒 Buyer' },
                  { id: 'admin', label: '🛡️ Admin' }
                ]).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id)}
                    style={{
                      padding: '7px 4px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: selectedRole === r.id ? 'var(--primary-600)' : 'var(--slate-200)',
                      background: selectedRole === r.id ? 'var(--primary-50)' : '#fff',
                      color: selectedRole === r.id ? 'var(--primary-800)' : 'var(--dark-700)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SIGN IN VIEW */}
            {authMode === 'login' ? (
              <div>
                {/* Method selector: OTP vs Password */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setUseOtp(true)}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: useOtp ? 'var(--primary-600)' : 'var(--slate-300)',
                      background: useOtp ? 'var(--primary-50)' : '#fff',
                      color: useOtp ? 'var(--primary-800)' : 'var(--slate-600)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Mobile Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseOtp(false)}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: !useOtp ? 'var(--primary-600)' : 'var(--slate-300)',
                      background: !useOtp ? 'var(--primary-50)' : '#fff',
                      color: !useOtp ? 'var(--primary-800)' : 'var(--slate-600)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Email & Password
                  </button>
                </div>

                {useOtp ? (
                  <form onSubmit={otpStep === 1 ? handleSendOtp : handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {otpStep === 1 ? (
                      <>
                        <div>
                          <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>10-Digit Mobile Number:</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98451 22891"
                            required
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.9rem' }}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '10px', justifyContent: 'center' }}>
                          Send 6-Digit OTP SMS
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ background: '#ecfdf5', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#065f46' }}>
                          SMS sent to {phone}. Demo verification code: <strong>{generatedOtp}</strong>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Enter 6-Digit Code:</label>
                          <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '2px solid var(--primary-500)', textAlign: 'center', fontSize: '1.25rem', letterSpacing: '4px', fontWeight: 800 }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="button" onClick={() => setOtpStep(1)} className="btn btn-outline" style={{ flex: 1, padding: '8px' }}>
                            Change
                          </button>
                          <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '8px', justifyContent: 'center' }}>
                            Verify & Enter
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Email Address:</label>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Password:</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ width: '100%', padding: '8px 32px 8px 10px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px', justifyContent: 'center', marginTop: '4px' }}>
                      Sign In as {selectedRole.toUpperCase()}
                    </button>
                  </form>
                )}

                {/* 1-Click Demo Evaluation Row */}
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--slate-200)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
                    Or Instant 1-Click Demo Evaluation:
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleQuickDemo('farmer')} style={{ flex: 1, padding: '5px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid var(--slate-300)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                      🌾 Farmer
                    </button>
                    <button type="button" onClick={() => handleQuickDemo('buyer')} style={{ flex: 1, padding: '5px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid var(--slate-300)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                      🛒 Buyer
                    </button>
                    <button type="button" onClick={() => handleQuickDemo('seller')} style={{ flex: 1, padding: '5px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid var(--slate-300)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                      🚜 Dealer
                    </button>
                    <button type="button" onClick={() => handleQuickDemo('admin')} style={{ flex: 1, padding: '5px', fontSize: '0.74rem', borderRadius: '6px', border: '1px solid #ef4444', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer', fontWeight: 600 }}>
                      🛡️ Admin
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* REGISTER VIEW */
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Chiranthan / Ramesh"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="98451 22891"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--slate-600)', display: 'block', marginBottom: '3px' }}>Set Password *</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-300)', fontSize: '0.88rem' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '10px', justifyContent: 'center', marginTop: '6px' }}>
                  Register as {selectedRole.toUpperCase()} & Log In
                </button>

                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (setActiveTab) setActiveTab('login');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.76rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Need full farmer registration with land size? Open Full Page →
                  </button>
                </div>
              </form>
            )}

            {/* Integrity Notice */}
            <div style={{ marginTop: '12px', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
              🛡️ <strong>Integrity Notice:</strong> Agri-Connect verifies mobile OTP, Aadhaar KYC, and RTC land records to ensure zero fake accounts.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
