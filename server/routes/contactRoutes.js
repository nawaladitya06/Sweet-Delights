const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllMessages,
    getPublicInquiries,
    deleteMessage,
    replyToMessage
} = require('../controllers/contactController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', submitContactForm);
router.get('/public', getPublicInquiries);

// Admin routes
router.get('/', protect, admin, getAllMessages);
router.delete('/:id', protect, superAdmin, deleteMessage);
router.post('/:id/reply', protect, admin, replyToMessage);

module.exports = router;

