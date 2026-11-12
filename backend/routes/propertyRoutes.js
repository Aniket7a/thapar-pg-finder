import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  compareProperties,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('owner', 'admin'), upload.array('images', 8), createProperty);

router.post('/compare', compareProperties);
router.get('/owner/my-listings', protect, authorize('owner', 'admin'), getMyProperties);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('owner', 'admin'), updateProperty)
  .delete(protect, authorize('owner', 'admin'), deleteProperty);

export default router;
