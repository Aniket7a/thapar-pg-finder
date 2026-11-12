import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Lock,
  Calendar,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Home,
  Check,
  X,
  Share2,
  Flag,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import PropertyMap from '../components/PropertyMap';
import BookingModal from '../components/BookingModal';
import VisitModal from '../components/VisitModal';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Favorites state
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const [propRes, reviewRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/reviews/property/${id}`),
        ]);

        if (propRes.data.success) {
          setProperty(propRes.data.property);
        }
        if (reviewRes.data.success) {
          setReviews(reviewRes.data.reviews || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Property not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in as a student to save properties.');
      return;
    }
    try {
      const res = await api.post(`/favorites/${property._id}`);
      if (res.data.success) {
        setIsFavorited(res.data.favorited);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompareToggle = () => {
    if (isInCompare(property._id)) {
      removeFromCompare(property._id);
    } else {
      const res = addToCompare(property);
      if (!res.success) alert(res.message);
    }
  };

  const handleMessageOwner = () => {
    if (!isAuthenticated) {
      alert('Please log in to chat with property owners.');
      navigate('/login');
      return;
    }
    navigate(`/messages?user=${property.owner?._id}&property=${property._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading property details from database...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Accommodation not found</h2>
        <p className="text-xs text-slate-500">{error || 'This listing may have been unlisted.'}</p>
        <Link
          to="/properties"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [
    { url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80', caption: 'Room Preview' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* 1. Header Information */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
              {property.propertyType}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {property.genderPreference}
            </span>
            {property.isVerified && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Thapar Listing</span>
              </span>
            )}
            {property.isFeatured && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>
                {property.address.street}, {property.address.locality}, Patiala - {property.address.pincode}
              </span>
            </div>
            <span>•</span>
            <span className="font-semibold text-slate-900">
              {property.distanceFromThapar} km from Thapar Campus
            </span>
            <span>•</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 font-normal">({property.totalReviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
              isFavorited
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isFavorited ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleCompareToggle}
            className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
              isInCompare(property._id)
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          <button
            onClick={() => setReportOpen(true)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 transition text-xs"
            title="Report suspicious listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Photo Gallery Carousel */}
      <div className="space-y-3">
        {/* Main Display Image */}
        <div className="relative aspect-[21/9] sm:aspect-[2/1] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src={images[activeImageIndex]?.url}
            alt={images[activeImageIndex]?.caption || property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          {images[activeImageIndex]?.caption && (
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
              {images[activeImageIndex]?.caption}
            </div>
          )}
        </div>

        {/* Thumbnail selector row */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeImageIndex === idx
                    ? 'border-red-600 shadow-md scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Main Grid: Left Details & Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">About this Accommodation</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Room Occupancy & Pricing Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Room Sharing & Charges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Monthly Rent</span>
                <span className="text-lg font-extrabold text-red-600">
                  ₹{property.pricing?.monthlyRent?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500"> /student</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Security Deposit</span>
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{property.pricing?.securityDeposit?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-600 block text-[10px]">Refundable</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Available Beds</span>
                <span className="text-lg font-extrabold text-slate-900">
                  {property.availableBeds}
                </span>
                <span className="text-xs text-slate-400 block text-[10px]">of {property.totalBeds} total</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-2">
              <p>
                <strong>Electricity Charges:</strong> {property.pricing?.electricityCharges}
              </p>
              <p>
                <strong>Water Charges:</strong> {property.pricing?.waterCharges}
              </p>
              <p>
                <strong>Room Sharing Options:</strong> {property.occupancyTypes?.join(', ')}
              </p>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Amenities & Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { label: 'Wi-Fi 300 Mbps', available: property.amenities?.wifi, icon: Wifi },
                { label: 'Air Conditioner', available: property.amenities?.ac, icon: Wind },
                { label: 'Hygienic Food', available: property.amenities?.food, icon: Utensils },
                { label: 'Power Backup 24x7', available: property.amenities?.powerBackup, icon: Zap },
                { label: 'Attached Washroom', available: property.amenities?.attachedBathroom, icon: Home },
                { label: 'Laundry Service', available: property.amenities?.laundry, icon: CheckCircle2 },
                { label: 'CCTV & Guard', available: property.amenities?.cctv, icon: Lock },
                { label: 'Study Table & Chair', available: property.amenities?.studyTable, icon: CheckCircle2 },
                { label: 'RO Water Cooler', available: property.amenities?.waterCoolerRO, icon: CheckCircle2 },
                { label: 'Solar / Geyser', available: property.amenities?.geyser, icon: CheckCircle2 },
                { label: 'Daily Housekeeping', available: property.amenities?.housekeeping, icon: CheckCircle2 },
                { label: 'Vehicle Parking', available: property.amenities?.parking, icon: Car },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl flex items-center gap-2.5 border ${
                      item.available
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-50/40 border-slate-100 text-slate-300'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 ${item.available ? 'text-red-600' : 'text-slate-300'}`}
                    />
                    <span className={item.available ? 'font-medium' : 'line-through text-slate-400'}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Food details */}
            {property.amenities?.food && (
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-900 space-y-1">
                <strong>Mess & Food Details:</strong>
                <p>
                  Type: <strong>{property.amenities.foodType}</strong> • Meals Provided:{' '}
                  {property.amenities.mealsProvided?.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* House Rules & Policies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">House Rules & Terms</h2>
            <ul className="space-y-2 text-xs text-slate-600">
              {(property.rulesAndRestrictions || []).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex flex-wrap gap-4">
              <span>Minimum stay duration: <strong>{property.minRentalDurationMonths} Months</strong></span>
              <span>•</span>
              <span>Notice period: <strong>{property.noticePeriodDays} Days</strong></span>
            </div>
          </div>

          {/* Proximity / Nearby Landmarks */}
          {property.nearbyFacilities?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Nearby Campus Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {property.nearbyFacilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-900 block">{fac.name}</strong>
                      <span className="text-slate-400 text-[11px]">{fac.category}</span>
                    </div>
                    <span className="text-xs font-bold text-red-600">{fac.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Map & Campus Vicinity</h2>
              <span className="text-xs text-slate-500">
                {property.distanceFromThapar} km to TIET Main Gate
              </span>
            </div>
            <PropertyMap
              properties={[property]}
              selectedProperty={property}
              height="350px"
            />
          </div>

          {/* Verified Student Reviews Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Reviews & Ratings</h2>
                <p className="text-xs text-slate-500">
                  {reviews.length} verified stays reviewed by Thapar students
                </p>
              </div>

              {isStudent && (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
                >
                  Write Review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No reviews submitted yet. Be the first verified student resident to leave a review!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.student?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{rev.student?.name}</span>
                            {rev.isVerifiedStay && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                Verified Stay
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {rev.student?.studentDetails?.course || 'TIET Student'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.ratings?.overall || 5}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-11">
                      {rev.comment}
                    </p>

                    {/* Owner Response */}
                    {rev.ownerResponse?.text && (
                      <div className="ml-11 mt-2 p-3 bg-slate-50 border-l-2 border-red-600 rounded-r-lg text-xs text-slate-700 space-y-1">
                        <div className="font-semibold text-slate-900 text-[11px]">
                          Owner Response:
                        </div>
                        <p>{rev.ownerResponse.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Column: Booking & Owner Card */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          {/* Booking Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-5">
            <div>
              <span className="text-xs text-slate-500 block">Monthly Rent</span>
              <div className="text-3xl font-extrabold text-slate-900">
                ₹{property.pricing?.monthlyRent?.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500"> /month</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                Deposit: ₹{property.pricing?.securityDeposit?.toLocaleString('en-IN')} • Zero Brokerage
              </span>
            </div>

            {/* Beds status pill */}
            <div className="p-3 bg-red-50/70 rounded-xl border border-red-100 flex items-center justify-between text-xs">
              <span className="text-red-900 font-medium">Availability</span>
              <span className="font-bold text-red-700">
                {property.availableBeds > 0 ? `${property.availableBeds} Beds Vacant` : 'Fully Occupied'}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => setBookingOpen(true)}
                disabled={property.availableBeds <= 0}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-500/20 transition disabled:opacity-50"
              >
                Apply for Accommodation
              </button>

              <button
                onClick={() => setVisitOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-red-600" />
                <span>Schedule Physical Visit</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              No booking charges. Application is reviewed directly by the property owner.
            </p>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Property Owner & Host
            </span>

            <div className="flex items-center gap-3">
              <img
                src={property.owner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={property.owner?.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{property.owner?.name}</h4>
                <div className="text-xs text-slate-500">
                  {property.owner?.ownerDetails?.businessName || 'Verified Landlord'}
                </div>
                {property.owner?.isVerified && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ID Verified by Admin</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={handleMessageOwner}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-red-400" />
                <span>Chat in Messages</span>
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-1">
                Direct phone available in active chat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingModal
        property={property}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={() => {
          alert('Booking application submitted successfully! Check status in My Bookings.');
          navigate('/student/bookings');
        }}
      />

      <VisitModal
        property={property}
        isOpen={visitOpen}
        onClose={() => setVisitOpen(false)}
        onSuccess={() => {
          alert('Visit scheduled! The owner will confirm timing.');
        }}
      />

      <ReviewModal
        property={property}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSuccess={(newReview) => {
          setReviews((prev) => [newReview, ...prev]);
        }}
      />

      <ReportModal
        property={property}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
};

export default PropertyDetailPage;
