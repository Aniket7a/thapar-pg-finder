import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
      enum: [
        'Fraudulent Listing',
        'Misleading Photos/Prices',
        'Harassment or Abuse',
        'Illegal Activity',
        'Fake Reviews',
        'Already Occupied / Ghost Listing',
        'Other',
      ],
      required: [true, 'Please provide a reason for the report'],
    },
    details: {
      type: String,
      required: [true, 'Please provide detailed explanations or evidence'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Investigating', 'Resolved', 'Dismissed'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ reportedBy: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
