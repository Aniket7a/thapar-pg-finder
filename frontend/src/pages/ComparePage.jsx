import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Trash2,
  Check,
  X,
  Star,
  MapPin,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';

const amenitiesList = [
  { key: 'wifi', label: 'Wi-Fi 300 Mbps' },
  { key: 'ac', label: 'Air Conditioner (AC)' },
  { key: 'food', label: 'Meals Included' },
  { key: 'powerBackup', label: 'Power Backup' },
  { key: 'attachedBathroom', label: 'Attached Bathroom' },
  { key: 'laundry', label: 'Laundry Service' },
  { key: 'cctv', label: 'CCTV Security' },
  { key: 'parking', label: 'Vehicle Parking' },
  { key: 'studyTable', label: 'Study Table & Desk' },
  { key: 'geyser', label: 'Hot Water Geyser' },
];

const ComparePage = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          No properties selected for comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          While exploring PGs and hostels near Thapar University, click the{' '}
          <strong className="text-slate-700">Compare icon</strong> on up to 4 listings to evaluate rent, distance to campus, amenities, and ratings side by side.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
        >
          <span>Explore Accommodations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Compare Thapar Accommodations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluating <strong className="text-slate-800">{compareItems.length}</strong> stays side-by-side
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          {/* Header Row: Property Cards Preview */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-48 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Property Details
              </th>
              {compareItems.map((prop) => (
                <th key={prop._id} className="p-4 w-64 align-top">
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFromCompare(prop._id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link
                      to={`/properties/${prop._id}`}
                      className="font-bold text-slate-900 hover:text-red-600 text-xs line-clamp-1 block"
                    >
                      {prop.title}
                    </Link>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-red-600 text-sm">
                        ₹{prop.pricing?.monthlyRent?.toLocaleString('en-IN')}/mo
                      </span>
                      <Link
                        to={`/properties/${prop._id}`}
                        className="px-2 py-1 bg-red-600 text-white rounded font-semibold text-[10px]"
                      >
                        View Stay
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* Category / Gender */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Accommodation Type</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5">
                  <span className="font-bold">{p.propertyType}</span> ({p.genderPreference})
                </td>
              ))}
            </tr>

            {/* Locality & Distance */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Distance to TIET</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5">
                  <div className="font-bold text-slate-900">{p.distanceFromThapar} km</div>
                  <div className="text-[11px] text-slate-400">{p.address.locality}</div>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Overall Rating</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5 font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{p.averageRating > 0 ? p.averageRating.toFixed(1) : 'New'}</span>
                  <span className="text-slate-400 font-normal">({p.totalReviews} reviews)</span>
                </td>
              ))}
            </tr>

            {/* Security Deposit */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Security Deposit</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5">
                  ₹{p.pricing?.securityDeposit?.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>

            {/* Sharing Options */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Occupancy Types</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5">
                  {p.occupancyTypes?.join(', ')}
                </td>
              ))}
            </tr>

            {/* Available Vacancies */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">Available Vacancies</td>
              {compareItems.map((p) => (
                <td key={p._id} className="p-3.5 font-bold text-emerald-600">
                  {p.availableBeds} Beds Left
                </td>
              ))}
            </tr>

            {/* Amenities Section */}
            <tr className="bg-slate-100/70 font-bold text-slate-800">
              <td colSpan={compareItems.length + 1} className="p-2.5 px-4 text-[11px] uppercase tracking-wider">
                Amenities & Facilities Comparison
              </td>
            </tr>

            {amenitiesList.map((amenity) => (
              <tr key={amenity.key}>
                <td className="p-3.5 font-semibold text-slate-900 bg-slate-50/50">{amenity.label}</td>
                {compareItems.map((p) => {
                  const hasAmenity = p.amenities?.[amenity.key];
                  return (
                    <td key={p._id} className="p-3.5">
                      {hasAmenity ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <Check className="w-4 h-4" />
                          <span>Included</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-300">
                          <X className="w-4 h-4" />
                          <span>No</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
