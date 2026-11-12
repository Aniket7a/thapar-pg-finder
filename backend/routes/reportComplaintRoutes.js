import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  updateComplaintStatus,
  createReport,
  getAllReports,
  updateReportStatus,
} from '../controllers/reportComplaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Complaints
router.post('/complaints', protect, createComplaint);
router.get('/complaints/my', protect, getMyComplaints);
router.put('/complaints/:id/status', protect, authorize('admin', 'owner'), updateComplaintStatus);

// Reports
router.post('/reports', protect, createReport);
router.get('/reports', protect, authorize('admin'), getAllReports);
router.put('/reports/:id/status', protect, authorize('admin'), updateReportStatus);

export default router;
