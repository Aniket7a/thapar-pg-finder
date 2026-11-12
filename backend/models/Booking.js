import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
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
    roomType: {
      type: String,
      required: [true, 'Please specify desired room sharing type'],
      default: 'Double Sharing',
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    moveInDate: {
      type: Date,
      required: [true, 'Please specify desired move-in date'],
    },
    rentalDurationMonths: {
      type: Number,
      default: 11,
    },
    personalMessage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
        'Visit Scheduled',
        'Agreement Pending',
        'Confirmed',
        'Cancelled',
        'Completed',
      ],
      default: 'Pending',
    },
    agreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RentalAgreement',
    },
    ownerNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ student: 1, property: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
