import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SENSITIVITY = 0.8;
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';

const MainframeHeroLanding = ({ onEnterPlatform }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Video scrubbing state
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef(null);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mouse-scrub video logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      if (!video.duration || isNaN(video.duration)) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const newTarget = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
      targetTimeRef.current = newTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.05) {
      video.currentTime = targetTimeRef.current;
    } else {
      isSeekingRef.current = false;
    }
  };

  const scrollToThaparShowcase = () => {
    const el = document.getElementById('thapar-showcase-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative text-white min-h-screen bg-black overflow-x-hidden selection:bg-white selection:text-black font-['var(--font-body)']">
      {/* 1. Full-screen mouse-scrub controlled background video */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        className="fixed inset-0 z-0 w-full h-full object-cover pointer-events-none"
        style={{ objectPosition: '70% center' }}
      />

      {/* Subtle overlay vignette for readability */}
      <div className="fixed inset-0 z-0 bg-black/45 pointer-events-none" />

      {/* 2. Fixed Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span
            className="text-[20px] sm:text-[24px] tracking-tight text-white font-extrabold select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Thapar PG Finder
          </span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        {/* Center Desktop Links */}
        <nav className="hidden md:flex items-center text-[16px] sm:text-[18px] text-white/90 gap-6">
          <Link to="/properties" className="hover:text-white transition-colors">
            Explore PGs
          </Link>
          <a
            href="#thapar-showcase-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToThaparShowcase();
            }}
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>
          <Link to="/compare" className="hover:text-white transition-colors">
            Compare
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About TIET Stay
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={onEnterPlatform || scrollToThaparShowcase}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-semibold shadow-lg shadow-red-600/30 transition-all duration-200 cursor-pointer"
          >
            Enter PG Portal &rarr;
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label="Toggle navigation menu"
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] z-20 cursor-pointer"
        >
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 transform ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 transform ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[9] bg-black/95 backdrop-blur-md md:hidden flex flex-col justify-center px-8 gap-6 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link
          to="/properties"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[28px] font-bold text-white hover:text-red-400"
        >
          Explore PGs
        </Link>
        <a
          href="#thapar-showcase-section"
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToThaparShowcase();
          }}
          className="text-[28px] font-bold text-white hover:text-red-400"
        >
          How It Works
        </a>
        <Link
          to="/compare"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[28px] font-bold text-white hover:text-red-400"
        >
          Compare PGs
        </Link>
        <Link
          to="/about"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[28px] font-bold text-white hover:text-red-400"
        >
          About
        </Link>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            if (onEnterPlatform) onEnterPlatform();
            else scrollToThaparShowcase();
          }}
          className="w-full text-center py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-base mt-4 shadow-lg shadow-red-600/30"
        >
          Enter Thapar PG Portal &rarr;
        </button>
      </div>

      {/* 3. Minimal Clean Hero Section (z-index: 1) */}
      <main className="relative z-1 min-h-screen h-screen flex flex-col justify-end pb-16 md:justify-center md:pb-0 px-6 sm:px-12 md:px-16 overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          {/* Main Title: Thapar PG Finder */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Thapar PG Finder
          </h1>

          {/* One Small Tagline */}
          <p className="text-base sm:text-xl md:text-2xl text-slate-200/90 font-normal leading-relaxed max-w-lg drop-shadow">
            Verified student accommodations, PGs & hostels near TIET Patiala.
          </p>

          {/* Clean Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onEnterPlatform || scrollToThaparShowcase}
              className="px-7 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-sm sm:text-base shadow-xl shadow-red-600/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>Explore PGs Near Campus</span>
              <span>&rarr;</span>
            </button>

            <button
              type="button"
              onClick={scrollToThaparShowcase}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium rounded-full text-sm sm:text-base border border-white/20 transition-all duration-200 cursor-pointer"
            >
              How It Works
            </button>
          </div>
        </div>

        {/* Bottom scrubbing guide indicator */}
        <div className="absolute bottom-5 right-6 sm:right-10 text-[11px] text-white/50 hidden sm:flex items-center gap-2">
          <span>&larr; Drag mouse horizontally to interact with 3D scene &rarr;</span>
        </div>
      </main>

      {/* 4. Interactive 3D Showcase & "How It Works" Section for Thapar PG Finder */}
      <section id="thapar-showcase-section" className="relative z-10 bg-slate-950 text-slate-100 py-20 px-5 sm:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
              Campus Life & Technology
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              How Thapar PG Finder Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Designed specifically for engineering, computing, and research scholars at Thapar Institute of Engineering & Technology (TIET), Patiala.
            </p>
          </div>

          {/* 3D Interactive Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Distance to TIET Gates</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse by exact walking distance (0.2 km - 2.5 km) from Gate 1, Gate 2, Gate 3, and Nava Nalanda Central Library.
                </p>
              </div>
              <span className="text-red-400 text-xs font-semibold mt-4 block">Bhadson Rd & Prem Nagar &rarr;</span>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="font-bold text-lg text-white mb-2">In-Person Tour Booking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Schedule physical walkthroughs with verified landlords at preferred morning, afternoon, or evening slots.
                </p>
              </div>
              <span className="text-blue-400 text-xs font-semibold mt-4 block">No Middlemen &rarr;</span>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Digital Punjab Agreement</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Execute electronic tenancy agreements with HTML5 digital signature capture and instant downloadable PDF legal records.
                </p>
              </div>
              <span className="text-emerald-400 text-xs font-semibold mt-4 block">Legal Certainty &rarr;</span>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                  04
                </div>
                <h3 className="font-bold text-lg text-white mb-2">Rent & Move-In Calculator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compute your exact semester expenditure including mess fees, room deposit, electricity submeters, and room essentials.
                </p>
              </div>
              <span className="text-amber-400 text-xs font-semibold mt-4 block">Budget Accurately &rarr;</span>
            </div>
          </div>

          {/* Embedded Thapar University Video & Campus Tour Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                Patiala Campus Immersion
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Live Within Walking Distance of Thapar Gates
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Over 11 verified properties situated on Bhadson Road, Prem Nagar, SST Nagar, and Model Town. From high-security girls residencies with lady wardens to private scholar studio suites.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onEnterPlatform || (() => navigate('/properties'))}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Explore PGs Near TIET &darr;
                </button>
                <Link
                  to="/properties"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-xs sm:text-sm border border-white/20 transition"
                >
                  All 11 Listings &rarr;
                </Link>
                <Link
                  to="/compare"
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-xs sm:text-sm border border-white/20 transition"
                >
                  Side-by-Side Comparison
                </Link>
              </div>
            </div>

            {/* Video preview thumbnail */}
            <div className="w-full lg:w-96 rounded-2xl overflow-hidden shadow-2xl border border-white/20 relative group">
              <img
                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"
                alt="Thapar University Student Accommodation"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">
                  TIET Patiala Campus
                </span>
                <span className="text-xs font-extrabold text-white">
                  Bhadson Road Student Belt
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainframeHeroLanding;
