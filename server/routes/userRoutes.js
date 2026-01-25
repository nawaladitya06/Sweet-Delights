const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, updateUserRole, createUser, toggleWishlist, getWishlist, addAddress, removeAddress } = require('../controllers/userController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, superAdmin, getUsers)
    .post(protect, superAdmin, createUser);
router.route('/:id')
    .delete(protect, superAdmin, deleteUser)
    .put(protect, superAdmin, updateUserRole);

router.route('/wishlist')
    .post(protect, toggleWishlist)
    .post(protect, toggleWishlist)
    .get(protect, getWishlist);

router.route('/profile/address')
    .post(protect, addAddress);

router.route('/profile/address/:id')
    .delete(protect, removeAddress);

module.exports = router;
