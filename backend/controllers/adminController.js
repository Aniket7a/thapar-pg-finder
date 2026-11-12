import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import RentalAgreement from '../models/RentalAgreement.js';
import Complaint from '../models/Complaint.js';
import Report from '../models/Report.js';

// @desc    Get system-wide platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const verifiedOwners = await User.countDocuments({
      role: 'owner',
      'ownerDetails.verificationStatus': 'approved',
    });

    const totalProperties = await Property.countDocuments();
    const verifiedProperties = await Property.countDocuments({ isVerified: true });
    const featuredProperties = await Property.countDocuments({ isFeatured: true });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const totalAgreements = await RentalAgreement.countDocuments();
    const signedAgreements = await RentalAgreement.countDocuments({ status: 'Signed' });

    const openComplaints = await Complaint.countDocuments({ status: 'Open' });
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    // Recent properties
    const recentProperties = await Property.find()
      .populate('owner', 'name email phone isVerified')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('student', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalOwners,
        verifiedOwners,
        totalProperties,
        verifiedProperties,
        featuredProperties,
        totalBookings,
        confirmedBookings,
        totalAgreements,
        signedAgreements,
        openComplaints,
        pendingReports,
      },
      recentProperties,
      recentBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or toggle owner verification status
// @route   PUT /api/admin/users/:id/verify-owner
// @access  Private (Admin)
export const verifyOwner = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.isVerified = status === 'approved';
    if (!user.ownerDetails) user.ownerDetails = {};
    user.ownerDetails.verificationStatus = status;
    user.ownerDetails.verifiedAt = status === 'approved' ? new Date() : null;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Owner verification status updated to ${status}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin verify property listing or toggle featured
// @route   PUT /api/admin/properties/:id/moderate
// @access  Private (Admin)
export const moderateProperty = async (req, res, next) => {
  try {
    const { isVerified, isFeatured, isActive } = req.body;
    const update = {};

    if (typeof isVerified === 'boolean') update.isVerified = isVerified;
    if (typeof isFeatured === 'boolean') update.isFeatured = isFeatured;
    if (typeof isActive === 'boolean') update.isActive = isActive;

    const property = await Property.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate review
// @route   PUT /api/admin/reviews/:id
// @access  Private (Admin)
export const moderateReview = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved', 'flagged', 'hidden'
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Review status changed to ${status}.`,
      review,
    });
  } catch (error) {
    next(error);
  }
};
