import mongoose from 'mongoose';

const propertyVisitSchema = new mongoose.Schema(
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
    preferredDate: {
      type: Date,
      required: [true, 'Please select a visit date'],
    },
    preferredTimeSlot: {
      type: String,
      required: [true, 'Please select a time slot'],
      enum: [
        'Morning (09:00 AM - 12:00 PM)',
        'Afternoon (12:00 PM - 03:00 PM)',
        'Evening (03:00 PM - 06:00 PM)',
        'Night (06:00 PM - 08:00 PM)',
      ],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Rescheduled', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    rescheduledTime: {
      type: String,
    },
    ownerNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

propertyVisitSchema.index({ student: 1, property: 1, preferredDate: 1 });
propertyVisitSchema.index({ owner: 1, status: 1 });

const PropertyVisit = mongoose.model('PropertyVisit', propertyVisitSchema);
export default PropertyVisit;
