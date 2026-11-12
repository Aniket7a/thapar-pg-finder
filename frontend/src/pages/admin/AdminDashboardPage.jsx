import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Star,
  Flag,
  AlertCircle,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [reports, setReports] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, properties, reports
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, propsRes, reportsRes, compRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/properties?limit=50'),
        api.get('/reports'),
        api.get('/complaints/my'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (propsRes.data.success) setProperties(propsRes.data.properties || []);
      if (reportsRes.data.success) setReports(reportsRes.data.reports || []);
      if (compRes.data.success) setComplaints(compRes.data.complaints || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyOwner = async (userId, status) => {
    try {
      const res = await api.put(`/admin/users/${userId}/verify-owner`, { status });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification update failed.');
    }
  };

  const handleModerateProperty = async (propertyId, isVerified, isFeatured) => {
    try {
      const res = await api.put(`/admin/properties/${propertyId}/moderate`, {
        isVerified,
        isFeatured,
      });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Moderation failed.');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      const res = await api.put(`/reports/${reportId}/status`, {
        status,
        adminNotes: 'Investigated by TIET Compliance Office.',
      });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/30 text-[11px] font-semibold text-red-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Campus Security & Listing Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            TIET Accommodations Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Verify landlords, moderate PG listings, inspect fraud reports, and oversee student welfare.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {[
          { key: 'overview', label: 'Platform Statistics' },
          { key: 'properties', label: `Properties Moderation (${properties.length})` },
          { key: 'users', label: `Users & Owners (${users.length})` },
          { key: 'reports', label: `Fraud Reports & Complaints (${reports.length + complaints.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === tab.key
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading admin data...</div>
      ) : activeTab === 'overview' ? (
        /* Overview Stats */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Total Users</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalUsers || 0}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stats?.totalStudents || 0} Students • {stats?.totalOwners || 0} Owners
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Total Properties Listed</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalProperties || 0}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {stats?.verifiedProperties || 0} Verified by Admin
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Total Tenancy Bookings</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalBookings || 0}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stats?.confirmedBookings || 0} Confirmed Stays
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Rental Agreements Executed</span>
              <div className="text-3xl font-extrabold text-emerald-700 mt-2">{stats?.signedAgreements || 0}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Digitally Signed</span>
            </div>
          </div>
        </div>
      ) : activeTab === 'properties' ? (
        /* Properties Moderation */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
              Manage Accommodation Listings
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {properties.map((prop) => (
                <div key={prop._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm">{prop.title}</strong>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        {prop.propertyType} • {prop.genderPreference}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      {prop.address?.locality} • {prop.distanceFromThapar} km to campus • Rent: ₹{prop.pricing?.monthlyRent}/mo
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Owner: {prop.owner?.name} ({prop.owner?.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleModerateProperty(prop._id, !prop.isVerified, prop.isFeatured)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                        prop.isVerified
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {prop.isVerified ? '✓ Verified' : 'Verify Listing'}
                    </button>

                    <button
                      onClick={() => handleModerateProperty(prop._id, prop.isVerified, !prop.isFeatured)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                        prop.isFeatured
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {prop.isFeatured ? '★ Featured' : 'Feature'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* Users Management */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-500">
            Registered Users ({users.length})
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {users.map((u) => (
              <div key={u._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{u.name}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                      {u.role}
                    </span>
                    {u.isVerified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Email: {u.email} • Phone: {u.phone}
                  </p>
                  {u.studentDetails?.course && (
                    <p className="text-slate-400 text-[11px]">
                      {u.studentDetails.course} ({u.studentDetails.yearOfStudy}) • Roll No: {u.studentDetails.thaparRollNo || 'N/A'}
                    </p>
                  )}
                  {u.ownerDetails?.businessName && (
                    <p className="text-slate-400 text-[11px]">
                      Business: {u.ownerDetails.businessName}
                    </p>
                  )}
                </div>

                {u.role === 'owner' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerifyOwner(u._id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition"
                    >
                      Approve Owner
                    </button>
                    <button
                      onClick={() => handleVerifyOwner(u._id, 'rejected')}
                      className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fraud Reports & Student Complaints */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-red-600">
              Suspicious Activity & Fraud Reports ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active fraud reports pending investigation.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-red-700 text-sm">
                        Reason: {rep.reason}
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 font-bold text-[10px]">
                        Status: {rep.status}
                      </span>
                    </div>

                    <p className="text-slate-700"><strong>Details:</strong> {rep.details}</p>
                    <p className="text-slate-500 text-[11px]">
                      Reported by: {rep.reportedBy?.name} ({rep.reportedBy?.email})
                    </p>

                    {rep.status === 'Pending' && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleResolveReport(rep._id, 'Resolved')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-semibold text-[11px]"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep._id, 'Dismissed')}
                          className="px-3 py-1 border border-slate-300 text-slate-600 rounded font-medium text-[11px]"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
