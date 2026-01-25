const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        discountAmount,
        discountCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        // Validate stock and decrement
        for (const item of orderItems) {
            const product = await require('../models/Product').findById(item.product);
            if (!product) {
                res.status(404);
                throw new Error(`Product not found: ${item.name}`);
            }
            if (product.countInStock < item.qty) {
                res.status(400);
                throw new Error(`Not enough stock for ${item.name}`);
            }
            product.countInStock = product.countInStock - item.qty;
            await product.save();
        }

        // Increment coupon usage if used
        if (discountCode) {
            const Coupon = require('../models/Coupon');
            await Coupon.findOneAndUpdate({ code: discountCode.toUpperCase() }, { $inc: { usedCount: 1 } });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            discountAmount,
            discountCode
        });

        const createdOrder = await order.save();

        // Send confirmation email
        try {
            const User = require('../models/User');
            const user = await User.findById(req.user._id);
            const sendEmail = require('../utils/sendEmail');

            const emailContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #ff4d6d; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Sweet Delights</h1>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <h2>Order Confirmed!</h2>
                        <p>Hi ${user.name},</p>
                        <p>Thank you for your order! We're getting your treats ready.</p>
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">Order ID: ${createdOrder._id}</p>
                            <p style="margin: 5px 0 0 0;">Total Amount: ₹${createdOrder.totalPrice}</p>
                            <p style="margin: 5px 0 0 0;">Payment Method: ${createdOrder.paymentMethod}</p>
                        </div>
                        <h3>Delivery Address:</h3>
                        <p>${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}</p>
                        <p>Expected Delivery: 2-4 hours</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="text-align: center; color: #888;">Visit your profile to track your order.</p>
                    </div>
                </div>
            `;

            await sendEmail({
                email: user.email,
                subject: 'Your Sweet Delights Order - Confirmed!',
                message: emailContent
            });
        } catch (emailError) {
            console.error('Order confirmation email failed:', emailError);
        }

        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status;

        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
            order.deliveredAt = null;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const orders = await Order.find({});
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

        const User = require('../models/User');
        const totalUsers = await User.countDocuments({});

        // Calculate last 7 days sales for charts
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            const dayOrders = orders.filter(o => {
                const oDate = new Date(o.createdAt).toISOString().split('T')[0];
                return oDate === dateString;
            });

            const dayRevenue = dayOrders.reduce((acc, item) => acc + item.totalPrice, 0);

            last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayRevenue
            });
        }

        // Low stock products
        const Product = require('../models/Product');
        const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } }).select('name countInStock');

        res.json({
            totalOrders,
            totalRevenue: totalRevenue.toFixed(2),
            totalUsers,
            salesHistory: last7Days,
            lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(401).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending orders can be cancelled' });
        }

        // Restore stock
        const Product = require('../models/Product');
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock += item.qty;
                await product.save();
            }
        }

        order.status = 'Cancelled';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderToDelivered,
    updateOrderStatus,
    getDashboardStats,
    cancelOrder
};
