import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, MapPin, Award, Users, BookOpen } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
          Our Campus Mission
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Empowering Thapar University Students to Live Better
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Thapar PG Finder was born out of a real problem faced every year by thousands of undergraduate and postgraduate scholars arriving in Patiala.
        </p>
      </div>

      {/* Story & Philosophy */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">Why We Built This Platform</h2>
        <p>
          Thapar Institute of Engineering & Technology (TIET), established in 1956 on Bhadson Road, Patiala, stands as one of India's premier engineering and research institutions. However, with thousands of students enrolling every year across B.Tech, M.Tech, MCA, and PhD programs, finding reputable off-campus accommodation outside campus hostels is often fraught with opaque brokerage fees, inaccurate distance claims, and lack of verified rental documentation.
        </p>
        <p>
          Thapar PG Finder solves this by providing a unified, genuine MERN stack marketplace that connects verified Patiala property owners directly with enrolled students. No middlemen. No fake photos. Real senior reviews. Accurate walking distance to campus gates.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Safety First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict verification checks for all listed properties, especially ensuring biometric entry and wardens for female scholar hostels in Prem Nagar and Leela Bhawan.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Zero Hidden Brokerage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students deal directly with landlords. What you see is what you pay. Transparent electricity meter terms and security deposit refund covenants.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Digital Legal Records</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every booking is backed by an interactive digital rental agreement and downloadable PDF with electronic signatures and statutory Punjab tenancy compliance advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
