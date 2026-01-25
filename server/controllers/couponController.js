const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
    const { code, orderAmount } = req.body;
    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or inactive coupon code' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (orderAmount * coupon.discountAmount) / 100;
        } else {
            discount = coupon.discountAmount;
        }

        res.json({
            code: coupon.code,
            discount: discount.toFixed(2),
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    const { code, discountType, discountAmount, minOrderAmount, expiryDate, usageLimit } = req.body;
    try {
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountAmount,
            minOrderAmount,
            expiryDate,
            usageLimit
        });

        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    validateCoupon,
    getCoupons,
    createCoupon,
    deleteCoupon
};
