import express from 'express';
import {
  generateAgreement,
  signAgreement,
  getAgreementById,
  getMyAgreements,
} from '../controllers/agreementController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateAgreement);
router.post('/:id/sign', protect, signAgreement);
router.get('/my/list', protect, getMyAgreements);
router.get('/:id', protect, getAgreementById);

export default router;
