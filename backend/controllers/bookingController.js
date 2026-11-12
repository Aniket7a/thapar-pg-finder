import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private (Student)
export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, roomType, moveInDate, rentalDurationMonths, personalMessage } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    if (property.availableBeds <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No available beds left in this property currently.',
      });
    }

    // Check if student already has a pending/accepted booking for this property
    const existingBooking = await Booking.findOne({
      student: req.user.id,
      property: propertyId,
      status: { $in: ['Pending', 'Accepted', 'Agreement Pending', 'Confirmed'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active or pending booking application for this property.',
      });
    }

    const booking = await Booking.create({
      student: req.user.id,
      property: propertyId,
      owner: property.owner,
      roomType: roomType || 'Double Sharing',
      monthlyRent: property.pricing.monthlyRent,
      securityDeposit: property.pricing.securityDeposit,
      moveInDate: moveInDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      rentalDurationMonths: rentalDurationMonths || 11,
      personalMessage,
      status: 'Pending',
    });

    // Notify owner
    await Notification.create({
      user: property.owner,
      title: 'New Booking Request Received',
      message: `${req.user.name} has submitted a rental application for ${property.title}.`,
      type: 'booking',
      link: '/owner/bookings',
    });

    const populated = await Booking.findById(booking._id)
      .populate('property', 'title address pricing images')
      .populate('owner', 'name phone email');

    res.status(201).json({
      success: true,
      message: 'Booking application sent to property owner.',
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Student)
export const getStudentBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ student: req.user.id })
      .populate('property', 'title address pricing images distanceFromThapar')
      .populate('owner', 'name phone email avatar')
      .populate('agreement')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's bookings
// @route   GET /api/bookings/owner-bookings
// @access  Private (Owner)
export const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate('property', 'title address pricing availableBeds')
      .populate('student', 'name email phone avatar studentDetails emergencyContact')
      .populate('agreement')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Accept / Reject / Cancel / Confirm)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner/Student)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerNote } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('student', 'name email')
      .populate('owner', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.',
      });
    }

    // Permission check
    const isOwner = booking.owner._id.toString() === req.user.id;
    const isStudent = booking.student._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isStudent && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this booking request.',
      });
    }

    const previousStatus = booking.status;
    booking.status = status;
    if (ownerNote) booking.ownerNote = ownerNote;

    // Bed availability management:
    // If status transitions to 'Confirmed', decrement availableBeds
    if (status === 'Confirmed' && previousStatus !== 'Confirmed') {
      await Property.findByIdAndUpdate(booking.property._id, {
        $inc: { availableBeds: -1 },
      });
    } else if (
      (status === 'Cancelled' || status === 'Rejected') &&
      previousStatus === 'Confirmed'
    ) {
      // Re-increment available beds
      await Property.findByIdAndUpdate(booking.property._id, {
        $inc: { availableBeds: 1 },
      });
    }

    await booking.save();

    // Notify appropriate counterparty
    const targetUserId = isOwner ? booking.student._id : booking.owner._id;
    const updaterName = isOwner ? booking.owner.name : booking.student.name;

    await Notification.create({
      user: targetUserId,
      title: `Booking Status: ${status}`,
      message: `${updaterName} updated the booking status for ${booking.property.title} to "${status}".`,
      type: 'booking',
      link: isOwner ? '/student/bookings' : '/owner/bookings',
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};
