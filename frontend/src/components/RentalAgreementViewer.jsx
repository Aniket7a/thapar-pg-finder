import React, { useRef, useState, useEffect } from 'react';
import {
  FileText,
  Download,
  PenTool,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RentalAgreementViewer = ({ agreement, onAgreementUpdated }) => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if current user is student or owner
  const isStudent = agreement?.student?._id === user?._id || agreement?.student === user?._id;
  const isOwner = agreement?.owner?._id === user?._id || agreement?.owner === user?._id;

  const currentPartyHasSigned = isStudent
    ? agreement?.studentSignature?.signed
    : isOwner
    ? agreement?.ownerSignature?.signed
    : false;

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
  }, [currentPartyHasSigned]);

  // Canvas drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Submit Signature
  const handleSign = async () => {
    setError('');
    if (!legalConsent) {
      setError('You must review and check the statutory disclaimer consent before signing.');
      return;
    }
    if (!hasDrawn) {
      setError('Please draw your signature in the signature box.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');

    setSigningLoading(true);
    try {
      const res = await api.post(`/agreements/${agreement._id}/sign`, {
        signatureData,
        legalDisclaimerConsent: true,
      });

      if (res.data.success) {
        if (onAgreementUpdated) onAgreementUpdated(res.data.agreement);
        alert('Rental agreement signed successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign agreement.');
    } finally {
      setSigningLoading(false);
    }
  };

  // Generate and Download PDF using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 15;
    let y = 20;

    // Header Header Banner
    doc.setFillColor(196, 18, 48); // Thapar Crimson
    doc.rect(0, 0, 210, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('THAPAR ACCOMMODATION PORTAL — RESIDENTIAL TENANCY RECORD', margin, 11);

    y = 28;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text('STUDENT RENTAL AGREEMENT & TENANCY SCHEDULE', margin, y);

    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Document Reference: ${agreement._id}  |  Generated for Patiala, Punjab Jurisdiction`, margin, y);

    y += 10;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, 210 - margin, y);

    // Section 1: Parties
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(196, 18, 48);
    doc.text('1. CONTRACTING PARTIES', margin, y);

    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('LANDLORD / PROPERTY OWNER:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${agreement.terms.landlordLegalName}`, margin + 65, y);

    y += 5;
    doc.text(`Contact: ${agreement.terms.landlordPhone}  |  Address: ${agreement.terms.landlordAddress}`, margin, y);

    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('TENANT / STUDENT:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${agreement.terms.tenantLegalName} (Thapar Roll No: ${agreement.terms.tenantThaparId})`, margin + 65, y);

    y += 5;
    doc.text(`Contact: ${agreement.terms.tenantPhone}  |  University Details: ${agreement.terms.tenantAddress}`, margin, y);

    // Section 2: Property & Financial Terms
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(196, 18, 48);
    doc.text('2. PREMISES & FINANCIAL PARTICULARS', margin, y);

    y += 6;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Premises: ${agreement.terms.propertyAddress}`, margin, y);
    y += 5;
    doc.text(`Allocated Room: ${agreement.terms.roomDetails}`, margin, y);
    y += 5;
    doc.text(`Monthly Rent: Rs. ${agreement.terms.monthlyRent.toLocaleString('en-IN')}/- (Due by ${agreement.terms.paymentDueDate}th of each English calendar month)`, margin, y);
    y += 5;
    doc.text(`Security Deposit: Rs. ${agreement.terms.securityDeposit.toLocaleString('en-IN')}/- (Refundable upon vacating after damage verification)`, margin, y);
    y += 5;
    doc.text(`Electricity & Utilities: ${agreement.terms.electricityCharges}  |  Water: ${agreement.terms.waterCharges}`, margin, y);
    y += 5;
    doc.text(`Tenure: From ${new Date(agreement.terms.startDate).toLocaleDateString()} to ${new Date(agreement.terms.endDate).toLocaleDateString()} (Min. stay: ${agreement.terms.minimumStayMonths} mos)`, margin, y);
    y += 5;
    doc.text(`Notice Period: ${agreement.terms.noticePeriodDays} days written notice required prior to vacating.`, margin, y);

    // Section 3: Rules & Policies
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(196, 18, 48);
    doc.text('3. HOUSE COVENANTS & CODE OF CONDUCT', margin, y);

    y += 6;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    (agreement.terms.houseRules || []).forEach((rule) => {
      doc.text(`• ${rule}`, margin, y);
      y += 4.5;
    });

    y += 2;
    doc.text(`• Guest Policy: ${agreement.terms.guestPolicy}`, margin, y);
    y += 4.5;
    doc.text(`• Security Deductions: ${agreement.terms.damageDepositDeductionPolicy}`, margin, y);
    y += 4.5;
    doc.text(`• Legal Jurisdiction: ${agreement.terms.disputeResolution}`, margin, y);

    // Statutory Disclaimer
    y += 8;
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, 180, 16, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'STATUTORY NOTICE: This digital record constitutes an electronic acknowledgment between tenant and landlord.',
      margin + 3,
      y + 5
    );
    doc.text(
      'It does not substitute for state stamp duty or mandatory local registration under applicable Punjab Tenancy Laws.',
      margin + 3,
      y + 9
    );
    doc.text(
      'Both parties have reviewed and consented to terms outlined above in mutual good faith.',
      margin + 3,
      y + 13
    );

    // Signatures Section
    y += 22;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, 210 - margin, y);

    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('STUDENT SIGNATURE:', margin, y);
    doc.text('OWNER / LANDLORD SIGNATURE:', margin + 95, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    if (agreement.studentSignature?.signed) {
      doc.setTextColor(22, 101, 52);
      doc.text(`Digitally Signed by: ${agreement.studentSignature.signedByName}`, margin, y);
      doc.text(`Timestamp: ${new Date(agreement.studentSignature.signedAt).toLocaleString()}`, margin, y + 4);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text('[Pending Student Signature]', margin, y);
    }

    if (agreement.ownerSignature?.signed) {
      doc.setTextColor(22, 101, 52);
      doc.text(`Digitally Signed by: ${agreement.ownerSignature.signedByName}`, margin + 95, y);
      doc.text(`Timestamp: ${new Date(agreement.ownerSignature.signedAt).toLocaleString()}`, margin + 95, y + 4);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text('[Pending Landlord Signature]', margin + 95, y);
    }

    // Save PDF
    doc.save(`Thapar_Rental_Agreement_${agreement._id.slice(-6)}.pdf`);
  };

  if (!agreement) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Top Banner */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight">
              Thapar Digital Rental Agreement
            </h3>
            <p className="text-xs text-slate-400">
              Contract ID: <span className="font-mono text-slate-300">{agreement._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              agreement.status === 'Signed'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            Status: {agreement.status}
          </span>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Agreement Formal Document Body */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs leading-relaxed max-h-[600px] overflow-y-auto font-sans">
        {/* Document Title Header */}
        <div className="text-center pb-4 border-b border-slate-200">
          <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide">
            RESIDENTIAL PREMISES TENANCY AGREEMENT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Governed by Tenancy Laws applicable in Patiala, Punjab, India
          </p>
        </div>

        {/* 1. Contracting Parties */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            1. PARTIES TO THIS AGREEMENT
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block text-xs mb-1">
                FIRST PARTY (LANDLORD / OWNER):
              </span>
              <p className="text-slate-700"><strong>Name:</strong> {agreement.terms.landlordLegalName}</p>
              <p className="text-slate-700"><strong>Phone:</strong> {agreement.terms.landlordPhone}</p>
              <p className="text-slate-700"><strong>Premises Address:</strong> {agreement.terms.landlordAddress}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-xs mb-1">
                SECOND PARTY (TENANT / STUDENT):
              </span>
              <p className="text-slate-700"><strong>Name:</strong> {agreement.terms.tenantLegalName}</p>
              <p className="text-slate-700"><strong>Thapar Roll No:</strong> {agreement.terms.tenantThaparId}</p>
              <p className="text-slate-700"><strong>Contact:</strong> {agreement.terms.tenantPhone}</p>
            </div>
          </div>
        </div>

        {/* 2. Accommodation & Financials */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            2. PREMISES & PAYMENT TERMS
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p>
              <strong>Rented Premises:</strong> {agreement.terms.propertyAddress} ({agreement.terms.roomDetails})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-800">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Monthly Rent</span>
                <strong className="text-xs text-red-600">₹{agreement.terms.monthlyRent?.toLocaleString('en-IN')}/mo</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Security Deposit</span>
                <strong className="text-xs text-slate-900">₹{agreement.terms.securityDeposit?.toLocaleString('en-IN')}</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Due Day</span>
                <strong className="text-xs text-slate-900">{agreement.terms.paymentDueDate}th of each month</strong>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Notice Period</span>
                <strong className="text-xs text-slate-900">{agreement.terms.noticePeriodDays} Days</strong>
              </div>
            </div>
            <p className="pt-1">
              <strong>Electricity & Utilities:</strong> {agreement.terms.electricityCharges} •{' '}
              <strong>Water Charges:</strong> {agreement.terms.waterCharges}
            </p>
            <p>
              <strong>Agreement Tenure:</strong> {new Date(agreement.terms.startDate).toLocaleDateString()} to{' '}
              {new Date(agreement.terms.endDate).toLocaleDateString()} (Minimum Stay: {agreement.terms.minimumStayMonths} Months)
            </p>
          </div>
        </div>

        {/* 3. House Rules & Code of Conduct */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
            3. HOUSE COVENANTS & STUDENT POLICIES
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {(agreement.terms.houseRules || []).map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
            <li><strong>Guest Policy:</strong> {agreement.terms.guestPolicy}</li>
            <li><strong>Damage & Repairs:</strong> {agreement.terms.damageDepositDeductionPolicy}</li>
            <li><strong>Dispute Resolution:</strong> {agreement.terms.disputeResolution}</li>
          </ul>
        </div>

        {/* Mandatory Statutory Disclaimer from Section 8 */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>IMPORTANT STATUTORY DISCLAIMER:</strong> {agreement.statutoryNotice}
            </div>
          </div>
        </div>

        {/* 4. Signatures Section */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
            4. DIGITAL EXECUTION & SIGNATURES
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Student Signature Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 block mb-2">
                Tenant (Student) Signature
              </span>
              {agreement.studentSignature?.signed ? (
                <div className="space-y-1">
                  <div className="h-16 flex items-center justify-center border-b border-dashed border-slate-300">
                    <img
                      src={agreement.studentSignature.signatureData}
                      alt="Student Signature"
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digitally Signed by {agreement.studentSignature.signedByName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(agreement.studentSignature.signedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                  <span className="text-xs font-medium">Awaiting Student Digital Signature</span>
                </div>
              )}
            </div>

            {/* Owner Signature Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 block mb-2">
                Landlord (Owner) Signature
              </span>
              {agreement.ownerSignature?.signed ? (
                <div className="space-y-1">
                  <div className="h-16 flex items-center justify-center border-b border-dashed border-slate-300">
                    <img
                      src={agreement.ownerSignature.signatureData}
                      alt="Owner Signature"
                      className="max-h-12 max-w-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Digitally Signed by {agreement.ownerSignature.signedByName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(agreement.ownerSignature.signedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="h-20 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                  <span className="text-xs font-medium">Awaiting Landlord Digital Signature</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Capture Pad (Only shown if current user hasn't signed yet) */}
      {!currentPartyHasSigned && (
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-slate-900">
                  Draw Your Signature Below ({isStudent ? 'Student' : 'Owner'})
                </span>
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            {/* Canvas */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width={420}
                height={130}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair touch-none"
              />
            </div>

            {/* Legal consent check requirement */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={legalConsent}
                onChange={(e) => setLegalConsent(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span className="leading-relaxed">
                I have read, reviewed, and consented to the rental agreement terms and acknowledge the statutory legal disclaimer.
              </span>
            </label>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleSign}
              disabled={signingLoading || !hasDrawn || !legalConsent}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingLoading ? 'Signing Document...' : 'Sign Agreement Digitally'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalAgreementViewer;
