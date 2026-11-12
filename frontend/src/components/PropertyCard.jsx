import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Scale,
  Wifi,
  Wind,
  Utensils,
  Zap,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';

const PropertyCard = ({ property, initialFavorited = false, onFavoriteToggle }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [favorited, setFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please log in as a student to save properties to your wishlist.');
      return;
    }

    setFavLoading(true);
    try {
      const res = await api.post(`/favorites/${property._id}`);
      if (res.data.success) {
        setFavorited(res.data.favorited);
        if (onFavoriteToggle) onFavoriteToggle(property._id, res.data.favorited);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompare(property._id)) {
      removeFromCompare(property._id);
    } else {
      const res = addToCompare(property);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  const primaryImage =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';

  // Gender badge color
  const getGenderBadge = (gender) => {
    switch (gender) {
      case 'Boys':
        return 'bg-blue-600 text-white';
      case 'Girls':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-purple-600 text-white';
    }
  };

  const inCompareList = isInCompare(property._id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gender Badge */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${getGenderBadge(
            property.genderPreference
          )}`}
        >
          {property.genderPreference}
        </span>

        {/* Verified Badge */}
        {property.isVerified && (
          <span className="absolute top-3 left-20 bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        )}

        {/* Action icons right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            disabled={favLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
              favorited
                ? 'bg-rose-600 text-white'
                : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>

          {/* Compare button */}
          <button
            onClick={handleCompareClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-md ${
              inCompareList
                ? 'bg-red-600 text-white'
                : 'bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white'
            }`}
            title={inCompareList ? 'Remove from compare' : 'Add to compare'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Distance from Thapar pill */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span>{property.distanceFromThapar} km from Thapar</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Top row: Property type & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-red-600 uppercase tracking-wider text-[10px]">
              {property.propertyType} • {property.address.locality}
            </span>

            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 font-normal">({property.totalReviews})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/properties/${property._id}`}
            className="block font-bold text-slate-900 text-base group-hover:text-red-600 transition line-clamp-1"
          >
            {property.title}
          </Link>

          {/* Sharing occupancy types */}
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="line-clamp-1">{property.occupancyTypes?.join(', ')}</span>
          </div>

          {/* Quick amenity icons preview */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            {property.amenities?.wifi && (
              <span className="flex items-center gap-1" title="Wi-Fi">
                <Wifi className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Wi-Fi</span>
              </span>
            )}
            {property.amenities?.ac && (
              <span className="flex items-center gap-1" title="Air Conditioned">
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">AC</span>
              </span>
            )}
            {property.amenities?.food && (
              <span className="flex items-center gap-1" title="Food Included">
                <Utensils className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Food</span>
              </span>
            )}
            {property.amenities?.powerBackup && (
              <span className="flex items-center gap-1" title="Power Backup">
                <Zap className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Backup</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & View CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Starts from</div>
            <div className="text-lg font-extrabold text-slate-900">
              ₹{property.pricing?.monthlyRent?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </div>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
          >
            View Stay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
