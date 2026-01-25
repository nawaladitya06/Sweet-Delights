const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview,
    replyToProductReview,
    deleteProductReviewReply
} = require('../controllers/productController');
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, createProduct); // Allow any logged-in user to create (for AI/Custom)

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct) // Admin (and SuperAdmin) can update products
    .delete(protect, admin, deleteProduct); // Admin (and SuperAdmin) can delete products

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, superAdmin, deleteProductReview); // Only SuperAdmin can delete reviews
router.route('/:id/reviews/:reviewId/reply').post(protect, admin, replyToProductReview); // Admin & SuperAdmin can reply
router.route('/:id/reviews/:reviewId/reply').delete(protect, superAdmin, deleteProductReviewReply); // Only SuperAdmin can delete replies

module.exports = router;
