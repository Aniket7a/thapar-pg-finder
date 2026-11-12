import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

const StudentFavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.properties || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId, isNowFav) => {
    if (!isNowFav) {
      setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Saved Accommodations Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Shortlist and track stays you are considering for the upcoming semester
          </p>
        </div>
        <Link
          to="/properties"
          className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
        >
          <span>Explore more PGs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading saved properties from MongoDB...
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Heart className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any accommodation card to save it for easy access later.
          </p>
          <Link
            to="/properties"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
          >
            Browse Listings Near Thapar
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <PropertyCard
              key={prop._id}
              property={prop}
              initialFavorited={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentFavoritesPage;
