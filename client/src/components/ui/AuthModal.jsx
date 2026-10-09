import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, requestOtp, verifyOtp, updateProfileName, activeProfile, account, loading, error } = useAuth();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Onboarding
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [localError, setLocalError] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setLearnerName('');
    setLocalError(null);
    closeAuthModal();
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setLocalError('Please enter your email');
      return;
    }
    setLocalError(null);
    try {
      await requestOtp(email.trim());
      setStep(2);
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otp.trim()) {
      setLocalError('Please enter the 6-digit OTP');
      return;
    }
    setLocalError(null);
    try {
      const result = await verifyOtp(email.trim(), otp.trim());
      if (result && result.isNewAccount) {
        setStep(3);
        setLocalError(null);
        return;
      }
      handleClose();
    } catch (err) {
      setLocalError(err.message || 'Invalid OTP code');
    }
  };

  const handleSaveLearnerName = async (e) => {
    e?.preventDefault();
    if (!learnerName.trim()) {
      setLocalError("Please enter your learner's name");
      return;
    }
    setLocalError(null);
    try {
      const firstProfileId = activeProfile?.profileId || account?.profiles?.[0]?.profileId || 'p1';
      await updateProfileName(firstProfileId, learnerName.trim());
      handleClose();
    } catch (err) {
      setLocalError(err.message || 'Failed to save learner name');
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF6] border-2 border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
            Parent Access
          </span>
          <h2 className="text-2xl font-black text-[#1A1E26] tracking-tight">
            {step === 1 ? 'Parent Account Login' : step === 2 ? 'Enter Verification Code' : 'Learner Onboarding'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {step === 1 
              ? 'Receive a secure 6-digit code to access and sync learner profiles.' 
              : step === 2
              ? `A 6-digit code was sent to ${email}`
              : 'Set up your learner profile to begin.'}
          </p>
        </div>

        {/* Error Feedback */}
        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
            {displayError}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address
              </label>
              <input 
                type="email"
                data-testid="auth-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-300 text-[#1A1E26] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1E26] shadow-sm transition-all"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              data-testid="auth-send-otp-btn"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#1A1E26] hover:bg-[#2A303C] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                6-Digit Code
              </label>
              <input 
                type="text"
                data-testid="auth-otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-300 text-center tracking-[0.4em] font-mono text-xl font-black text-[#1A1E26] focus:outline-none focus:ring-2 focus:ring-[#1A1E26] shadow-sm transition-all"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              data-testid="auth-verify-otp-btn"
              disabled={loading || otp.length < 6}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#1A1E26] hover:bg-[#2A303C] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 text-center transition-colors pt-1 cursor-pointer"
            >
              ← Use a different email
            </button>
          </form>
        )}

        {/* Step 3: Learner Onboarding Form */}
        {step === 3 && (
          <form onSubmit={handleSaveLearnerName} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-600 mb-1.5">
                What is your learner's name?
              </label>
              <input 
                type="text"
                data-testid="onboarding-learner-name-input"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                placeholder="e.g., Aarav, Diya"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-stone-300 text-[#1A1E26] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1E26] shadow-sm transition-all"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              data-testid="onboarding-save-start-btn"
              disabled={loading || !learnerName.trim()}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#1A1E26] hover:bg-[#2A303C] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save & Start'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
