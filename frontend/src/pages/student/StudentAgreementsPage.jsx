import React, { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import RentalAgreementViewer from '../../components/RentalAgreementViewer';

const StudentAgreementsPage = () => {
  const [agreements, setAgreements] = useState([]);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agreements/my/list');
      if (res.data.success) {
        setAgreements(res.data.agreements || []);
        if (res.data.agreements?.length > 0 && !selectedAgreement) {
          setSelectedAgreement(res.data.agreements[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleAgreementUpdated = (updated) => {
    setSelectedAgreement(updated);
    setAgreements((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Digital Rental Agreements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review legal tenancy schedules, sign agreements electronically, and download certified PDFs
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading rental agreements from database...
        </div>
      ) : agreements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Rental Agreements Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once a property owner accepts your booking application, a digital rental agreement will be generated here for your signature.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Agreement List Selector */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Agreement ({agreements.length})
            </span>
            {agreements.map((ag) => (
              <button
                key={ag._id}
                type="button"
                onClick={() => setSelectedAgreement(ag)}
                className={`w-full text-left p-3.5 rounded-xl border transition ${
                  selectedAgreement?._id === ag._id
                    ? 'bg-red-50/70 border-red-300 text-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs truncate">{ag.property?.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ₹{ag.terms?.monthlyRent?.toLocaleString('en-IN')}/mo
                </div>
                <span
                  className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ag.status === 'Signed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ag.status}
                </span>
              </button>
            ))}
          </div>

          {/* Active Viewer */}
          <div className="lg:col-span-3">
            {selectedAgreement && (
              <RentalAgreementViewer
                agreement={selectedAgreement}
                onAgreementUpdated={handleAgreementUpdated}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAgreementsPage;
