import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, propertyId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver and content are required.',
      });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      property: propertyId,
      content,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .populate('property', 'title');

    // Send in-app notification
    await Notification.create({
      user: receiverId,
      title: `New message from ${req.user.name}`,
      message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
      type: 'message',
      link: `/messages?user=${req.user.id}`,
    });

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages between current user and another user
// @route   GET /api/messages/thread/:userId
// @access  Private
export const getMessageThread = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .populate('property', 'title')
      .sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations list for current user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    // Find all distinct counterparties
    const sent = await Message.find({ sender: req.user.id }).distinct('receiver');
    const received = await Message.find({ receiver: req.user.id }).distinct('sender');

    const userIds = [...new Set([...sent.map(String), ...received.map(String)])];
    const counterparties = await User.find({ _id: { $in: userIds } }).select(
      'name avatar role email phone'
    );

    // Get last message and unread count for each user
    const conversationList = await Promise.all(
      counterparties.map(async (cp) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user.id, receiver: cp._id },
            { sender: cp._id, receiver: req.user.id },
          ],
        }).sort({ createdAt: -1 });

        const unreadCount = await Message.countDocuments({
          sender: cp._id,
          receiver: req.user.id,
          read: false,
        });

        return {
          user: cp,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message date
    conversationList.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    res.status(200).json({
      success: true,
      conversations: conversationList,
    });
  } catch (error) {
    next(error);
  }
};
