const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, googleLogin, updateUserProfile, forgotPassword, resetPassword, updateUserStatus } = require('../controllers/authController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/status/:id', protect, superAdmin, updateUserStatus);

module.exports = router;
