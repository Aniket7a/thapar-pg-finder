import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
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
    ratings: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5, default: 4 },
      location: { type: Number, min: 1, max: 5, default: 4 },
      food: { type: Number, min: 1, max: 5, default: 4 },
      safety: { type: Number, min: 1, max: 5, default: 5 },
      ownerBehaviour: { type: Number, min: 1, max: 5, default: 4 },
      valueForMoney: { type: Number, min: 1, max: 5, default: 4 },
    },
    comment: {
      type: String,
      required: [true, 'Please add a written review'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    isVerifiedStay: {
      type: Boolean,
      default: true,
    },
    images: [{ type: String }],
    ownerResponse: {
      text: { type: String },
      respondedAt: { type: Date },
    },
    status: {
      type: String,
      enum: ['approved', 'flagged', 'hidden'],
      default: 'approved',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review for the same property by the same student
reviewSchema.index({ property: 1, student: 1 }, { unique: true });

// Static method to calculate average rating and update Property
reviewSchema.statics.getAverageRating = async function (propertyId) {
  const obj = await this.aggregate([
    {
      $match: { property: propertyId, status: 'approved' },
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$ratings.overall' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Property = mongoose.model('Property');
    if (obj[0]) {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        totalReviews: obj[0].totalReviews,
      });
    } else {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }
  } catch (err) {
    console.error('Failed to update property rating aggregate:', err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.property);
});

// Call getAverageRating after remove/delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.property);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
