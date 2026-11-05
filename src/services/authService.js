// Authentication & User Accounts Service with localStorage Persistence
import { MOCK_USERS } from '../data/mockUsers.js';

const STORAGE_USERS_KEY = 'agri_registered_users';
const STORAGE_ACTIVE_USER_KEY = 'agri_active_user';

// Initial default accounts seeded for testing & demo logins
const DEFAULT_ACCOUNTS = [
  {
    id: 'user_farmer_001',
    name: 'Ravi Kumar',
    role: 'farmer',
    email: 'ravi.kumar@agriconnect.org',
    phone: '+91 98451 22891',
    password: 'FarmerPass@2026',
    state: 'Karnataka',
    district: 'Shivamogga',
    taluk: 'Thirthahalli',
    village: 'Kudumallige',
    landAcres: 2.5,
    mainCrop: 'Tomato (Hybrid Vaishali)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
    verificationStatus: 'Verified Citizen Farmer',
    kycBadge: 'Aadhaar & Land RTC Verified',
    registeredDate: '14 Jan 2025'
  },
  {
    id: 'user_buyer_002',
    name: 'Ananya Sharma',
    role: 'buyer',
    email: 'ananya.s@metrofresh.in',
    phone: '+91 98860 44521',
    password: 'BuyerPass@2026',
    companyName: 'Metro Fresh Foods Private Ltd.',
    gstin: '29ABCDE1234F1Z5',
    state: 'Karnataka',
    district: 'Bengaluru',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80',
    verificationStatus: 'Verified Commercial Buyer',
    registeredDate: '20 Feb 2025'
  },
  {
    id: 'user_seller_003',
    name: 'Manoj Patel',
    role: 'seller',
    email: 'manoj@krishimitra.org',
    phone: '+91 94480 99812',
    password: 'SellerPass@2026',
    companyName: 'KrishiMitra Agri Solutions Ltd.',
    dealerLicense: 'KA-FCO-SEED-2024-81',
    state: 'Karnataka',
    district: 'Shivamogga',
    city: 'Shivamogga',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
    verificationStatus: 'Licensed Agri-Dealer',
    registeredDate: '05 Mar 2025'
  },
  {
    id: 'user_admin_000',
    name: 'Dr. Srinivas Rao',
    role: 'admin',
    email: 'admin@agriconnect.in',
    phone: '+91 80 2345 6789',
    password: 'ChangeThisImmediately@2026',
    department: 'Digital Agriculture Mission & Moderation Cell',
    state: 'Karnataka',
    district: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80',
    verificationStatus: 'Platform SuperAdmin',
    registeredDate: '01 Jan 2025'
  }
];

/**
 * Get all registered users from localStorage, initialized with defaults
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    return parsed;
  } catch (e) {
    console.warn('Error reading registered users from localStorage:', e);
    return DEFAULT_ACCOUNTS;
  }
}

/**
 * Register a new user and persist to localStorage
 */
export function registerUser(newUserData) {
  const users = getRegisteredUsers();
  const cleanEmail = (newUserData.email || '').trim().toLowerCase();
  const cleanPhone = (newUserData.phone || '').trim().replace(/\s+/g, '');

  // Check for duplicate email or phone if provided
  if (cleanEmail) {
    const existingEmail = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existingEmail) {
      throw new Error(`An account with email "${cleanEmail}" already exists. Please sign in instead.`);
    }
  }

  if (cleanPhone && cleanPhone.length >= 10) {
    const cleanDigits = cleanPhone.slice(-10);
    const existingPhone = users.find(u => (u.phone || '').replace(/\D/g, '').endsWith(cleanDigits));
    if (existingPhone) {
      throw new Error(`An account with mobile number "${newUserData.phone}" already exists. Please sign in.`);
    }
  }

  const role = newUserData.role || 'farmer';
  const defaultAvatars = {
    farmer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
    buyer: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80',
    seller: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
    admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&auto=format&fit=crop&q=80'
  };

  const createdUser = {
    id: `user_${role}_${Date.now()}`,
    name: newUserData.name.trim(),
    role: role,
    email: cleanEmail || `${newUserData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@agriconnect.org`,
    phone: newUserData.phone.trim(),
    password: newUserData.password || 'FarmerPass@2026',
    state: newUserData.state || 'Karnataka',
    district: newUserData.district || 'Shivamogga',
    taluk: newUserData.taluk || '',
    village: newUserData.village || '',
    landAcres: newUserData.landAcres ? parseFloat(newUserData.landAcres) : 1.5,
    mainCrop: newUserData.mainCrop || 'Mixed Agriculture',
    companyName: newUserData.companyName || '',
    gstin: newUserData.gstin || '',
    dealerLicense: newUserData.dealerLicense || '',
    avatar: defaultAvatars[role] || defaultAvatars.farmer,
    verificationStatus: 'Verified Account (Govt Verified ID)',
    kycBadge: 'Aadhaar & Mobile Verified',
    registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    isLoggedIn: true
  };

  users.push(createdUser);
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(createdUser));
  } catch (e) {
    console.warn('Error saving new user to localStorage:', e);
  }

  // Asynchronously sync new registration with MongoDB Atlas
  try {
    syncUserToMongoDB(createdUser);
  } catch (e) {}

  return createdUser;
}

