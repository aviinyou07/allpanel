'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Copy, Check, ShieldAlert } from 'lucide-react';

export default function CreateUserModal({ isOpen, onClose, onCreate, targetRole, allowedRoles }) {
  const [currentRole, setCurrentRole] = useState(targetRole || (allowedRoles && allowedRoles[0]) || 'USER');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    status: 'ACTIVE',
    initialCredit: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (targetRole) {
      setCurrentRole(targetRole);
    } else if (allowedRoles && allowedRoles.length > 0) {
      setCurrentRole(allowedRoles[0]);
    }
  }, [targetRole, allowedRoles]);

  if (!isOpen) return null;

  const roleLabels = {
    SUPER_ADMIN: 'Super Admin',
    MASTER: 'Master',
    USER: 'User',
  };

  const handleAutoGenerate = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const passNum = Math.floor(1000 + Math.random() * 9000);
    const generatedUsername = `usr_${randomNum}`;
    const generatedPassword = `Pass@${passNum}`;

    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || `Player ${randomNum.toString().slice(-4)}`,
      username: generatedUsername,
      password: generatedPassword,
      confirmPassword: generatedPassword,
    }));
    setError('');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          role: currentRole,
          status: formData.status,
          initialCredit: currentRole === 'USER' ? parseInt(formData.initialCredit || 0, 10) : 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create');
        setLoading(false);
        return;
      }

      onCreate?.(data);

      if (currentRole === 'USER') {
        // Keep credentials in modal to show copy card
        setCreatedCredentials({
          username: formData.username,
          password: formData.password,
          initialCredit: formData.initialCredit,
          fullName: formData.fullName,
        });
        setLoading(false);
      } else {
        resetAndClose();
      }
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdCredentials) return;
    const text = `🎉 Welcome to Allpanel8!\nHere are your login credentials:\n\n🆔 Username: ${createdCredentials.username}\n🔑 Password: ${createdCredentials.password}\n💰 Loaded Tokens: ₹${createdCredentials.initialCredit}\n\n⚠️ Note: You will be asked to change your password immediately upon first login.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetAndClose = () => {
    setFormData({
      fullName: '',
      username: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      status: 'ACTIVE',
      initialCredit: 100,
    });
    setError('');
    setCreatedCredentials(null);
    setCopied(false);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={resetAndClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              {createdCredentials ? 'Account Credentials Ready' : `Create ${roleLabels[currentRole] || currentRole}`}
            </h3>
          </div>
          <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdCredentials ? (
          /* Credentials Copy Screen for WhatsApp/Telegram */
          <div className="p-6 space-y-5 animate-fadeIn">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Account Created Successfully!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Send these details to your client on WhatsApp or Telegram.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-sm space-y-2 border border-slate-800 shadow-inner">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 text-xs">Username:</span>
                <span className="font-bold text-amber-400 select-all">{createdCredentials.username}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 text-xs">Temp Password:</span>
                <span className="font-bold text-emerald-400 select-all">{createdCredentials.password}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400 text-xs">Loaded Balance:</span>
                <span className="font-bold text-cyan-400">₹{createdCredentials.initialCredit}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-2 text-[11px] text-slate-400 font-sans">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Player will be forced to change this password upon first login.</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials for WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
            )}

            {/* Role Selector if actor has permission to create multiple roles */}
            {allowedRoles && allowedRoles.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Role *</label>
                <select
                  value={currentRole}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setCurrentRole(newRole);
                    if (newRole === 'USER') {
                      handleChange('initialCredit', 100);
                    } else {
                      handleChange('initialCredit', 0);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white font-semibold"
                >
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r] || r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentRole === 'USER' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Generate ID & Password
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text" required value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username *</label>
                <input
                  type="text" required value={formData.username} onChange={(e) => handleChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="Optional email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile / WhatsApp</label>
                <input
                  type="text" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  placeholder="Optional mobile"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password *</label>
                <input
                  type="text" required value={formData.password} onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  placeholder="Enter temporary password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="text" required value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {currentRole === 'USER' && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                <label className="block text-sm font-semibold text-blue-950 mb-1">Initial Token Deposit (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.initialCredit}
                    onChange={(e) => handleChange('initialCredit', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                  <div className="flex gap-1">
                    {[100, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleChange('initialCredit', amt)}
                        className="px-2.5 py-1.5 bg-white hover:bg-blue-100 border border-blue-300 rounded text-xs font-semibold text-blue-800 transition-colors"
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">
                  Tokens will be credited directly from your wallet into the user ID.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status} onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg flex items-center gap-2 shadow-sm">
                {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {loading ? 'Creating...' : `Create ${roleLabels[targetRole] || ''}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
