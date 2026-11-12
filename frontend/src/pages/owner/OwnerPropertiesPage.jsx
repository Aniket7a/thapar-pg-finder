import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Trash2, Edit3, Eye, ShieldCheck, MapPin } from 'lucide-react';
import api from '../../services/api';

const OwnerPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties/owner/my-listings');
      if (res.data.success) {
        setProperties(res.data.properties || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently from MongoDB?')) return;
    try {
      const res = await api.delete(`/properties/${propertyId}`);
      if (res.data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Manage My Property Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total listings in MongoDB: <strong className="text-slate-800">{properties.length}</strong>
          </p>
        </div>
        <Link
          to="/owner/add-property"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Fetching listings from MongoDB...
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No properties listed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first PG or hostel listing to start receiving student inquiries.
          </p>
          <Link
            to="/owner/add-property"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop._id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80'}
                  alt={prop.title}
                  className="w-24 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{prop.title}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      {prop.propertyType} • {prop.genderPreference}
                    </span>
                    {prop.isVerified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{prop.address?.locality}, Patiala ({prop.distanceFromThapar} km to campus)</span>
                  </p>

                  <div className="text-xs text-slate-700 font-medium pt-1">
                    Rent: <strong className="text-red-600">₹{prop.pricing?.monthlyRent?.toLocaleString('en-IN')}/mo</strong> •{' '}
                    Vacancies: <strong className="text-emerald-700">{prop.availableBeds} beds vacant</strong> of {prop.totalBeds}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/properties/${prop._id}`}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition flex items-center gap-1 border border-slate-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Public Page</span>
                </Link>

                <button
                  onClick={() => handleDelete(prop._id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition flex items-center gap-1 border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerPropertiesPage;
