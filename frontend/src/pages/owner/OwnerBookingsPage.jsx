import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Check, X, FileText, Phone, Mail, User, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/owner-bookings');
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

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        // If accepting, also auto-generate agreement draft
        if (status === 'Accepted') {
          await api.post('/agreements/generate', { bookingId });
        }
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Student Booking Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review student credentials, approve tenancy applications, and execute rental agreements
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading student applications from MongoDB...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No applications received yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Student rental requests will appear here once submitted.
          </p>
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
                  <span className="font-bold text-slate-900 text-sm">
                    {booking.student?.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({booking.student?.studentDetails?.course || 'TIET Student'}, {booking.student?.studentDetails?.yearOfStudy})
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                    Status: {booking.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Applied for: <strong>{booking.property?.title}</strong> ({booking.roomType})
                </p>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                  <span>Phone: <strong className="text-slate-800">{booking.student?.phone}</strong></span>
                  <span>•</span>
                  <span>Email: <strong className="text-slate-800">{booking.student?.email}</strong></span>
                  <span>•</span>
                  <span>Desired Move-in: <strong className="text-slate-800">{new Date(booking.moveInDate).toLocaleDateString()}</strong></span>
                </div>

                {booking.personalMessage && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                    "{booking.personalMessage}"
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0">
                {booking.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept & Draft Agreement</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                      className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {booking.status === 'Accepted' && (
                  <span className="text-xs font-semibold text-blue-600">
                    Agreement Drafted • Awaiting Signature
                  </span>
                )}

                {booking.status === 'Confirmed' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Tenancy Confirmed</span>
                  </span>
                )}

                <Link
                  to={`/messages?user=${booking.student?._id}&property=${booking.property?._id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  Chat with Student
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookingsPage;
