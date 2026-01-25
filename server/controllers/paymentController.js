const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/orders
// @access  Private
const createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occured');

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_id // Our database Order ID to update
        } = req.body;

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Payment Success
            if (order_id) {
                const order = await Order.findById(order_id);
                if (order) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: razorpay_payment_id,
                        status: 'success',
                        update_time: Date.now(),
                        email_address: req.user.email,
                    };
                    await order.save();
                }
            }
            return res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid signature sent!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
};
