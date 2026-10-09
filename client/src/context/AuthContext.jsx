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

  const parseJsonResponse = async (res, method, url) => {
    const contentType = res.headers && typeof res.headers.get === 'function'
      ? res.headers.get('content-type')
      : (res.headers ? res.headers['content-type'] : 'application/json');

    if (!contentType || !contentType.includes('application/json')) {
      const text = typeof res.text === 'function' ? await res.text() : '';
      console.error(`[AuthContext] ${method} ${url} failed with non-JSON response (${res.status}):`, text.slice(0, 150));
      throw new Error(`Server returned non-JSON response (${res.status}) on ${method} ${url}: ${text.slice(0, 80)}`);
    }

    const data = await res.json();
    if (!res.ok) {
      console.error(`[AuthContext] ${method} ${url} failed with status ${res.status}:`, data);
      throw new Error(data.error || data.message || `Request failed (${res.status}) on ${method} ${url}`);
    }
    return data;
  };

  const requestOtp = async (email) => {
    const url = '/api/auth/request-otp';
    const method = 'POST';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await parseJsonResponse(res, method, url);
      if (data.devOtp) {
        console.log(`%c[AUTH DEV] Your OTP is: ${data.devOtp}`, 'color: #10b981; font-weight: bold; font-size: 14px;');
      }
      return data;
    } catch (err) {
      console.error(`[AuthContext] requestOtp error (${method} ${url}):`, err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email, otp) => {
    const url = '/api/auth/verify-otp';
    const method = 'POST';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await parseJsonResponse(res, method, url);

      setToken(data.token);
      saveToken(data.token);

      setAccount(data.account);
      saveAccount(data.account);

      const initialProfile = data.account?.profiles?.[0] || null;
      setActiveProfile(initialProfile);
      if (initialProfile) {
        saveActiveProfileId(initialProfile.profileId);
      }

      if (!data.isNewAccount) {
        setIsAuthModalOpen(false);
      }
      return data;
    } catch (err) {
      console.error(`[AuthContext] verifyOtp error (${method} ${url}):`, err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    if (!token) return;
    const url = '/api/auth/profiles';
    const method = 'GET';
    setLoading(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await parseJsonResponse(res, method, url);
      if (data.profiles) {
        setAccount(prev => {
          const updated = prev ? { ...prev, profiles: data.profiles } : { profiles: data.profiles };
          saveAccount(updated);
          return updated;
        });
      }
      return data;
    } catch (err) {
      console.error(`[AuthContext] fetchProfiles error (${method} ${url}):`, err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (name, avatar = 'star') => {
    if (!token) return;
    const url = '/api/auth/profiles';
    const method = 'POST';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, avatar })
      });
      const data = await parseJsonResponse(res, method, url);

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
      console.error(`[AuthContext] createProfile error (${method} ${url}):`, err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchProfile = async (profileId) => {
    if (!token) return;
    const url = '/api/auth/profiles/switch';
    const method = 'POST';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileId })
      });
      const data = await parseJsonResponse(res, method, url);

      if (data.activeProfile) {
        setActiveProfile(data.activeProfile);
        saveActiveProfileId(data.activeProfile.profileId);
      }
      return data;
    } catch (err) {
      console.error(`[AuthContext] switchProfile error (${method} ${url}):`, err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = async (profileId) => {
    if (!token) return;
    const url = `/api/auth/profiles/${profileId}/reset`;
    const method = 'POST';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await parseJsonResponse(res, method, url);
      return data;
    } catch (err) {
      console.error(`[AuthContext] resetProfile error (${method} ${url}):`, err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileName = async (profileId, newName) => {
    if (!token) return;
    const url = `/api/auth/profiles/${profileId}`;
    const method = 'PUT';
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      const data = await parseJsonResponse(res, method, url);

      if (data.profile) {
        setAccount(prev => {
          if (!prev || !prev.profiles) return prev;
          const updatedProfiles = prev.profiles.map(p =>
            p.profileId === profileId ? { ...p, name: data.profile.name } : p
          );
          const updated = { ...prev, profiles: updatedProfiles };
          saveAccount(updated);
          return updated;
        });

        setActiveProfile(prev => {
          if (prev && prev.profileId === profileId) {
            return { ...prev, name: data.profile.name };
          }
          return prev;
        });
      }
      return data;
    } catch (err) {
      console.error(`[AuthContext] updateProfileName error (${method} ${url}):`, err.message);
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
    updateProfileName,
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
      updateProfileName: async () => {},
      resetProfile: async () => {},
      logout: () => {}
    };
  }
  return context;
};

export default AuthContext;
