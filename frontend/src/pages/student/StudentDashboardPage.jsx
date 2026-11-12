import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Heart,
  FileText,
  Calendar,
  MessageSquare,
  User,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const [bookRes, visitRes, favRes, agreeRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/visits/my-visits'),
          api.get('/favorites'),
          api.get('/agreements/my/list'),
        ]);

        if (bookRes.data.success) setBookings(bookRes.data.bookings || []);
        if (visitRes.data.success) setVisits(visitRes.data.visits || []);
        if (favRes.data.success) setFavorites(favRes.data.properties || []);
        if (agreeRes.data.success) setAgreements(agreeRes.data.agreements || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-900 via-slate-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/30 text-[11px] font-semibold text-red-300">
            <span>TIET Enrolled Student Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {user?.studentDetails?.course || 'Thapar Institute of Engg & Tech'} •{' '}
            {user?.studentDetails?.yearOfStudy || 'Enrolled Student'} • Roll No:{' '}
            {user?.studentDetails?.thaparRollNo || '102203045'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Explore PGs
          </Link>
          <Link
            to="/messages"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-red-400" />
            <span>Messages</span>
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/student/bookings"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Booking Applications</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{bookings.length}</div>
          <span className="text-[11px] text-red-600 font-semibold group-hover:underline mt-1 block">
            View applications &rarr;
          </span>
        </Link>

        <Link
          to="/student/agreements"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rental Agreements</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{agreements.length}</div>
          <span className="text-[11px] text-blue-600 font-semibold group-hover:underline mt-1 block">
            Review & sign &rarr;
          </span>
        </Link>

        <Link
          to="/student/favorites"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Stays</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{favorites.length}</div>
          <span className="text-[11px] text-rose-600 font-semibold group-hover:underline mt-1 block">
            Saved wishlist &rarr;
          </span>
        </Link>

        <div className="p-5 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Scheduled Visits</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{visits.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Physical walkthroughs</span>
        </div>
      </div>

      {/* Recent Applications & Agreements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Active Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Recent Booking Applications</h2>
            <Link to="/student/bookings" className="text-xs text-red-600 font-semibold hover:underline">
              View all ({bookings.length})
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No booking applications submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">
                      {b.property?.title}
                    </span>
                    <p className="text-slate-500">
                      Sharing: {b.roomType} • Rent: ₹{b.monthlyRent?.toLocaleString('en-IN')}/mo
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Move-In: {new Date(b.moveInDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                    {b.agreement && (
                      <Link
                        to="/student/agreements"
                        className="text-[11px] text-blue-600 font-bold hover:underline"
                      >
                        Sign Agreement &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Visits */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Scheduled Property Visits</h2>
            <span className="text-xs text-slate-500">{visits.length} scheduled</span>
          </div>

          {visits.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No physical visits requested yet. Visit listings to request an in-person tour.
            </div>
          ) : (
            <div className="space-y-3">
              {visits.slice(0, 3).map((v) => (
                <div
                  key={v._id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-slate-900 block">{v.property?.title}</strong>
                    <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(v.preferredDate).toLocaleDateString()} • {v.preferredTimeSlot}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
