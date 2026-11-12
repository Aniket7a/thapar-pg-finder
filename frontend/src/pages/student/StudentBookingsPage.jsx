import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, Building2, MapPin, XCircle, FileText, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StudentBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking application?')) return;
    setCancellingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: 'Cancelled',
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'Accepted':
      case 'Agreement Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Booking Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your rental requests, owner approvals, and agreement states
          </p>
        </div>
        <Link
          to="/properties"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          Explore More PGs
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading bookings from database...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven’t applied for any PGs or student flats yet. Browse listings near TIET to apply.
          </p>
          <Link
            to="/properties"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Find Accommodations
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Applied on {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Link
                  to={`/properties/${booking.property?._id}`}
                  className="text-base font-bold text-slate-900 hover:text-red-600 transition block"
                >
                  {booking.property?.title}
                </Link>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                  <span>Room: <strong>{booking.roomType}</strong></span>
                  <span>•</span>
                  <span>Rent: <strong>₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo</strong></span>
                  <span>•</span>
                  <span>Deposit: <strong>₹{booking.securityDeposit?.toLocaleString('en-IN')}</strong></span>
                  <span>•</span>
                  <span>Move-in: <strong>{new Date(booking.moveInDate).toLocaleDateString()}</strong></span>
                </div>

                {booking.ownerNote && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Owner Note: </span>
                    {booking.ownerNote}
                  </div>
                )}
              </div>

              {/* Actions Right */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2.5 shrink-0">
                {booking.agreement && (
                  <Link
                    to={`/student/agreements`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Rental Agreement</span>
                  </Link>
                )}

                {booking.status === 'Pending' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                    className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                  >
                    {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Application'}
                  </button>
                )}

                <Link
                  to={`/messages?user=${booking.owner?._id}&property=${booking.property?._id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  Message Landlord
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBookingsPage;
