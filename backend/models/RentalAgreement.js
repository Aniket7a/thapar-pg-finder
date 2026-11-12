import mongoose from 'mongoose';

const rentalAgreementSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    terms: {
      landlordLegalName: { type: String, required: true },
      landlordAddress: { type: String, required: true },
      landlordPhone: { type: String, required: true },
      tenantLegalName: { type: String, required: true },
      tenantAddress: { type: String, required: true },
      tenantPhone: { type: String, required: true },
      tenantThaparId: { type: String, default: 'TIET-ENROLLED' },
      propertyAddress: { type: String, required: true },
      roomDetails: { type: String, required: true },
      monthlyRent: { type: Number, required: true },
      securityDeposit: { type: Number, required: true },
      paymentDueDate: { type: Number, default: 5 }, // 5th of each month
      electricityCharges: { type: String, default: 'Included in rent' },
      waterCharges: { type: String, default: 'Included' },
      maintenanceCharges: { type: Number, default: 0 },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      minimumStayMonths: { type: Number, default: 6 },
      noticePeriodDays: { type: Number, default: 30 },
      lateFeePerDay: { type: Number, default: 50 },
      damageDepositDeductionPolicy: {
        type: String,
        default: 'Damage to fixtures or structure beyond normal wear and tear will be deducted from security deposit with itemized bill.',
      },
      houseRules: [
        { type: String }
      ],
      guestPolicy: {
        type: String,
        default: 'Day guests permitted in common area until 8:00 PM. Overnight guests require prior owner written consent.',
      },
      disputeResolution: {
        type: String,
        default: 'Any dispute arising under this agreement shall be subject to the exclusive jurisdiction of the Courts at Patiala, Punjab, India.',
      },
    },
    studentSignature: {
      signed: { type: Boolean, default: false },
      signatureData: { type: String }, // Base64 dataURL from signature canvas
      signedAt: { type: Date },
      signedByName: { type: String },
    },
    ownerSignature: {
      signed: { type: Boolean, default: false },
      signatureData: { type: String },
      signedAt: { type: Date },
      signedByName: { type: String },
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending Owner Signature', 'Pending Student Signature', 'Signed', 'Archived'],
      default: 'Draft',
    },
    pdfUrl: {
      type: String,
    },
    legalDisclaimerAcknowledged: {
      type: Boolean,
      default: true,
      required: true,
    },
    statutoryNotice: {
      type: String,
      default: 'IMPORTANT STATUTORY NOTICE: This digital agreement document is provided as a mutual contractual record and template for PG and accommodation premises near Thapar Institute of Engineering & Technology, Patiala. It does not replace applicable Punjab State Tenancy & Rent Control regulations, nor mandatory municipal registration or stamp duty requirements. Both parties are advised to verify legal compliance for their specific tenure.',
    },
  },
  {
    timestamps: true,
  }
);

rentalAgreementSchema.index({ student: 1, status: 1 });
rentalAgreementSchema.index({ owner: 1, status: 1 });
rentalAgreementSchema.index({ booking: 1 });

const RentalAgreement = mongoose.model('RentalAgreement', rentalAgreementSchema);
export default RentalAgreement;
