import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  verifyOwner,
  moderateProperty,
  moderateReview,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/verify-owner', verifyOwner);
router.put('/properties/:id/moderate', moderateProperty);
router.put('/reviews/:id', moderateReview);

export default router;
