import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      property: req.params.propertyId,
      status: { $ne: 'hidden' },
    })
      .populate('student', 'name avatar studentDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Student)
export const createReview = async (req, res, next) => {
  try {
    const { propertyId, ratings, comment, images } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Owner cannot review their own property
    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Property owners are not permitted to review their own listings.',
      });
    }

    // Check for existing review by this student
    const existingReview = await Review.findOne({
      property: propertyId,
      student: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property.',
      });
    }

    const review = await Review.create({
      property: propertyId,
      student: req.user.id,
      ratings: ratings || { overall: 5 },
      comment,
      images: images || [],
      isVerifiedStay: true,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'student',
      'name avatar studentDetails'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Owner response to a review
// @route   PUT /api/reviews/:id/reply
// @access  Private (Owner)
export const replyToReview = async (req, res, next) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id).populate('property');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    // Verify owner
    if (review.property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the property owner can reply to this review.',
      });
    }

    review.ownerResponse = {
      text,
      respondedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Owner response posted.',
      review,
    });
  } catch (error) {
    next(error);
  }
};
