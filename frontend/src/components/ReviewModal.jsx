import React, { useState } from 'react';
import { X, Star, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const criteriaList = [
  { key: 'cleanliness', label: 'Cleanliness & Hygiene' },
  { key: 'location', label: 'Proximity to Thapar University' },
  { key: 'food', label: 'Food Quality & Taste' },
  { key: 'safety', label: 'Safety & Security' },
  { key: 'ownerBehaviour', label: 'Owner & Staff Behavior' },
  { key: 'valueForMoney', label: 'Value for Money' },
];

const ReviewModal = ({ property, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !property) return null;

  const [overall, setOverall] = useState(5);
  const [ratings, setRatings] = useState({
    cleanliness: 5,
    location: 5,
    food: 4,
    safety: 5,
    ownerBehaviour: 5,
    valueForMoney: 5,
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingChange = (key, val) => {
    setRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please provide a written review sharing your experience.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        propertyId: property._id,
        ratings: {
          overall,
          ...ratings,
        },
        comment,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.review);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Write Verified Student Review</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Overall Rating Star Selector */}
          <div className="text-center p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Overall Experience Rating</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOverall(star)}
                  className="p-1 hover:scale-110 transition text-amber-400"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= overall ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 mt-1 block">
              {overall} / 5 Stars
            </span>
          </div>

          {/* Individual Category Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-800 block">Rating Breakdown</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criteriaList.map((crit) => (
                <div key={crit.key} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1">
                    <span>{crit.label}</span>
                    <span className="font-bold text-amber-600">{ratings[crit.key]}★</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => handleRatingChange(crit.key, st)}
                        className="text-amber-400 p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            st <= ratings[crit.key]
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Written Experience
            </label>
            <textarea
              rows={4}
              placeholder="Share honest feedback about room condition, food taste, warden response, Wi-Fi reliability, and quiet hours for studies..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your review will appear with a Verified Student badge.</span>
          </div>

          {/* Buttons */}
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
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
