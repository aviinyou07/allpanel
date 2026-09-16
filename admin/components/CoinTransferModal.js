'use client';

import { useState } from 'react';
import { X, Coins, AlertCircle } from 'lucide-react';

export default function CoinTransferModal({ isOpen, onClose, onTransfer, receiver, senderBalance, senderRole }) {
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseInt(amount) || 0;
  const isUnlimited = senderRole === 'SUPREME';
  const remaining = isUnlimited ? '∞' : (senderBalance - numAmount).toLocaleString('en-IN');
  const isValid = numAmount > 0 && (isUnlimited || numAmount <= senderBalance);

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: receiver.id,
          amount: numAmount,
          remarks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Transfer failed');
        setShowConfirm(false);
        setLoading(false);
        return;
      }

      onTransfer?.(data);
      resetAndClose();
    } catch {
      setError('Network error');
      setShowConfirm(false);
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setAmount('');
    setRemarks('');
    setError('');
    setShowConfirm(false);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={resetAndClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-800">Transfer Coins</h3>
          </div>
          <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showConfirm ? (
          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Receiver */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Receiver</label>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm font-medium text-slate-800">{receiver?.full_name || receiver?.fullName}</p>
                <p className="text-xs text-slate-500">@{receiver?.username} • {receiver?.role}</p>
              </div>
            </div>

            {/* Available Balance */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Available Balance</label>
              <p className="text-lg font-bold text-slate-800">
                {isUnlimited ? '∞ (Unlimited)' : Number(senderBalance).toLocaleString('en-IN')} Coins
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                placeholder="Enter coin amount"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
                min="1"
              />
            </div>

            {/* Remaining */}
            {numAmount > 0 && (
              <div className="px-4 py-2 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Remaining Balance After Transfer</p>
                <p className={`text-sm font-semibold ${!isUnlimited && numAmount > senderBalance ? 'text-red-600' : 'text-slate-800'}`}>
                  {remaining} Coins
                </p>
              </div>
            )}

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!isValid}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg disabled:cursor-not-allowed"
              >
                Transfer
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation */
          <div className="p-6 space-y-4">
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coins className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Confirm Transfer</h4>
              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to transfer <span className="font-bold text-slate-800">{Number(numAmount).toLocaleString('en-IN')}</span> coins to <span className="font-bold text-slate-800">{receiver?.full_name || receiver?.fullName}</span>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowConfirm(false)} disabled={loading} className="px-5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg">
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </>
                ) : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