/**
 * Authenticate with Email & Password
 */
export function authenticateWithPassword(emailOrPhone, password, requestedRole = null) {
  const users = getRegisteredUsers();
  const input = (emailOrPhone || '').trim().toLowerCase();
  const inputDigits = input.replace(/\D/g, '');

  // Find user by email or phone digits
  const matchedUser = users.find(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uPhone = (u.phone || '').replace(/\D/g, '');
    const emailMatch = uEmail && uEmail === input;
    const phoneMatch = inputDigits && inputDigits.length >= 10 && uPhone.endsWith(inputDigits.slice(-10));
    return emailMatch || phoneMatch;
  });

  if (!matchedUser) {
    try {
      syncActivityLogToMongoDB({
        identifier: emailOrPhone,
        action: 'LOGIN_PASSWORD',
        status: 'FAILED',
        failureReason: 'No registered account found'
      });
    } catch (e) {}
    throw new Error(`No account found for "${emailOrPhone}". Please check your email or click "Register New User" to create a free account.`);
  }

  // Validate password
  if (matchedUser.password && matchedUser.password !== password) {
    try {
      syncActivityLogToMongoDB({
        userId: matchedUser.id,
        identifier: matchedUser.email || matchedUser.phone,
        userName: matchedUser.name,
        role: matchedUser.role,
        action: 'LOGIN_PASSWORD',
        status: 'FAILED',
        failureReason: 'Incorrect password'
      });
    } catch (e) {}
    throw new Error(`Incorrect password for ${matchedUser.email || matchedUser.name}. Please enter your correct password or click "Forgot Password?".`);
  }

  const authenticatedUser = {
    ...matchedUser,
    isLoggedIn: true
  };

  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(authenticatedUser));
  } catch (e) {
    console.warn('Error persisting active session:', e);
  }

  // Log successful login to MongoDB Atlas
  try {
    syncActivityLogToMongoDB({
      userId: authenticatedUser.id,
      identifier: authenticatedUser.email || authenticatedUser.phone,
      userName: authenticatedUser.name,
      role: authenticatedUser.role,
      action: 'LOGIN_PASSWORD',
      status: 'SUCCESS'
    });
  } catch (e) {}

  return authenticatedUser;
}

/**
 * Request password reset link / code
 */
export function requestPasswordReset(emailOrPhone) {
  const users = getRegisteredUsers();
  const input = (emailOrPhone || '').trim().toLowerCase();
  const inputDigits = input.replace(/\D/g, '');

  const matchedUser = users.find(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uPhone = (u.phone || '').replace(/\D/g, '');
    const emailMatch = uEmail && uEmail === input;
    const phoneMatch = inputDigits && inputDigits.length >= 10 && uPhone.endsWith(inputDigits.slice(-10));
    return emailMatch || phoneMatch;
  });

  if (!matchedUser) {
    throw new Error(`No registered account found with email "${emailOrPhone}". Please check the address or register.`);
  }

  const resetCode = '482910';
  return {
    success: true,
    user: matchedUser,
    resetCode: resetCode,
    message: `Password reset instructions and verification code sent to ${matchedUser.email}. (Demo Code: ${resetCode})`
  };
}

/**
 * Reset password for confirmed user
 */
