import PropertyVisit from '../models/PropertyVisit.js';
import Property from '../models/Property.js';
import Notification from '../models/Notification.js';

// @desc    Schedule a property visit
// @route   POST /api/visits
// @access  Private (Student)
export const requestVisit = async (req, res, next) => {
  try {
    const { propertyId, preferredDate, preferredTimeSlot, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    const visit = await PropertyVisit.create({
      student: req.user.id,
      property: propertyId,
      owner: property.owner,
      preferredDate,
      preferredTimeSlot,
      message,
      status: 'Pending',
    });

    await Notification.create({
      user: property.owner,
      title: 'New Visit Request',
      message: `${req.user.name} requested an in-person visit for ${property.title}.`,
      type: 'visit',
      link: '/owner/visits',
    });

    res.status(201).json({
      success: true,
      message: 'Property visit request sent to owner.',
      visit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's visit requests
// @route   GET /api/visits/my-visits
// @access  Private (Student)
export const getStudentVisits = async (req, res, next) => {
  try {
    const visits = await PropertyVisit.find({ student: req.user.id })
      .populate('property', 'title address pricing images distanceFromThapar')
      .populate('owner', 'name phone email avatar')
      .sort({ preferredDate: 1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's visit requests
// @route   GET /api/visits/owner-visits
// @access  Private (Owner)
export const getOwnerVisits = async (req, res, next) => {
  try {
    const visits = await PropertyVisit.find({ owner: req.user.id })
      .populate('property', 'title address')
      .populate('student', 'name phone email avatar studentDetails')
      .sort({ preferredDate: 1 });

    res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update visit request status (Accept / Reject / Reschedule)
// @route   PUT /api/visits/:id/status
// @access  Private (Owner/Student)
export const updateVisitStatus = async (req, res, next) => {
  try {
    const { status, rescheduledTime, ownerNotes } = req.body;
    const visit = await PropertyVisit.findById(req.params.id)
      .populate('property')
      .populate('student', 'name email')
      .populate('owner', 'name email');

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: 'Visit request not found.',
      });
    }

    visit.status = status;
    if (rescheduledTime) visit.rescheduledTime = rescheduledTime;
    if (ownerNotes) visit.ownerNotes = ownerNotes;

    await visit.save();

    await Notification.create({
      user: visit.student._id,
      title: `Visit Update: ${status}`,
      message: `Your visit for ${visit.property.title} was marked as ${status}. Notes: ${ownerNotes || 'None'}`,
      type: 'visit',
      link: '/student/visits',
    });

    res.status(200).json({
      success: true,
      message: `Visit marked as ${status}.`,
      visit,
    });
  } catch (error) {
    next(error);
  }
};
