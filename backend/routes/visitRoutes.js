import express from 'express';
import {
  requestVisit,
  getStudentVisits,
  getOwnerVisits,
  updateVisitStatus,
} from '../controllers/visitController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requestVisit);
router.get('/my-visits', protect, getStudentVisits);
router.get('/owner-visits', protect, authorize('owner', 'admin'), getOwnerVisits);
router.put('/:id/status', protect, updateVisitStatus);

export default router;
