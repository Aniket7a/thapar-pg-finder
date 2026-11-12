import express from 'express';
import {
  getPropertyReviews,
  createReview,
  replyToReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', protect, createReview);
router.put('/:id/reply', protect, authorize('owner', 'admin'), replyToReview);

export default router;
