import React, { useState } from 'react';
import { X, Calendar, CheckSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';

const BookingModal = ({ property, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !property) return null;

  const [roomType, setRoomType] = useState(property.occupancyTypes?.[0] || 'Double Sharing');
  const [moveInDate, setMoveInDate] = useState('');
  const [rentalDurationMonths, setRentalDurationMonths] = useState(11);
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!moveInDate) {
      setError('Please select your preferred move-in date.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        propertyId: property._id,
        roomType,
        moveInDate,
        rentalDurationMonths,
        personalMessage,
      });

      if (res.data.success) {
        if (onSuccess) onSuccess(res.data.booking);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Book Accommodation Application</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{property.title}</p>
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

          {/* Pricing snapshot */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-500 block">Monthly Rent</span>
              <strong className="text-sm font-bold text-slate-900">
                ₹{property.pricing?.monthlyRent?.toLocaleString('en-IN')}/mo
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Security Deposit</span>
              <strong className="text-sm font-bold text-slate-900">
                ₹{property.pricing?.securityDeposit?.toLocaleString('en-IN')}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Available Beds</span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                {property.availableBeds} Left
              </span>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Sharing / Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              {property.occupancyTypes?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anticipated Move-In Date
            </label>
            <input
              type="date"
              value={moveInDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Planned Stay Duration
            </label>
            <select
              value={rentalDurationMonths}
              onChange={(e) => setRentalDurationMonths(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value={6}>6 Months (1 Academic Semester)</option>
              <option value={11}>11 Months (Full Academic Year)</option>
              <option value={12}>12 Months</option>
            </select>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Message to Property Owner (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hi, I am a 2nd year B.Tech student at Thapar looking for a calm study room..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            Upon submitting, the owner will review your application. Once accepted, an official Thapar Digital Rental Agreement will be drafted for your electronic signature.
          </p>

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
              {loading ? 'Submitting...' : 'Send Booking Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
