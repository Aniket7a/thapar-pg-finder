import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  CheckSquare,
  DollarSign,
  PlusCircle,
  Eye,
  Star,
  Clock,
  Check,
  X,
  FileText,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [propRes, bookRes, visitRes] = await Promise.all([
        api.get('/properties/owner/my-listings'),
        api.get('/bookings/owner-bookings'),
        api.get('/visits/owner-visits'),
      ]);

      if (propRes.data.success) setProperties(propRes.data.properties || []);
      if (bookRes.data.success) setBookings(bookRes.data.bookings || []);
      if (visitRes.data.success) setVisits(visitRes.data.visits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  // Compute metrics
  const totalListings = properties.length;
  const totalBeds = properties.reduce((acc, p) => acc + (p.totalBeds || 0), 0);
  const availableBeds = properties.reduce((acc, p) => acc + (p.availableBeds || 0), 0);
  const occupiedBeds = totalBeds - availableBeds;
  const pendingRequests = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const monthlyRevenue = confirmedBookings.reduce((acc, b) => acc + (b.monthlyRent || 0), 0);

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        // If accepted, auto-generate agreement
        if (newStatus === 'Accepted') {
          await api.post('/agreements/generate', { bookingId });
        }
        fetchOwnerData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/30 text-[11px] font-semibold text-red-300">
            <span>Verified Property Host Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.name}’s Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {user?.ownerDetails?.businessName || 'Accommodations Provider'} • Patiala, Punjab
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/owner/add-property"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Listing</span>
          </Link>
          <Link
            to="/owner/properties"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Manage Listings
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Total Properties</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalListings}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active on TIET portal</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Occupied Beds</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {occupiedBeds}{' '}
            <span className="text-xs font-normal text-slate-400">/ {totalBeds || 1}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {availableBeds} beds currently vacant
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Pending Applications</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{pendingRequests}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Needs review</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block">Recorded Monthly Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">
            ₹{monthlyRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            From {confirmedBookings.length} confirmed stays
          </span>
        </div>
      </div>

      {/* Pending Student Bookings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Pending Student Applications</h2>
          <Link to="/owner/bookings" className="text-xs text-red-600 font-semibold hover:underline">
            View all applications ({bookings.length})
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No booking requests received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b._id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{b.student?.name}</strong>
                    <span className="text-slate-400">({b.student?.studentDetails?.course || 'TIET Student'})</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Applied for <strong>{b.property?.title}</strong> ({b.roomType})
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Phone: {b.student?.phone} • Email: {b.student?.email} • Move-in:{' '}
                    {new Date(b.moveInDate).toLocaleDateString()}
                  </p>
                  {b.personalMessage && (
                    <p className="text-slate-500 italic mt-1">"{b.personalMessage}"</p>
                  )}
                </div>

                {b.status === 'Pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleBookingAction(b._id, 'Accepted')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Draft Agreement</span>
                    </button>
                    <button
                      onClick={() => handleBookingAction(b._id, 'Rejected')}
                      className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
