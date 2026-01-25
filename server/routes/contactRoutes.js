const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllMessages,
    deleteMessage,
    replyToMessage
} = require('../controllers/contactController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

// Public route to submit form
// Note: We might want protect middleware if we want to associate with user, 
// but contact form is usually public. 
// The controller handles `req.user` check if it exists (optional auth).
// To allow `req.user` to be populated IF logged in, we might need a "loose" protect or just rely on frontend passing token if avl.
// For now, let's make it public. If user is logged in, frontend usually sends token.
// Explicitly handling "optional" auth is tricky with strict `protect` middleware.
// We will just leave it open. If we want to capture user ID, we need to handle that.
// Let's assume for now guests are most likely. If we want to capture UserID, 
// we should check if header has token. 
// For simplicity in this step, I'll allow public access and if `req.user` isn't populated by default express, 
// I'll add a middleware to decode token optionally if present, BUT `protect` throws error if no token.
// So I will make a separate middleware or just leave it as public (anonymous) for now.
// Actually, `protect` middleware throws "Not authorized, no token".
// So I'll keep it public for now, user field will be null unless I make a "optionalProtect" middleware.
// Given the requirements, just saving the message is key. User ID is a nice-to-have.

router.post('/', submitContactForm);

// Admin routes
router.get('/', protect, admin, getAllMessages);
router.delete('/:id', protect, superAdmin, deleteMessage);
router.post('/:id/reply', protect, admin, replyToMessage);

module.exports = router;
