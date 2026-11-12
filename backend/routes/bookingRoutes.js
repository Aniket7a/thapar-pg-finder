import express from 'express';
import {
  createBooking,
  getStudentBookings,
  getOwnerBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getStudentBookings);
router.get('/owner-bookings', protect, authorize('owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
