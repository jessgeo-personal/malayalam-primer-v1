import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AVATARS = ['star', 'rocket', 'sun', 'flower'];

const ProfileSelector = () => {
  const { account, activeProfile, switchProfile, createProfile, resetProfile, loading } = useAuth();
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('rocket');
  const [actionError, setActionError] = useState(null);

  const profiles = account?.profiles || [];
  const isCeilingReached = profiles.length >= 3;

  const handleSwitch = async (profileId) => {
    if (activeProfile?.profileId === profileId) return;
    try {
      setActionError(null);
      await switchProfile(profileId);
    } catch (err) {
      setActionError(err.message || 'Failed to switch profile');
    }
  };

  const handleCreateProfile = async (e) => {
    e?.preventDefault();
    if (isCeilingReached) return;
    if (!newProfileName.trim()) {
      setActionError('Please enter a profile name');
      return;
    }

    try {
      setActionError(null);
      await createProfile(newProfileName.trim(), selectedAvatar);
      setNewProfileName('');
    } catch (err) {
      setActionError(err.message || 'Failed to add profile');
    }
  };

  const handleResetProfile = async (e, profileId, name) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to reset progress for this learner (${name})? All completed items and review scores will be reset to zero.`
    );
    if (!confirmed) return;

    try {
      setActionError(null);
      await resetProfile(profileId);
    } catch (err) {
      setActionError(err.message || 'Failed to reset profile');
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="w-full bg-[#FFFDF6] border border-stone-200/80 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-black text-[#1A1E26]">Learner Profiles</h3>
          <p className="text-xs text-stone-500">
            {profiles.length} / 3 profiles registered for {account.email}
          </p>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600">
          {actionError}
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {profiles.map((p) => {
          const isActive = activeProfile?.profileId === p.profileId;
          return (
            <div
              key={p.profileId}
              data-testid={`profile-card-${p.profileId}`}
              onClick={() => handleSwitch(p.profileId)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                isActive
                  ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-300/50'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">
                  {p.avatar === 'rocket' ? '🚀' : p.avatar === 'sun' ? '☀️' : '⭐'}
                </span>
                {isActive && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                    Active
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-black text-sm text-[#1A1E26] truncate">{p.name}</h4>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  {p.isDefault ? 'Default Profile' : 'Learner'}
                </span>
              </div>

              {/* Reset Progress Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="button"
                  data-testid={`reset-profile-${p.profileId}-btn`}
                  onClick={(e) => handleResetProfile(e, p.profileId, p.name)}
                  className="text-[11px] font-bold text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Reset Learner Progress"
                >
                  Reset Progress
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Profile Section */}
      <div className="pt-4 border-t border-stone-200/80">
        <form onSubmit={handleCreateProfile} className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder={isCeilingReached ? 'Profile limit reached (Max 3)' : 'New Learner Name'}
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            disabled={isCeilingReached || loading}
            className="flex-1 w-full px-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-sm font-semibold text-[#1A1E26] focus:outline-none focus:ring-2 focus:ring-[#1A1E26] disabled:bg-stone-100 disabled:text-stone-400 shadow-sm"
          />

          <button
            type="submit"
            data-testid="add-profile-btn"
            disabled={isCeilingReached || loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#1A1E26] hover:bg-[#2A303C] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isCeilingReached ? 'Limit Reached' : 'Add Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSelector;
