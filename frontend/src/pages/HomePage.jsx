import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Compass,
  FileCheck,
  ChevronRight,
  Building,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';

const popularLocalities = [
  { name: 'Bhadson Road', distance: '0.3 - 0.7 km', desc: 'Directly outside Gate 2 & Gate 3. Most popular for engineers.', count: 4 },
  { name: 'Prem Nagar', distance: '0.5 - 0.8 km', desc: 'Peaceful residential colony right opposite Thapar Gate 1.', count: 3 },
  { name: 'SST Nagar', distance: '0.8 - 1.2 km', desc: 'Wide avenues, parks, and top-rated Punjabi food messes.', count: 2 },
  { name: 'Model Town', distance: '1.2 - 1.8 km', desc: 'Upscale city center with cafes, gyms, and student flats.', count: 2 },
  { name: 'Urban Estate Phase 1', distance: '1.5 - 2.2 km', desc: 'Calm academic atmosphere, hospitals, and grocery markets.', count: 1 },
  { name: 'Punjabi Bagh', distance: '1.4 - 2.0 km', desc: 'Close to Rose Garden, wide sports areas, and budget hostels.', count: 1 },
];

const studentTestimonials = [
  {
    name: 'Aarav Sharma',
    course: 'B.Tech COE, 3rd Year',
    text: 'Finding a good PG on Bhadson Road used to mean wandering in the scorching Patiala sun. Through this portal, I verified room photos, read real senior reviews, and signed my rental agreement digitally before reaching campus!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Riya Verma',
    course: 'B.Tech ENC, 2nd Year',
    text: 'Security was my parents’ primary concern. Royal Palms Girls Residency on Prem Nagar has 24x7 biometric access and lady warden. The platform allowed us to schedule a physical visit beforehand. Zero brokerage!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Kabir Dhillon',
    course: 'M.Tech AI & Data Science',
    text: 'The Scholar’s Den private suite near Gate 3 was exactly what I needed for focused research work. High speed fiber internet and no disturbances. The rent affordability calculator helped me budget my semester.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick search state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          api.get('/properties?limit=6&sort=ratingDesc'),
          api.get('/properties?limit=4&sort=newest'),
        ]);

        if (featuredRes.data.success) {
          setFeaturedProperties(featuredRes.data.properties);
        }
        if (recentRes.data.success) {
          setRecentProperties(recentRes.data.properties);
        }
      } catch (err) {
        console.error('Error fetching home properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.append('keyword', searchKeyword);
    if (selectedLocality !== 'all') params.append('locality', selectedLocality);
    if (selectedGender !== 'all') params.append('genderPreference', selectedGender);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/60 via-white to-slate-50 pt-10 sm:pt-16 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider animate-in fade-in duration-300">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>Official Student Accommodation Portal for TIET Patiala</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Your Perfect Stay Near{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-800">
                Thapar University
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore verified PGs, hostels, private rooms, and flats within walking distance of Thapar gates. Zero brokerage, genuine senior student reviews, and digital rental agreements.
            </p>
          </div>

          {/* Quick Search Floating Card */}
          <div className="mt-8 sm:mt-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 sm:p-4">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Keyword / Locality search */}
              <div className="sm:col-span-2 relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search PG name, Bhadson Rd, Gate 1..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {/* Locality Dropdown */}
              <div>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white text-slate-700"
                >
                  <option value="all">All Localities</option>
                  <option value="Bhadson Road">Bhadson Road (Gates 2/3)</option>
                  <option value="Prem Nagar">Prem Nagar (Gate 1)</option>
                  <option value="SST Nagar">SST Nagar</option>
                  <option value="Model Town">Model Town</option>
                  <option value="Urban Estate Phase 1">Urban Estate</option>
                </select>
              </div>

              {/* Search CTA */}
              <div>
                <button
                  type="submit"
                  className="w-full h-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-500/20 transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Discover PGs</span>
                </button>
              </div>
            </form>

            {/* Popular quick links */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Quick Filters:</span>
              <Link
                to="/properties?genderPreference=Boys"
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 transition"
              >
                Boys PGs
              </Link>
              <Link
                to="/properties?genderPreference=Girls"
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 transition"
              >
                Girls Hostels
              </Link>
              <Link
                to="/properties?maxDistance=0.5"
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 transition"
              >
                &lt; 500m from Campus
              </Link>
              <Link
                to="/properties?food=true"
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-600 transition"
              >
                Food Included
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CAMPUS LOCALITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Prime Patiala Student Belts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Localities Around Thapar
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your preferred neighborhood based on distance to your lecture halls and workshops.
            </p>
          </div>
          <Link
            to="/properties"
            className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View all areas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularLocalities.map((loc) => (
            <Link
              key={loc.name}
              to={`/properties?locality=${encodeURIComponent(loc.name)}`}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-red-600 transition">
                    {loc.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                    {loc.distance}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{loc.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>{loc.count}+ verified listings</span>
                <span className="font-semibold text-red-600 group-hover:underline">
                  Browse &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (LIVE FROM MONGODB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Top Rated Stays
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured PGs & Accommodations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inspected accommodations with high ratings, verified owners, and complete student amenities.
            </p>
          </div>
          <Link
            to="/properties"
            className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>Explore all PGs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Fetching properties from MongoDB database...
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No properties found. Run the seed script to populate sample listings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE OUR PLATFORM */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Tailored For Thapar Institute
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-1">
              Why Students Trust Thapar PG Finder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Unlike generic property websites, every listing here is curated specifically for TIET campus life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Verified Property Owners</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Govt ID and ownership proof inspected to eliminate ghost listings and rental fraud.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Distance to TIET Gates</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Accurate walking distances from Gate 1, Gate 2, Gate 3, and Nava Nalanda Library.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Digital Rental Agreements</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Generate transparent rental contracts with electronic signatures and downloadable PDF records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Zero Brokerage Fees</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Direct in-app messaging and visit booking between students and landlords with no middlemen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Real Student Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            What Thapar Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studentTestimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Are You a PG or Property Owner in Patiala?
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              List your accommodation directly to over 10,000+ Thapar University students. Receive verified visit requests, manage room occupancy, and execute formal agreements seamlessly.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 bg-white text-red-600 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-slate-50 transition"
              >
                Register as Property Owner
              </Link>
              <Link
                to="/about"
                className="px-5 py-2.5 bg-red-700/60 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition border border-red-400/40"
              >
                Owner Verification Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
