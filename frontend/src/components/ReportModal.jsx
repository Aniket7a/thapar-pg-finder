import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';
import api from '../services/api';

const reasons = [
  'Fraudulent Listing',
  'Misleading Photos/Prices',
  'Harassment or Abuse',
  'Illegal Activity',
  'Fake Reviews',
  'Already Occupied / Ghost Listing',
  'Other',
];

const ReportModal = ({ property, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !property) return null;

  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!details.trim()) {
      setError('Please provide specific details explaining the issue.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reports', {
        propertyId: property._id,
        reportedUserId: property.owner?._id || property.owner,
        reason,
        details,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess();
        alert('Thank you for reporting. Our TIET accommodation compliance team will investigate.');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-900 text-base">Report Property / Owner</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Evidence / Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe what occurred (e.g. asked for offline payment without receipt, misleading images, unexpected charges)..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'File Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
