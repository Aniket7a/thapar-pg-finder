import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTypewriter from '../hooks/useTypewriter';

const SENSITIVITY = 0.8;
const VIDEO_SRC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';
const TYPEWRITER_TEXT = 'Glad you stopped in. Good taste tends to find us. Now, what are we building?';

const MainframeHeroLanding = ({ onEnterPlatform }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Video scrubbing state
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const prevXRef = useRef(null);

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT, 38, 600);

  // Show pills 400ms after mount (independent of typewriter)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

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

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('hello@mainframe.co');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />

      {/* 2. Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-white font-medium select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe&reg;
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none -mt-1"
            style={{ letterSpacing: '-0.02em' }}
          >
            &#10035;&#xFE0E;
          </span>
        </div>

        {/* Center Desktop Links (separated by comma) */}
        <nav className="hidden md:flex items-center text-[23px] text-white space-x-1">
          <a
            href="#thapar-showcase-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToThaparShowcase();
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Labs
          </a>
          <span>, </span>
          <a
            href="#thapar-showcase-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToThaparShowcase();
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Studio
          </a>
          <span>, </span>
          <a
            href="#thapar-showcase-section"
            onClick={(e) => {
              e.preventDefault();
              scrollToThaparShowcase();
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Openings
          </a>
          <span>, </span>
          <Link to="/properties" className="hover:opacity-60 transition-opacity">
            Shop
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={scrollToThaparShowcase}
            className="text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </button>
          <button
            type="button"
            onClick={onEnterPlatform || scrollToThaparShowcase}
            className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-neutral-200 transition cursor-pointer"
          >
            Enter Thapar PG Portal &rarr;
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
        className={`fixed inset-0 z-[9] bg-black/90 backdrop-blur-md md:hidden flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a
          href="#thapar-showcase-section"
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToThaparShowcase();
          }}
          className="text-[32px] font-medium text-white hover:opacity-60"
        >
          Labs
        </a>
        <a
          href="#thapar-showcase-section"
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToThaparShowcase();
          }}
          className="text-[32px] font-medium text-white hover:opacity-60"
        >
          Studio
        </a>
        <a
          href="#thapar-showcase-section"
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToThaparShowcase();
          }}
          className="text-[32px] font-medium text-white hover:opacity-60"
        >
          Openings
        </a>
        <Link
          to="/properties"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[32px] font-medium text-white hover:opacity-60"
        >
          Shop
        </Link>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            scrollToThaparShowcase();
          }}
          className="text-[32px] font-medium text-white underline underline-offset-4 text-left"
        >
          Get in touch
        </button>
        <Link
          to="/properties"
          onClick={() => setMobileMenuOpen(false)}
          className="inline-block text-center py-3 bg-white text-black font-bold rounded-full text-base mt-4"
        >
          Explore Thapar PGs &rarr;
        </Link>
      </div>

      {/* 3. Hero Section (z-index: 1) */}
      <main className="relative z-1 min-h-screen h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          {/* Blurred Intro Label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#fff',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter Text */}
          <p
            className="text-white mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
                aria-hidden="true"
              />
            )}
          </p>

          {/* Action Pill Buttons */}
          <div
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
              pillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {/* White Pill 1 */}
            <button
              type="button"
              onClick={scrollToThaparShowcase}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Pitch us an idea
            </button>

            {/* White Pill 2 */}
            <button
              type="button"
              onClick={scrollToThaparShowcase}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Come work here
            </button>

            {/* White Pill 3 */}
            <button
              type="button"
              onClick={scrollToThaparShowcase}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              Send a brief hello
            </button>

            {/* White Pill 4 */}
            <button
              type="button"
              onClick={scrollToThaparShowcase}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              See how we operate
            </button>

            {/* Outline Pill with Email Copy */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">hello@mainframe.co</span>
              </span>
              {copied ? (
                <span className="text-[11px] font-bold text-emerald-400">Copied!</span>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block shrink-0 stroke-current"
                >
                  <rect x="3.5" y="1.5" width="7" height="7" rx="1" strokeWidth="1" />
                  <path
                    d="M1.5 4.5V9.5C1.5 10.0523 1.94772 10.5 2.5 10.5H7.5"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Thapar Portal Gateway Highlight Pill */}
            <Link
              to="/properties"
              className="inline-flex items-center justify-center bg-red-600 text-white font-bold rounded-full text-[13px] sm:text-[15px] px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all duration-200 animate-pulse"
            >
              <span>⚡ Enter Thapar PG Finder Portal &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-4 right-5 sm:right-8 text-[11px] text-white/50 hidden sm:flex items-center gap-2">
          <span>&larr; Drag mouse horizontally across screen to scrub video &rarr;</span>
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
