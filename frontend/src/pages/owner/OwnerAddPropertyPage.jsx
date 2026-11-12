import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UploadCloud, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const localities = [
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

const OwnerAddPropertyPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('PG');
  const [description, setDescription] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('Bhadson Road');
  const [distanceFromThapar, setDistanceFromThapar] = useState('0.5');

  // Pricing
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [electricityCharges, setElectricityCharges] = useState('Included in rent');
  const [waterCharges, setWaterCharges] = useState('Included');

  // Specs
  const [genderPreference, setGenderPreference] = useState('Boys');
  const [occupancyTypes, setOccupancyTypes] = useState(['Double Sharing']);
  const [totalRooms, setTotalRooms] = useState('10');
  const [totalBeds, setTotalBeds] = useState('20');
  const [availableBeds, setAvailableBeds] = useState('5');

  // Amenities
  const [amenities, setAmenities] = useState({
    wifi: true,
    ac: true,
    food: true,
    foodType: 'Both',
    laundry: true,
    powerBackup: true,
    cctv: true,
    parking: true,
    attachedBathroom: true,
    studyTable: true,
    geyser: true,
    housekeeping: true,
  });

  // Images
  const [imageUrl, setImageUrl] = useState('');
  const [imagesList, setImagesList] = useState([
    { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80', isPrimary: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImagesList((prev) => [...prev, { url: imageUrl.trim(), isPrimary: false }]);
    setImageUrl('');
  };

  const handleRemoveImage = (idx) => {
    setImagesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAmenityToggle = (key) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOccupancyToggle = (type) => {
    setOccupancyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (occupancyTypes.length === 0) {
      setError('Please select at least one occupancy / sharing type.');
      return;
    }

    if (imagesList.length === 0) {
      setError('Please add at least one property photo.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        propertyType,
        description,
        address: {
          street,
          locality,
          city: 'Patiala',
          state: 'Punjab',
          pincode: '147004',
          landmark: `Near Thapar Campus, ${locality}`,
        },
        distanceFromThapar: Number(distanceFromThapar),
        coordinates: { lat: 30.3545, lng: 76.365 },
        pricing: {
          monthlyRent: Number(monthlyRent),
          securityDeposit: Number(securityDeposit),
          electricityCharges,
          waterCharges,
          maintenanceCharges: 0,
        },
        genderPreference,
        occupancyTypes,
        totalRooms: Number(totalRooms),
        totalBeds: Number(totalBeds),
        availableBeds: Number(availableBeds),
        amenities,
        images: imagesList,
        rulesAndRestrictions: [
          'Curfew: 10:00 PM',
          'No smoking or alcohol on premises',
          'Visitors allowed in common lounge until 8:00 PM',
          'Maintain quiet hours after 11:00 PM',
        ],
        minRentalDurationMonths: 6,
        noticePeriodDays: 30,
      };

      const res = await api.post('/properties', payload);
      if (res.data.success) {
        alert('Property listing created successfully and saved in MongoDB!');
        navigate('/owner/properties');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Create New Accommodation Listing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish your PG, hostel, flat, or room to Thapar University students
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-xs">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider text-red-600">
            1. Basic Accommodation Particulars
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Listing Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Crown Luxury Boys PG (Near Thapar Gate 2)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
              >
                <option value="PG">Paying Guest (PG)</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Independent Flat</option>
                <option value="Single Room">Single Room / Studio</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              required
              placeholder="Describe room condition, food menu, study environment, walking time to TIET gates, power backup..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider text-red-600">
            2. Campus Locality & Distance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Campus Locality</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
              >
                {localities.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Distance to Thapar (km)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 0.4"
                value={distanceFromThapar}
                onChange={(e) => setDistanceFromThapar(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="Street / House No., Landmark"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing & Occupancy */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider text-red-600">
            3. Rent, Deposit & Vacancy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Rent (₹/bed)</label>
              <input
                type="number"
                required
                placeholder="e.g. 8500"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 8500"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Beds</label>
              <input
                type="number"
                required
                value={totalBeds}
                onChange={(e) => setTotalBeds(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vacant / Available Beds</label>
              <input
                type="number"
                required
                value={availableBeds}
                onChange={(e) => setAvailableBeds(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {['Boys', 'Girls', 'Co-ed'].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGenderPreference(g)}
                    className={`py-2 rounded-xl border font-semibold text-center transition ${
                      genderPreference === g
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Occupancy Options</label>
              <div className="flex flex-wrap gap-2">
                {['Single', 'Double Sharing', 'Triple Sharing', 'Four Sharing'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleOccupancyToggle(type)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      occupancyTypes.includes(type)
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Amenities Checkbox Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider text-red-600">
            4. Amenities Included
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'wifi', label: 'Wi-Fi 300 Mbps' },
              { key: 'ac', label: 'Air Conditioner (AC)' },
              { key: 'food', label: 'Food / Meals' },
              { key: 'powerBackup', label: '24x7 Power Backup' },
              { key: 'attachedBathroom', label: 'Attached Washroom' },
              { key: 'laundry', label: 'Laundry Service' },
              { key: 'cctv', label: 'CCTV Security' },
              { key: 'parking', label: 'Vehicle Parking' },
              { key: 'studyTable', label: 'Study Table & Desk' },
              { key: 'geyser', label: 'Hot Water Geyser' },
              { key: 'housekeeping', label: 'Daily Cleaning' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition"
              >
                <input
                  type="checkbox"
                  checked={amenities[item.key]}
                  onChange={() => handleAmenityToggle(item.key)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="text-slate-800 font-medium">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Property Images */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider text-red-600">
            5. Property Photographs
          </h3>

          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL (Unsplash, Cloudinary, or web link)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl outline-none"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition"
            >
              Add Photo
            </button>
          </div>

          {/* Photo Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {imagesList.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {img.isPrimary && (
                  <span className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Publishing to MongoDB...' : 'Publish Accommodation Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerAddPropertyPage;
