import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Maintenance & Repairs',
        'Food Quality & Hygiene',
        'Owner Misbehavior',
        'Overcharging & Hidden Fees',
        'Safety & Security',
        'Electricity / Water Cut',
        'Other',
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint subject'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the issue in detail'],
    },
    evidenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'],
      default: 'Open',
    },
    adminNotes: {
      type: String,
    },
    resolutionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ student: 1, status: 1 });
complaintSchema.index({ owner: 1, status: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
