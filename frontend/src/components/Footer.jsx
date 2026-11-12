import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top Banner / Emergency Contacts for Thapar Students */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-b border-red-900/30 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-red-200">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span className="font-semibold">Thapar University Student Security & Emergency Helplines:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span>TIET Campus Security: <strong className="text-white">+91 175 2393000</strong></span>
            <span>•</span>
            <span>Patiala Police Control: <strong className="text-white">112 / 100</strong></span>
            <span>•</span>
            <span>Women Helpline: <strong className="text-white">1091</strong></span>
            <span>•</span>
            <span>Ambulance: <strong className="text-white">108</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & TIET Patiala info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Thapar<span className="text-red-500">PG</span>Finder
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              The premier student housing, PG, and rental accommodation marketplace for{' '}
              <strong className="text-white">Thapar Institute of Engineering & Technology (TIET)</strong>, Patiala. Helping students find safe, verified, and affordable living within walking distance of campus gates.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>Bhadson Road, Patiala, Punjab 147004, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>support@thaparpgfinder.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>+91 175 2393000 (Campus Helpline)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Popular Localities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Localities Near TIET
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?locality=Bhadson%20Road" className="hover:text-white transition">
                  Bhadson Road (Gates 2 & 3)
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Prem%20Nagar" className="hover:text-white transition">
                  Prem Nagar (Gate 1)
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=SST%20Nagar" className="hover:text-white transition">
                  SST Nagar
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Model%20Town" className="hover:text-white transition">
                  Model Town Patiala
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Urban%20Estate%20Phase%201" className="hover:text-white transition">
                  Urban Estate Phase 1 & 2
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Punjabi%20Bagh" className="hover:text-white transition">
                  Punjabi Bagh
                </Link>
              </li>
              <li>
                <Link to="/properties?locality=Leela%20Bhawan" className="hover:text-white transition">
                  Leela Bhawan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Students */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Thapar Students
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?gender=Boys" className="hover:text-white transition">
                  Boys PGs & Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?gender=Girls" className="hover:text-white transition">
                  Girls PGs & Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Flat" className="hover:text-white transition">
                  Student Flats & Apartments
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">
                  Compare Accommodations
                </Link>
              </li>
              <li>
                <Link to="/student/agreements" className="hover:text-white transition">
                  Digital Rental Agreements
                </Link>
              </li>
              <li>
                <Link to="/student/bookings" className="hover:text-white transition">
                  Track Application Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Owners & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Owners & Administration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-white transition">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/owner/dashboard" className="hover:text-white transition">
                  Owner Management Console
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition">
                  Admin Verification Portal
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Safety & Verification Rules
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Report Fraudulent Listing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Requirement from Section 8 */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Legal & Statutory Notice:</strong> Digital rental agreement templates and checklists provided on this platform serve as structured mutual records between students and accommodation owners. They do not automatically substitute for mandatory local stamp duty, municipal tenancy registration, or Punjab Rent Act statutory requirements. Students and landlords are advised to verify legal formalities according to their specific tenancy tenure.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Thapar PG Finder Platform. Designed specifically for TIET Patiala students.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-300">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">Dispute Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
