import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LayoutGrid,
  Map as MapIcon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import PropertyMap from '../components/PropertyMap';

const initialFilters = {
  keyword: '',
  locality: 'all',
  propertyType: 'all',
  genderPreference: 'all',
  occupancyType: 'all',
  minRent: '',
  maxRent: '',
  maxDistance: 3,
  wifi: false,
  ac: false,
  food: false,
  laundry: false,
  parking: false,
  attachedBathroom: false,
  powerBackup: false,
  cctv: false,
  availableOnly: false,
  sort: 'ratingDesc',
  page: 1,
  limit: 9,
};

const ExplorePropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    keyword: searchParams.get('keyword') || '',
    locality: searchParams.get('locality') || 'all',
    genderPreference: searchParams.get('genderPreference') || 'all',
    propertyType: searchParams.get('propertyType') || 'all',
    maxDistance: searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : 3,
    food: searchParams.get('food') === 'true',
  });

  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Fetch properties whenever filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach((key) => {
          if (filters[key] !== '' && filters[key] !== null && filters[key] !== false && filters[key] !== 'all') {
            queryParams.append(key, filters[key]);
          }
        });

        const res = await api.get(`/properties?${queryParams.toString()}`);
        if (res.data.success) {
          setProperties(res.data.properties);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Accommodations Near Thapar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{properties.length}</strong> of{' '}
            <strong className="text-slate-800">{total}</strong> verified student accommodations
          </p>
        </div>

        {/* View Mode Toggle & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }))}
            className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-700 outline-none shadow-sm"
          >
            <option value="ratingDesc">Highest Rated</option>
            <option value="rentAsc">Rent: Low to High</option>
            <option value="rentDesc">Rent: High to Low</option>
            <option value="distanceAsc">Nearest to Thapar Campus</option>
            <option value="newest">Recently Added</option>
          </select>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilter && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
            <div className="w-80 bg-white h-full overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-900 text-sm">Refine Listings</span>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="text-xs text-red-600 font-semibold"
                >
                  Close
                </button>
              </div>
              <PropertyFilter
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 text-red-500 animate-spin mx-auto" />
              <p className="text-sm">Fetching genuine MongoDB listings for Thapar University...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching accommodations found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your distance radius, adjusting the rent budget, or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Interactive Map View */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Displaying {properties.length} pins around TIET Patiala Campus. Click any pin to view room preview.</span>
              </div>
              <PropertyMap properties={properties} height="560px" />
            </div>
          ) : (
            /* Standard Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-slate-200 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                      filters.page === pageNumber
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePropertiesPage;
