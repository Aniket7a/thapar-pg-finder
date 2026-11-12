import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Scale,
  Calculator,
  CheckSquare,
  Bell,
  MessageSquare,
  User,
  LogOut,
  PlusCircle,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Building2,
  Heart,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';

const Navbar = ({ onOpenCalculator, onOpenChecklist }) => {
  const { user, isAuthenticated, isStudent, isOwner, isAdmin, logout, unreadNotifications, fetchNotifications } = useAuth();
  const { compareCount } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications list when opening dropdown
  const handleToggleNotifications = async () => {
    if (!notificationsOpen && isAuthenticated) {
      setLoadingNotifications(true);
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotificationsList(res.data.notifications || []);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoadingNotifications(false);
      }
    }
    setNotificationsOpen(!notificationsOpen);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Thapar<span className="text-red-600">PG</span>Finder
                </span>
                <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  TIET
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Patiala Campus Accommodation Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              to="/properties"
              className={`px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition ${
                location.pathname === '/properties' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              Explore PGs
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition flex items-center gap-1.5 ${
                location.pathname === '/compare' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="px-1.5 py-0.2 text-xs bg-red-600 text-white rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </Link>

            <button
              onClick={onOpenCalculator}
              type="button"
              className="px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              <span>Rent Calculator</span>
            </button>

            <button
              onClick={onOpenChecklist}
              type="button"
              className="px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4 text-slate-500" />
              <span>Move-In Checklist</span>
            </button>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition ${
                location.pathname === '/about' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg hover:text-red-600 hover:bg-red-50/60 transition ${
                location.pathname === '/contact' ? 'text-red-600 bg-red-50 font-semibold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons & Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                {/* Messages button */}
                <Link
                  to="/messages"
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition relative"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleToggleNotifications}
                    type="button"
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                        {notificationsList.length > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-red-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {loadingNotifications ? (
                          <div className="p-4 text-center text-xs text-slate-400">Loading notifications...</div>
                        ) : notificationsList.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notificationsList.map((n) => (
                            <Link
                              key={n._id}
                              to={n.link || '#'}
                              onClick={() => setNotificationsOpen(false)}
                              className={`block p-3.5 hover:bg-slate-50 transition text-left ${
                                !n.read ? 'bg-red-50/40' : ''
                              }`}
                            >
                              <div className="text-xs font-semibold text-slate-900">{n.title}</div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()} at{' '}
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add Property Button (Owner shortcut) */}
                {isOwner && (
                  <Link
                    to="/owner/add-property"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>List PG</span>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    type="button"
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="hidden md:block text-left">
                      <div className="text-xs font-semibold text-slate-800 leading-tight">
                        {user?.name?.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {user?.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-slate-900 truncate">{user?.name}</div>
                        <div className="text-slate-500 truncate">{user?.email}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {user?.role}
                        </span>
                      </div>

                      {/* Student Links */}
                      {isStudent && (
                        <div className="py-1 border-b border-slate-100">
                          <Link
                            to="/student/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <Home className="w-4 h-4 text-slate-400" />
                            <span>Student Dashboard</span>
                          </Link>
                          <Link
                            to="/student/bookings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <CheckSquare className="w-4 h-4 text-slate-400" />
                            <span>My Bookings</span>
                          </Link>
                          <Link
                            to="/student/favorites"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                            <span>Saved PGs</span>
                          </Link>
                          <Link
                            to="/student/agreements"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span>Rental Agreements</span>
                          </Link>
                        </div>
                      )}

                      {/* Owner Links */}
                      {isOwner && (
                        <div className="py-1 border-b border-slate-100">
                          <Link
                            to="/owner/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <Home className="w-4 h-4 text-slate-400" />
                            <span>Owner Dashboard</span>
                          </Link>
                          <Link
                            to="/owner/properties"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span>Manage Listings</span>
                          </Link>
                          <Link
                            to="/owner/bookings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <CheckSquare className="w-4 h-4 text-slate-400" />
                            <span>Student Requests</span>
                          </Link>
                        </div>
                      )}

                      {/* Admin Links */}
                      {isAdmin && (
                        <div className="py-1 border-b border-slate-100">
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 transition"
                          >
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                            <span className="font-semibold text-red-700">Admin Console</span>
                          </Link>
                        </div>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-red-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-500/20 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 text-slate-600 hover:text-red-600 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Explore PGs
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            <span>Compare Properties</span>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
                {compareCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculator();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Rent Affordability Calculator
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenChecklist();
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Move-In Checklist
          </button>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            About TIET Accommodation Portal
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
          >
            Contact & Support
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
