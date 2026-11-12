import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const localities = [
  'All Localities',
  'Bhadson Road',
  'Prem Nagar',
  'SST Nagar',
  'Model Town',
  'Urban Estate Phase 1',
  'Punjabi Bagh',
  'Leela Bhawan',
  'Chhoti Baradari',
  'Thapar Gate 1',
];

const PropertyFilter = ({ filters, setFilters, onReset }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleToggle = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key], page: 1 }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-red-600" />
          <span>Filters & Search</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword search input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Search by Name or Locality
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. Bhadson Road, Royal Palms..."
            value={filters.keyword || ''}
            onChange={(e) => handleChange('keyword', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>
      </div>

      {/* Locality Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Campus Locality
        </label>
        <select
          value={filters.locality || 'all'}
          onChange={(e) => handleChange('locality', e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
        >
          {localities.map((loc) => (
            <option key={loc} value={loc === 'All Localities' ? 'all' : loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Gender Preference
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {['all', 'Boys', 'Girls', 'Co-ed'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleChange('genderPreference', g)}
              className={`py-1.5 rounded-lg border text-center font-medium capitalize transition ${
                (filters.genderPreference || 'all') === g
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Property Type
        </label>
        <select
          value={filters.propertyType || 'all'}
          onChange={(e) => handleChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
        >
          <option value="all">All Accommodation Types</option>
          <option value="PG">Paying Guest (PG)</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Student Flat / Apartment</option>
          <option value="Single Room">Single Room</option>
          <option value="Shared Room">Shared Room</option>
        </select>
      </div>

      {/* Distance from Thapar Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span>Max Distance from TIET</span>
          <span className="text-red-600 font-bold">{filters.maxDistance || 3} km</span>
        </div>
        <input
          type="range"
          min="0.2"
          max="5"
          step="0.2"
          value={filters.maxDistance || 3}
          onChange={(e) => handleChange('maxDistance', Number(e.target.value))}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0.2 km (Walkable)</span>
          <span>5.0 km</span>
        </div>
      </div>

      {/* Budget / Rent Range */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Monthly Rent Budget (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min (₹)"
            value={filters.minRent || ''}
            onChange={(e) => handleChange('minRent', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
          />
          <input
            type="number"
            placeholder="Max (₹)"
            value={filters.maxRent || ''}
            onChange={(e) => handleChange('maxRent', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Must-have Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Must-Have Amenities
        </label>
        <div className="space-y-2 text-xs">
          {[
            { key: 'food', label: 'Food / Meals Provided' },
            { key: 'ac', label: 'Air Conditioner (AC)' },
            { key: 'wifi', label: 'High-Speed Wi-Fi' },
            { key: 'powerBackup', label: '24x7 Power Backup' },
            { key: 'attachedBathroom', label: 'Attached Washroom' },
            { key: 'laundry', label: 'Laundry Service' },
            { key: 'cctv', label: 'CCTV & Security Guard' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900"
            >
              <input
                type="checkbox"
                checked={!!filters[item.key]}
                onChange={() => handleToggle(item.key)}
                className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={!!filters.availableOnly}
            onChange={() => handleToggle('availableOnly')}
            className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
          />
          <span>Show Vacant Beds Only</span>
        </label>
      </div>
    </div>
  );
};

export default PropertyFilter;
