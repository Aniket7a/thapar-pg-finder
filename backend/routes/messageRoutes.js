import express from 'express';
import {
  sendMessage,
  getMessageThread,
  getConversations,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/thread/:userId', protect, getMessageThread);

export default router;
