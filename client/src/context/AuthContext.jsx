import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const getStoredToken = () => localStorage.getItem('mp_auth_token') || localStorage.getItem('auth_token') || null;
const getStoredProfileId = () => localStorage.getItem('mp_active_profile_id') || localStorage.getItem('active_profile_id') || null;
const getStoredAccount = () => {
  try {
    const raw = localStorage.getItem('mp_account') || localStorage.getItem('account');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const saveToken = (tok) => {
  if (tok) {
    localStorage.setItem('mp_auth_token', tok);
    localStorage.setItem('auth_token', tok);
  } else {
    localStorage.removeItem('mp_auth_token');
    localStorage.removeItem('auth_token');
  }
};

const saveActiveProfileId = (pId) => {
  if (pId) {
    localStorage.setItem('mp_active_profile_id', pId);
    localStorage.setItem('active_profile_id', pId);
  } else {
    localStorage.removeItem('mp_active_profile_id');
    localStorage.removeItem('active_profile_id');
  }
};

const saveAccount = (acc) => {
  if (acc) {
    const raw = JSON.stringify(acc);
    localStorage.setItem('mp_account', raw);
    localStorage.setItem('account', raw);
  } else {
    localStorage.removeItem('mp_account');
    localStorage.removeItem('account');
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken);
  const [account, setAccount] = useState(getStoredAccount);
  const [activeProfile, setActiveProfile] = useState(() => {
    const acc = getStoredAccount();
    const storedId = getStoredProfileId();
    if (acc && acc.profiles && acc.profiles.length > 0) {
      if (storedId) {
        const found = acc.profiles.find(p => p.profileId === storedId);
        if (found) return found;
      }
      return acc.profiles[0];
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && account);

  const openAuthModal = () => {
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setError(null);
    setIsAuthModalOpen(false);
  };

  const requestOtp = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      setToken(data.token);
      saveToken(data.token);

      setAccount(data.account);
      saveAccount(data.account);

      const initialProfile = data.account?.profiles?.[0] || null;
      setActiveProfile(initialProfile);
      if (initialProfile) {
        saveActiveProfileId(initialProfile.profileId);
      }

      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/profiles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.profiles) {
        setAccount(prev => {
          const updated = prev ? { ...prev, profiles: data.profiles } : { profiles: data.profiles };
          saveAccount(updated);
          return updated;
        });
      }
      return data;
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (name, avatar = 'star') => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, avatar })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      if (data.profiles) {
        setAccount(prev => {
          const updated = { ...prev, profiles: data.profiles };
          saveAccount(updated);
          return updated;
        });
      }
      if (data.profile) {
        setActiveProfile(data.profile);
        saveActiveProfileId(data.profile.profileId);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = async (profileId) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/profiles/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to switch profile');
      }

      if (data.activeProfile) {
        setActiveProfile(data.activeProfile);
        saveActiveProfileId(data.activeProfile.profileId);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = async (profileId) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/profiles/${profileId}/reset`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset profile');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAccount(null);
    setActiveProfile(null);
    setError(null);
    saveToken(null);
    saveActiveProfileId(null);
    saveAccount(null);
  };

  const value = {
    token,
    account,
    activeProfile,
    isAuthenticated,
    isAuthModalOpen,
    loading,
    error,
    openAuthModal,
    closeAuthModal,
    requestOtp,
    verifyOtp,
    fetchProfiles,
    createProfile,
    switchProfile,
    resetProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      token: null,
      account: null,
      activeProfile: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      isAuthModalOpen: false,
      openAuthModal: () => {},
      closeAuthModal: () => {},
      requestOtp: async () => {},
      verifyOtp: async () => {},
      fetchProfiles: async () => {},
      createProfile: async () => {},
      switchProfile: async () => {},
      resetProfile: async () => {},
      logout: () => {}
    };
  }
  return context;
};

export default AuthContext;
