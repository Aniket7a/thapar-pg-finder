import Complaint from '../models/Complaint.js';
import Report from '../models/Report.js';
import Property from '../models/Property.js';

// @desc    File a complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const createComplaint = async (req, res, next) => {
  try {
    const { propertyId, category, title, description, evidenceImages } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    const complaint = await Complaint.create({
      student: req.user.id,
      property: propertyId,
      owner: property.owner,
      category,
      title,
      description,
      evidenceImages: evidenceImages || [],
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted for review.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my
// @access  Private
export const getMyComplaints = async (req, res, next) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : req.user.role === 'owner'
        ? { owner: req.user.id }
        : { student: req.user.id };

    const complaints = await Complaint.find(query)
      .populate('student', 'name email phone')
      .populate('property', 'title address')
      .populate('owner', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin/Owner)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        ...(status === 'Resolved' ? { resolutionDate: new Date() } : {}),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit report (fraud, illegal, fake reviews)
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { propertyId, reportedUserId, reason, details } = req.body;

    const report = await Report.create({
      reportedBy: req.user.id,
      property: propertyId,
      reportedUser: reportedUserId,
      reason,
      details,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will investigate.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private (Admin)
export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email role')
      .populate('property', 'title address')
      .populate('reportedUser', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (Admin)
// @route   PUT /api/reports/:id/status
// @access  Private (Admin)
export const updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated.',
      report,
    });
  } catch (error) {
    next(error);
  }
};