export function resetPassword(emailOrPhone, newPassword) {
  const users = getRegisteredUsers();
  const input = (emailOrPhone || '').trim().toLowerCase();
  const inputDigits = input.replace(/\D/g, '');

  const idx = users.findIndex(u => {
    const uEmail = (u.email || '').toLowerCase();
    const uPhone = (u.phone || '').replace(/\D/g, '');
    const emailMatch = uEmail && uEmail === input;
    const phoneMatch = inputDigits && inputDigits.length >= 10 && uPhone.endsWith(inputDigits.slice(-10));
    return emailMatch || phoneMatch;
  });

  if (idx === -1) {
    throw new Error(`User not found.`);
  }

  users[idx].password = newPassword;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('Error updating password:', e);
  }

  // Log password reset event to MongoDB Atlas
  try {
    syncActivityLogToMongoDB({
      userId: users[idx].id,
      identifier: users[idx].email || users[idx].phone,
      userName: users[idx].name,
      role: users[idx].role,
      action: 'PASSWORD_RESET',
      status: 'SUCCESS'
    });
  } catch (e) {}

  return users[idx];
}

/**
 * Authenticate or create user via Mobile Phone OTP
 */
export function authenticateWithOtp(phone, otpCode, requestedRole = 'farmer') {
  const cleanPhone = (phone || '').trim();
  const cleanDigits = cleanPhone.replace(/\D/g, '');

  if (cleanDigits.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  const users = getRegisteredUsers();
  let matchedUser = users.find(u => {
    const uPhone = (u.phone || '').replace(/\D/g, '');
    return uPhone.endsWith(cleanDigits.slice(-10));
  });

  if (!matchedUser) {
    // Auto-create new verified user account for this phone
    matchedUser = registerUser({
      name: `Kisan User (${cleanDigits.slice(-4)})`,
      phone: cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${cleanPhone}`,
      role: requestedRole,
      password: 'FarmerPass@2026',
      state: 'Karnataka',
      district: 'Shivamogga',
      termsAccepted: true
    });
  }

  const activeUser = {
    ...matchedUser,
    role: requestedRole || matchedUser.role || 'farmer',
    isLoggedIn: true
  };

  try {
    localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(activeUser));
  } catch (e) {
    console.warn('Error persisting active user:', e);
  }

  // Log successful OTP login to MongoDB Atlas
  try {
    syncActivityLogToMongoDB({
      userId: activeUser.id,
      identifier: activeUser.phone,
      userName: activeUser.name,
      role: activeUser.role,
      action: 'LOGIN_OTP',
      status: 'SUCCESS'
    });
  } catch (e) {}

  return activeUser;
}

/**
 * Get active user from localStorage (or return null / default mock if logged out)
 */
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading active session from localStorage:', e);
  }
  return null;
}

/**
 * Set active user in localStorage
 */
export function setActiveUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
    }
  } catch (e) {
    console.warn('Error setting active user in localStorage:', e);
  }
}

/**
 * Logout current active user
 */
export function logoutActiveUser() {
  try {
    const active = getActiveUser();
    if (active) {
      try {
        syncActivityLogToMongoDB({
          userId: active.id,
          identifier: active.email || active.phone,
          userName: active.name,
          role: active.role,
          action: 'LOGOUT',
          status: 'SUCCESS'
        });
      } catch (e) {}
    }
    localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
  } catch (e) {
    console.warn('Error removing active user:', e);
  }
}

/**
 * Log authentication & session activity events directly to MongoDB Atlas
 */
export async function syncActivityLogToMongoDB(logData) {
  try {
    if (typeof fetch === 'undefined') return null;
    const apiBase = (typeof window !== 'undefined' && window.__AGRI_API_BASE__) || '/api';
    const res = await fetch(`${apiBase}/auth/log-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Non-blocking in offline or testing mode
    return null;
  }
}

/**
 * Asynchronously sync newly registered user to MongoDB Atlas
 */
export async function syncUserToMongoDB(userData) {
  try {
    const apiBase = (typeof window !== 'undefined' && window.__AGRI_API_BASE__) || '/api';
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn('MongoDB Atlas sync notice:', data.error || res.statusText);
      return null;
    }
    const result = await res.json();
    console.log('✓ Successfully synced user to MongoDB Atlas:', result);
    return result;
  } catch (err) {
    console.info('MongoDB Atlas API offline or backend not running. Maintained in local session.');
    return null;
  }
}

/**
 * Check MongoDB Atlas connection health
 */
export async function checkMongoDBHealth() {
  try {
    const apiBase = (typeof window !== 'undefined' && window.__AGRI_API_BASE__) || '/api';
    const res = await fetch(`${apiBase}/health`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { connected: false, database: 'MongoDB Atlas', status: 'offline' };
}
