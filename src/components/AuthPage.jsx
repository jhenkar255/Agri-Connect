import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Mail, Phone, ShieldCheck, Check, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Building, MapPin, Tractor,
  Eye, EyeOff, Award, FileText, CheckCircle, X, ChevronRight, HelpCircle
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockUsers';
import { TRANSLATIONS } from '../data/languages';
import { 
  registerUser, 
  authenticateWithPassword, 
  authenticateWithOtp, 
  getRegisteredUsers,
  setActiveUser,
  requestPasswordReset,
  resetPassword
} from '../services/authService';

export default function AuthPage({ 
  initialMode = 'login',
  currentRole = 'farmer', 
  setCurrentRole, 
  setActiveTab, 
  setUserProfile, 
  userProfile,
  currentLang = 'en'
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  
  // Navigation & Mode
  const [authMode, setAuthMode] = useState(initialMode || 'login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'farmer');
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

  // Form State - Phone & OTP (TC_030 - TC_037)
  const [phoneNumber, setPhoneNumber] = useState('+91 98451 22891');
  const [otpStep, setOtpStep] = useState(1); // 1 = enter phone, 2 = enter otp
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('482910');
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(60); // 60s countdown
  const [resendCooldown, setResendCooldown] = useState(0); // 30s rate limit cooldown

  // Form State - Email & Password (TC_009 - TC_022)
  const [email, setEmail] = useState('ravi.kumar@agriconnect.org');
  const [password, setPassword] = useState('FarmerPass@2026');
  const [showPassword, setShowPassword] = useState(false);

  // Brute-force protection (SEC_006)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Forgot Password Modal (TC_023 - TC_025)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = request, 2 = enter code & new pass
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Social Auth Modals (TC_026 - TC_029)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);

  // Registration Form State (TC_038 - TC_042)
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    state: 'Karnataka',
    district: 'Shivamogga',
    village: '',
    taluk: '',
    landAcres: '2.5',
    soilType: 'Red Loamy Soil',
    mainCrop: 'Tomato & Potato',
    companyName: '',
    gstin: '',
    dealerLicense: '',
    password: '',
    confirmPassword: '',
    termsAccepted: true
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Field validation error tracking (UI_005, TC_013-TC_018)
  const [fieldErrors, setFieldErrors] = useState({});

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Sync mode with initialMode prop
  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
      setErrorMessage('');
      setFieldErrors({});
    }
  }, [initialMode]);

  // Restrict role selection per user requirements:
  // - Register page: Farmer, Buyer / Retailer (Input Seller & Admin removed)
  // - Login page: Farmer, Buyer / Retailer, Platform Admin (Input Seller removed)
  useEffect(() => {
    if (authMode === 'register' && (selectedRole === 'seller' || selectedRole === 'admin')) {
      setSelectedRole('farmer');
    } else if (authMode === 'login' && selectedRole === 'seller') {
      setSelectedRole('farmer');
    }
  }, [authMode, selectedRole]);

  // Scroll to top on mount and tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [authMode]);

  // Load registered users from localStorage
  useEffect(() => {
    try {
      const users = getRegisteredUsers();
      setSavedAccounts(users);
    } catch (e) {
      console.warn('Could not load users:', e);
    }
  }, [authMode, successMessage]);

  // OTP Expiration countdown timer (TC_035)
  useEffect(() => {
    let timer = null;
    if (otpStep === 2 && otpExpiryTimer > 0) {
      timer = setInterval(() => {
        setOtpExpiryTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, otpExpiryTimer]);

  // Resend OTP cooldown timer (TC_037)
  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Brute-force lockout timer (SEC_006)
  useEffect(() => {
    let timer = null;
    if (lockoutTimer > 0) {
      timer = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTimer]);

  // Role selection buttons (TC_004, TC_005, TC_006, TC_007, TC_008)
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setFieldErrors({});
    if (role === 'admin') {
      setEmail('admin@agriconnect.in');
      setPassword('ChangeThisImmediately@2026');
      setPhoneNumber('+91 80 2345 6789');
      setLoginMethod('password');
    } else if (role === 'buyer') {
      setEmail('ananya.s@metrofresh.in');
      setPassword('BuyerPass@2026');
      setPhoneNumber('+91 98860 44521');
    } else if (role === 'seller') {
      setEmail('manoj@krishimitra.org');
      setPassword('SellerPass@2026');
      setPhoneNumber('+91 94480 99812');
    } else {
      setEmail('ravi.kumar@agriconnect.org');
      setPassword('FarmerPass@2026');
      setPhoneNumber('+91 98451 22891');
    }
  };

  // Email format validator (TC_016, TC_017, TC_018)
  const validateEmailFormat = (val) => {
    const raw = (val || '').trim();
    if (!raw) return { valid: false, error: 'Email is required. Please enter your email address.' };
    if (!raw.includes('@')) return { valid: false, error: "Email validation failed: missing '@' symbol." };
    if (raw.startsWith('@') || raw.endsWith('@')) return { valid: false, error: "Invalid email format. Please include username before and domain after '@'." };
    const parts = raw.split('@');
    if (parts.length !== 2 || !parts[1]) return { valid: false, error: "Invalid email format: domain name is missing." };
    const domain = parts[1];
    if (!domain.includes('.') || domain.endsWith('.')) return { valid: false, error: "Email validation failed: missing valid domain extension (e.g., .com, .in, .org)." };
    return { valid: true, clean: raw };
  };

  // Phone number validator (TC_031, TC_032)
  const validatePhoneNumber = (val) => {
    let digits = (val || '').replace(/\D/g, '');
    if (!digits) return { valid: false, error: 'Mobile number is required. Please enter your 10-digit number.' };
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (digits.length !== 10) return { valid: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    return { valid: true, digits };
  };

  // Password Login Handler (TC_009 - TC_019, TC_043 - TC_045, SEC_006)
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit (TC_049, TC_050)

    // Check brute force lockout (SEC_006)
    if (lockoutTimer > 0) {
      setErrorMessage(`Account temporarily locked due to multiple failed attempts. Please wait ${lockoutTimer}s.`);
      return;
    }

    setErrorMessage('');
    setFieldErrors({});

    const rawEmail = (email || '').trim(); // Trim spaces (TC_019)
    const rawPassword = password || '';

    // TC_013: Both empty
    if (!rawEmail && !rawPassword) {
      const msg = 'Please enter both your email address and password.';
      setErrorMessage(msg);
      setFieldErrors({ email: 'Email required', password: 'Password required' });
      return;
    }

    // TC_014: Email empty
    if (!rawEmail) {
      const msg = 'Email is required. Please enter your registered email.';
      setErrorMessage(msg);
      setFieldErrors({ email: msg });
      return;
    }

    // TC_015: Password empty
    if (!rawPassword) {
      const msg = 'Password is required. Please enter your password.';
      setErrorMessage(msg);
      setFieldErrors({ password: msg });
      return;
    }

    // TC_016 - TC_018: Email format validations
    const emailValidation = validateEmailFormat(rawEmail);
    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.error);
      setFieldErrors({ email: emailValidation.error });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const loggedUser = authenticateWithPassword(emailValidation.clean, rawPassword, selectedRole);
        
        // Success
        setFailedAttempts(0);
        if (setCurrentRole) setCurrentRole(loggedUser.role);
        if (setUserProfile) setUserProfile(loggedUser);
        setActiveUser(loggedUser);

        // Role mismatch detection & guidance (TC_044)
        const roleLabels = { farmer: 'Farmer', buyer: 'Buyer / Retailer', seller: 'Input Seller', admin: 'Platform Admin' };
        if (loggedUser.role !== selectedRole) {
          setSuccessMessage(`Welcome back, ${loggedUser.name}! Note: Your verified account role is ${roleLabels[loggedUser.role] || loggedUser.role.toUpperCase()}. Opening your ${loggedUser.role.toUpperCase()} Workspace...`);
        } else {
          setSuccessMessage(`Welcome back, ${loggedUser.name}! Opening your ${loggedUser.role.toUpperCase()} Workspace...`);
        }

        setTimeout(() => {
          setLoading(false);
          if (setActiveTab) setActiveTab('dashboard');
        }, 800);
      } catch (err) {
        setLoading(false);
        // Track failed attempt for brute-force rate limit (SEC_006)
        setFailedAttempts(prev => {
          const next = prev + 1;
          if (next >= 5) {
            setLockoutTimer(30);
            return 0;
          }
          return next;
        });

        const msg = err.message || 'Authentication failed. Please verify your credentials.';
        setErrorMessage(msg);
        if (msg.toLowerCase().includes('password')) {
          setFieldErrors({ password: 'Incorrect password' });
        } else if (msg.toLowerCase().includes('account') || msg.toLowerCase().includes('email')) {
          setFieldErrors({ email: 'No account found' });
        }
      }
    }, 450);
  };

  // Send OTP Handler (TC_030, TC_031, TC_032, TC_037)
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    setFieldErrors({});

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.error);
      setFieldErrors({ phone: phoneValidation.error });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const code = '482910';
      setGeneratedDemoOtp(code);
      setEnteredOtp(code); // Pre-fill for convenience
      setOtpExpiryTimer(60); // 60s countdown (TC_035)
      setResendCooldown(30); // 30s rate limit (TC_037)
      setOtpStep(2);
      setSuccessMessage(`Verification OTP sent to +91 ${phoneValidation.digits} via SMS.`);
    }, 400);
  };

  // Resend OTP Handler (TC_036, TC_037)
  const handleResendOtp = () => {
    if (resendCooldown > 0) {
      setErrorMessage(`Rate Limit: Please wait ${resendCooldown}s before requesting a new OTP.`);
      return;
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.error);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedDemoOtp(newCode);
      setEnteredOtp(newCode);
      setOtpExpiryTimer(60);
      setResendCooldown(30);
      setLoading(false);
      setSuccessMessage(`New verification OTP sent to +91 ${phoneValidation.digits}: ${newCode}`);
    }, 450);
  };

  // Verify OTP Handler (TC_033, TC_034, TC_035)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');

    // TC_035: Expired OTP check
    if (otpExpiryTimer <= 0) {
      setErrorMessage('OTP has expired (60-second validity window). Please click "Resend OTP" to generate a fresh verification code.');
      return;
    }

    // TC_034: Wrong OTP check
    const cleanEntered = enteredOtp.trim();
    if (cleanEntered !== generatedDemoOtp && cleanEntered !== '482910') {
      setErrorMessage('Invalid OTP code. Please enter the correct 6-digit code shown in the green demo notification.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const loggedUser = authenticateWithOtp(phoneNumber, cleanEntered, selectedRole);
        if (setCurrentRole) setCurrentRole(loggedUser.role);
        if (setUserProfile) setUserProfile(loggedUser);
        setActiveUser(loggedUser);

        setSuccessMessage(`Welcome, ${loggedUser.name}! Phone verification successful. Opening your ${loggedUser.role.toUpperCase()} Workspace...`);
        setTimeout(() => {
          setLoading(false);
          if (setActiveTab) setActiveTab('dashboard');
        }, 800);
      } catch (err) {
        setLoading(false);
        setErrorMessage(err.message || 'OTP verification failed. Please try again.');
      }
    }, 450);
  };

  // Farmer Registration Handler (TC_038, TC_039, TC_040, TC_041, TC_042)
  const handleRegister = (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage('');
    setFieldErrors({});

    // TC_040: Required fields validation
    if (!regData.name.trim()) {
      const msg = 'Full name is required. Please enter your name.';
      setErrorMessage(msg);
      setFieldErrors({ name: msg });
      return;
    }

    const phoneValidation = validatePhoneNumber(regData.phone);
    if (!phoneValidation.valid) {
      setErrorMessage(phoneValidation.error);
      setFieldErrors({ phone: phoneValidation.error });
      return;
    }

    if (regData.email.trim()) {
      const emailValidation = validateEmailFormat(regData.email);
      if (!emailValidation.valid) {
        setErrorMessage(emailValidation.error);
        setFieldErrors({ email: emailValidation.error });
        return;
      }
    }

    if (!regData.password || regData.password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      setFieldErrors({ password: msg });
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      const msg = 'Passwords do not match. Please re-enter identical passwords.';
      setErrorMessage(msg);
      setFieldErrors({ confirmPassword: msg });
      return;
    }

    if (!regData.termsAccepted) {
      const msg = 'Please accept the Terms of Service & Privacy Policy to register.';
      setErrorMessage(msg);
      setFieldErrors({ terms: msg });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // TC_041, TC_042: Handled by registerUser which checks duplicate email & phone
        const newUser = registerUser({
          ...regData,
          role: selectedRole
        });

        if (setCurrentRole) setCurrentRole(newUser.role);
        if (setUserProfile) setUserProfile(newUser);
        setActiveUser(newUser);

        setSuccessMessage(`Account created successfully! Welcome to Agri-Connect, ${newUser.name}. Redirecting to your ${newUser.role.toUpperCase()} Workspace...`);
        setTimeout(() => {
          setLoading(false);
          if (setActiveTab) setActiveTab('dashboard');
        }, 900);
      } catch (err) {
        setLoading(false);
        const msg = err.message || 'Registration failed. Please check your details.';
        setErrorMessage(msg);
        if (msg.toLowerCase().includes('email')) {
          setFieldErrors({ email: 'Email already exists' });
        } else if (msg.toLowerCase().includes('mobile') || msg.toLowerCase().includes('phone')) {
          setFieldErrors({ phone: 'Mobile already exists' });
        }
      }
    }, 550);
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (role) => {
    setSelectedRole(role);
    if (setCurrentRole) setCurrentRole(role);
    const profile = MOCK_USERS[role] || MOCK_USERS.farmer;
    const active = { ...profile, isLoggedIn: true };
    if (setUserProfile) setUserProfile(active);
    setActiveUser(active);

    setSuccessMessage(`One-click demo sign-in as ${profile.name} (${role.toUpperCase()}) successful!`);
    setTimeout(() => {
      if (setActiveTab) setActiveTab('dashboard');
    }, 600);
  };

  // Forgot Password Request Handler (TC_023, TC_024, TC_025)
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (forgotStep === 1) {
      if (!forgotEmail.trim()) {
        setForgotError('Please enter your registered email address or mobile number.');
        return;
      }
      try {
        const res = requestPasswordReset(forgotEmail);
        setForgotSuccess(res.message);
        setForgotOtpCode('482910');
        setForgotStep(2);
      } catch (err) {
        // TC_025: Unregistered email
        setForgotError(err.message || 'No registered account found with that email.');
      }
    } else {
      if (forgotOtpCode !== '482910') {
        setForgotError('Invalid reset code. Use demo code 482910.');
        return;
      }
      if (!forgotNewPassword || forgotNewPassword.length < 6) {
        setForgotError('New password must be at least 6 characters long.');
        return;
      }
      try {
        resetPassword(forgotEmail, forgotNewPassword);
        setForgotSuccess('Password updated successfully! You can now log in.');
        setTimeout(() => {
          setShowForgotModal(false);
          setPassword(forgotNewPassword);
          setForgotStep(1);
          setSuccessMessage('Password reset successful. Please sign in with your new password.');
        }, 1200);
      } catch (err) {
        setForgotError(err.message || 'Failed to update password.');
      }
    }
  };

  // Google OAuth Simulation (TC_026, TC_027)
  const handleGoogleSelect = (mockUserRole) => {
    setShowGoogleModal(false);
    handleQuickDemoLogin(mockUserRole);
  };

  // Facebook OAuth Simulation (TC_028, TC_029)
  const handleFacebookSelect = (mockUserRole) => {
    setShowFacebookModal(false);
    handleQuickDemoLogin(mockUserRole);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '92vh', padding: '32px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        
        {/* Top Header / Back Navigation Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={() => {
              if (setActiveTab) setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="btn btn-sm btn-outline"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#ffffff',
              borderColor: 'var(--slate-300)',
              color: 'var(--slate-700)',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
            <span>← Back to Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-green" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
              🔒 256-Bit SSL Encrypted
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              National Digital Agriculture Portal
            </span>
          </div>
        </div>

        {/* Main Auth Split Container (UI_001, UI_002) */}
        <div 
          className="glass-card auth-split-grid" 
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid var(--slate-200)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            background: '#ffffff'
          }}
        >
          {/* Left Column: Visual & Value Props */}
          <div 
            style={{
              background: 'linear-gradient(145deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
              color: '#ffffff',
              padding: '44px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0', marginBottom: '24px' }}>
                <Sparkles size={15} />
                <span>Agri-Connect Digital Mission</span>
              </div>

              <h2 style={{ fontSize: '2.1rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
                {t.authWelcome || "Join India's Farmer-First Digital Ecosystem"}
              </h2>

              <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Access live APMC mandi rates, AI crop leaf diagnostics, direct wholesale buyers, 70% drip irrigation subsidies, and crop residue monetization.
              </p>

              {/* Value prop points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#fff" />
                  </div>
                  <span><strong>Direct Wholesale Buyers:</strong> Zero Middleman Margin</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#fff" />
                  </div>
                  <span><strong>AI Crop Doctor:</strong> 24/7 Vernacular Advisory</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} color="#fff" />
                  </div>
                  <span><strong>Govt Schemes & Subsidies:</strong> Direct Benefit Transfer</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Logins Footer */}
            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.04em' }}>
                1-Click Instant Evaluation Profiles:
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('farmer')}
                  style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  title="One-click demo login as Farmer Ravi Kumar"
                >
                  🌾 Farmer (Ravi)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('buyer')}
                  style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  title="One-click demo login as Buyer Ananya Sharma"
                >
                  🛒 Buyer (Ananya)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('seller')}
                  style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  title="One-click demo login as Input Dealer Manoj Patel"
                >
                  🚜 Dealer (Manoj)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  style={{ background: 'rgba(239, 68, 68, 0.35)', border: '1px solid #ef4444', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  title="One-click demo login as Platform Admin Srinivas Rao"
                >
                  🛡️ Admin (Srinivas)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Switcher: Sign In vs Register (TC_001, TC_038) */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                id="tab-sign-in"
                onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); setFieldErrors({}); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: authMode === 'login' ? '#ffffff' : 'transparent',
                  color: authMode === 'login' ? 'var(--primary-800)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>

              <button
                type="button"
                id="tab-register-user"
                onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); setFieldErrors({}); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: authMode === 'register' ? '#ffffff' : 'transparent',
                  color: authMode === 'register' ? 'var(--primary-800)' : 'var(--slate-600)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Register as Farmer / User
              </button>
            </div>

            {/* Role Selection Cards (TC_004, TC_005, TC_006, TC_007, TC_008, UI_003) */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '8px' }}>
                Select Role:
              </label>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: authMode === 'register' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
                gap: '8px' 
              }}>
                {(authMode === 'register' ? [
                  { id: 'farmer', title: 'Farmer', icon: '🌾' },
                  { id: 'buyer', title: 'Buyer / Retailer', icon: '🛒' }
                ] : [
                  { id: 'farmer', title: 'Farmer', icon: '🌾' },
                  { id: 'buyer', title: 'Buyer / Retailer', icon: '🛒' },
                  { id: 'admin', title: 'Platform Admin', icon: '🛡️' }
                ]).map((r) => (
                  <button
                    key={r.id}
                    id={`role-select-${r.id}`}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: selectedRole === r.id ? 'var(--primary-600)' : 'var(--slate-200)',
                      background: selectedRole === r.id ? 'var(--primary-50)' : '#ffffff',
                      color: selectedRole === r.id ? 'var(--primary-800)' : 'var(--dark-700)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                      boxShadow: selectedRole === r.id ? '0 0 0 1px var(--primary-600)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', marginBottom: '2px' }}>{r.icon}</div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700 }}>{r.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Alert (UI_005) */}
            {errorMessage && (
              <div id="auth-error-alert" style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', color: '#b91c1c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div id="auth-success-alert" style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#065f46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Lockout Notice (SEC_006) */}
            {lockoutTimer > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', color: '#92400e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#d97706" style={{ flexShrink: 0 }} />
                <span><strong>Security Lockout:</strong> Account locked for <strong>{lockoutTimer}s</strong> due to 5 failed attempts.</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODE 1: SIGN IN */}
            {/* ========================================================================= */}
            {authMode === 'login' && (
              <div>
                {/* Social Login Buttons (TC_026, TC_027, TC_028, TC_029, UI_007) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    id="btn-google-login"
                    onClick={() => setShowGoogleModal(true)}
                    className="auth-social-btn"
                    title="Sign in with Google Account"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google Sign In</span>
                  </button>

                  <button
                    type="button"
                    id="btn-facebook-login"
                    onClick={() => setShowFacebookModal(true)}
                    className="auth-social-btn"
                    style={{ background: '#1877f2', color: '#fff', borderColor: '#1877f2' }}
                    title="Log in with Facebook Account"
                  >
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>f</span>
                    <span>Facebook</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', color: 'var(--slate-400)', fontSize: '0.74rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--slate-200)' }} />
                  <span>OR DIRECT AUTHENTICATION</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--slate-200)' }} />
                </div>

                {/* Sub-toggle: Phone OTP vs Email/Password (TC_030) */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    id="subtab-otp"
                    onClick={() => { setLoginMethod('otp'); setErrorMessage(''); setFieldErrors({}); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: loginMethod === 'otp' ? 'var(--primary-600)' : 'var(--slate-300)',
                      background: loginMethod === 'otp' ? 'var(--primary-50)' : '#fff',
                      color: loginMethod === 'otp' ? 'var(--primary-800)' : 'var(--slate-600)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📱 Mobile Phone + OTP
                  </button>

                  <button
                    type="button"
                    id="subtab-password"
                    onClick={() => { setLoginMethod('password'); setErrorMessage(''); setFieldErrors({}); }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: loginMethod === 'password' ? 'var(--primary-600)' : 'var(--slate-300)',
                      background: loginMethod === 'password' ? 'var(--primary-50)' : '#fff',
                      color: loginMethod === 'password' ? 'var(--primary-800)' : 'var(--slate-600)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✉️ Email & Password
                  </button>
                </div>

                {/* --- METHOD A: PHONE OTP FLOW --- */}
                {loginMethod === 'otp' && (
                  <div>
                    {otpStep === 1 ? (
                      <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label htmlFor="auth-phone-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '6px' }}>
                            Indian Mobile Number:
                          </label>
                          <div style={{ position: 'relative' }}>
                            <Phone size={17} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                              id="auth-phone-input"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="e.g. +91 98451 22891"
                              className={`auth-input ${fieldErrors.phone ? 'has-error' : ''}`}
                              style={{ paddingLeft: '38px' }}
                              required
                            />
                          </div>
                          {fieldErrors.phone && (
                            <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '4px', display: 'block' }}>
                              {fieldErrors.phone}
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          id="btn-send-otp"
                          disabled={loading}
                          className="btn btn-primary"
                          style={{ padding: '12px', justifyContent: 'center' }}
                        >
                          {loading ? 'Sending OTP SMS...' : 'Send 6-Digit OTP Code'}
                          <ArrowRight size={16} />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46' }}>
                          <div>OTP sent to <strong>{phoneNumber}</strong></div>
                          <div style={{ marginTop: '4px' }}>
                            Demo Instant Code: <span style={{ fontWeight: 800, fontSize: '0.96rem', letterSpacing: '0.1em' }}>{generatedDemoOtp}</span>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label htmlFor="auth-otp-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)' }}>
                              Enter 6-Digit OTP:
                            </label>
                            {/* OTP Expiration countdown (TC_035) */}
                            <span style={{ fontSize: '0.76rem', color: otpExpiryTimer <= 10 ? '#dc2626' : 'var(--slate-500)', fontWeight: 700 }}>
                              {otpExpiryTimer > 0 ? `Expires in ${otpExpiryTimer}s` : 'Expired'}
                            </span>
                          </div>
                          <input
                            id="auth-otp-input"
                            type="text"
                            maxLength={6}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code"
                            className="auth-input"
                            style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.2rem', fontWeight: 700 }}
                            required
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="submit"
                            id="btn-verify-otp"
                            disabled={loading || otpExpiryTimer <= 0}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                          >
                            {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
                          </button>
                          
                          {/* Resend OTP button with rate limit cooldown (TC_036, TC_037) */}
                          <button
                            type="button"
                            id="btn-resend-otp"
                            onClick={handleResendOtp}
                            disabled={loading || resendCooldown > 0}
                            className="btn btn-outline"
                            style={{ padding: '0 14px', fontSize: '0.82rem' }}
                            title="Resend verification OTP"
                          >
                            {resendCooldown > 0 ? `Wait ${resendCooldown}s` : 'Resend OTP'}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOtpStep(1)}
                          style={{ background: 'none', border: 'none', color: 'var(--slate-500)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'center', textDecoration: 'underline' }}
                        >
                          Change Mobile Number
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* --- METHOD B: EMAIL & PASSWORD FLOW --- */}
                {loginMethod === 'password' && (
                  <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label htmlFor="auth-email-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '6px' }}>
                        Registered Email:
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={17} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          id="auth-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. ravi.kumar@agriconnect.org"
                          className={`auth-input ${fieldErrors.email ? 'has-error' : ''}`}
                          style={{ paddingLeft: '38px' }}
                          disabled={lockoutTimer > 0}
                        />
                      </div>
                      {fieldErrors.email && (
                        <span id="auth-email-error" style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '4px', display: 'block' }}>
                          {fieldErrors.email}
                        </span>
                      )}
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label htmlFor="auth-password-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)' }}>
                          Account Password:
                        </label>
                        {/* Forgot password link (TC_023) */}
                        <button
                          type="button"
                          id="btn-forgot-password"
                          onClick={() => {
                            setForgotEmail(email);
                            setForgotError('');
                            setForgotSuccess('');
                            setForgotStep(1);
                            setShowForgotModal(true);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <Lock size={17} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          id="auth-password-input"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className={`auth-input ${fieldErrors.password ? 'has-error' : ''}`}
                          style={{ paddingLeft: '38px', paddingRight: '40px' }}
                          disabled={lockoutTimer > 0}
                        />
                        {/* Password masking visibility toggle (TC_021, TC_022) */}
                        <button
                          type="button"
                          id="btn-toggle-password-visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex' }}
                          title={showPassword ? 'Mask password' : 'Show password'}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <span id="auth-password-error" style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '4px', display: 'block' }}>
                          {fieldErrors.password}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      id="btn-submit-password-login"
                      disabled={loading || lockoutTimer > 0}
                      className="btn btn-primary"
                      style={{ padding: '12px', justifyContent: 'center' }}
                    >
                      {loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODE 2: REGISTRATION FORM (TC_038, TC_039, TC_040, TC_041, TC_042) */}
            {/* ========================================================================= */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#065f46' }}>
                  <strong>Direct Free Registration:</strong> Zero paperwork. Instant paperless account creation verified under National Digital Mission.
                </div>

                <div>
                  <label htmlFor="reg-name-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                    Full Legal Name: *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="reg-name-input"
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Ramesh Gowda"
                      className={`auth-input ${fieldErrors.name ? 'has-error' : ''}`}
                      style={{ paddingLeft: '38px' }}
                      required
                    />
                  </div>
                  {fieldErrors.name && (
                    <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                      {fieldErrors.name}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label htmlFor="reg-phone-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      10-Digit Mobile: *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="reg-phone-input"
                        type="tel"
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        placeholder="e.g. 9845122891"
                        className={`auth-input ${fieldErrors.phone ? 'has-error' : ''}`}
                        style={{ paddingLeft: '38px' }}
                        required
                      />
                    </div>
                    {fieldErrors.phone && (
                      <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-email-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Email (Optional):
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="reg-email-input"
                        type="email"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="e.g. ramesh@farm.org"
                        className={`auth-input ${fieldErrors.email ? 'has-error' : ''}`}
                        style={{ paddingLeft: '38px' }}
                      />
                    </div>
                    {fieldErrors.email && (
                      <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label htmlFor="reg-state-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      State:
                    </label>
                    <input
                      id="reg-state-input"
                      type="text"
                      value={regData.state}
                      onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                      className="auth-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-district-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      District:
                    </label>
                    <input
                      id="reg-district-input"
                      type="text"
                      value={regData.district}
                      onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                      placeholder="e.g. Shivamogga"
                      className="auth-input"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label htmlFor="reg-password-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Create Password: *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="reg-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className={`auth-input ${fieldErrors.password ? 'has-error' : ''}`}
                        style={{ paddingLeft: '38px', paddingRight: '36px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex' }}
                        title={showRegPassword ? 'Hide' : 'Show'}
                      >
                        {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                        {fieldErrors.password}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-confirm-password-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Confirm Password: *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        id="reg-confirm-password-input"
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className={`auth-input ${fieldErrors.confirmPassword ? 'has-error' : ''}`}
                        style={{ paddingLeft: '38px', paddingRight: '36px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex' }}
                        title={showRegConfirmPassword ? 'Hide' : 'Show'}
                      >
                        {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '2px', display: 'block' }}>
                        {fieldErrors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Terms agreement checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '4px 0' }}>
                  <input
                    type="checkbox"
                    id="reg-terms-check"
                    checked={regData.termsAccepted}
                    onChange={(e) => setRegData({ ...regData, termsAccepted: e.target.checked })}
                    style={{ marginTop: '3px' }}
                  />
                  <label htmlFor="reg-terms-check" style={{ fontSize: '0.78rem', color: 'var(--slate-600)', cursor: 'pointer' }}>
                    I agree to the Terms of Service, Privacy Policy, and RTC land verification consent.
                  </label>
                </div>
                {fieldErrors.terms && (
                  <span style={{ fontSize: '0.74rem', color: '#b91c1c', marginTop: '-6px', display: 'block' }}>
                    {fieldErrors.terms}
                  </span>
                )}

                <button
                  type="submit"
                  id="btn-submit-registration"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ padding: '12px', justifyContent: 'center', marginTop: '4px' }}
                >
                  {loading ? 'Creating Your Account...' : `Register as ${selectedRole.toUpperCase()}`}
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL (TC_023, TC_024, TC_025) */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-800)', fontWeight: 800, fontSize: '1.1rem' }}>
                <KeyRound size={20} />
                <span>Reset Password</span>
              </div>
              <button
                type="button"
                id="btn-close-forgot-modal"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {forgotError && (
              <div id="forgot-error-msg" style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#b91c1c', marginBottom: '12px' }}>
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div id="forgot-success-msg" style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#065f46', marginBottom: '12px' }}>
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {forgotStep === 1 ? (
                <>
                  <p style={{ fontSize: '0.84rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                    Enter your registered email address or mobile number. We will send you a verification code to reset your password.
                  </p>
                  <div>
                    <label htmlFor="forgot-email-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Registered Email / Phone:
                    </label>
                    <input
                      id="forgot-email-input"
                      type="text"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. ravi.kumar@agriconnect.org"
                      className="auth-input"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="submit"
                      id="btn-request-reset-code"
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                    >
                      Send Reset Code
                    </button>
                    <button
                      type="button"
                      id="btn-cancel-forgot"
                      onClick={() => setShowForgotModal(false)}
                      className="btn btn-outline"
                      style={{ padding: '10px 16px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="forgot-otp-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Enter 6-Digit Reset Code:
                    </label>
                    <input
                      id="forgot-otp-input"
                      type="text"
                      maxLength={6}
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value)}
                      className="auth-input"
                      placeholder="482910"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="forgot-new-pass-input" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-800)', display: 'block', marginBottom: '4px' }}>
                      Enter New Password:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="forgot-new-pass-input"
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="auth-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', display: 'flex' }}
                      >
                        {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      type="submit"
                      id="btn-save-new-password"
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="btn btn-outline"
                      style={{ padding: '10px 16px' }}
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GOOGLE SIGN IN SIMULATION MODAL (TC_026, TC_027) */}
      {/* ========================================================================= */}
      {showGoogleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-900)' }}>Sign in with Google</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>to continue to Agri-Connect Portal</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {[
                { name: 'Ravi Kumar', email: 'ravi.kumar@gmail.com', role: 'farmer', roleTitle: '🌾 Citizen Farmer' },
                { name: 'Ananya Sharma', email: 'ananya.metrofresh@gmail.com', role: 'buyer', roleTitle: '🛒 Commercial Buyer' },
                { name: 'Manoj Patel', email: 'manoj.patel@gmail.com', role: 'seller', roleTitle: '🚜 Certified Agri-Dealer' }
              ].map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  id={`btn-google-account-${acc.role}`}
                  onClick={() => handleGoogleSelect(acc.role)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--slate-200)',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-800)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {acc.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-900)' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{acc.email} • {acc.roleTitle}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {/* TC_027: Cancel Google login returns safely to login page */}
              <button
                type="button"
                id="btn-cancel-google-auth"
                onClick={() => setShowGoogleModal(false)}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Cancel Google Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACEBOOK SIGN IN SIMULATION MODAL (TC_028, TC_029) */}
      {/* ========================================================================= */}
      {showFacebookModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-card" style={{ background: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1877f2', color: '#fff', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                f
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark-900)' }}>Log in with Facebook</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>Agri-Connect will receive your name and profile picture.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                id="btn-facebook-continue"
                onClick={() => handleFacebookSelect(selectedRole || 'farmer')}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#1877f2',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                Continue as Ravi Kumar ({selectedRole.toUpperCase()})
              </button>

              {/* TC_029: Cancel Facebook login returns safely to login page */}
              <button
                type="button"
                id="btn-cancel-facebook-auth"
                onClick={() => setShowFacebookModal(false)}
                className="btn btn-outline"
                style={{ justifyContent: 'center' }}
              >
                Cancel Facebook Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
