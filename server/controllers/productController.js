const Product = require('../models/Product');
const User = require('../models/User'); // Import User model
const sendEmail = require('../utils/sendEmail'); // Import sendEmail utility

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, countInStock } = req.body;

        const product = new Product({
            user: req.user ? req.user._id : null, // Link to user if logged in
            name,
            description,
            price,
            category,
            image,
            countInStock: countInStock || 0,
            rating: 5,
            numReviews: 0,
            isBestSeller: false
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.image = image || product.image;
            product.countInStock = countInStock || product.countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {


        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
const deleteProductReview = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.find(
            (r) => r._id.toString() === req.params.reviewId.toString()
        );

        if (review) {
            product.reviews = product.reviews.filter(
                (r) => r._id.toString() !== req.params.reviewId.toString()
            );

            product.numReviews = product.reviews.length;

            if (product.numReviews > 0) {
                product.rating =
                    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                    product.reviews.length;
            } else {
                product.rating = 0;
            }

            await product.save();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};



// @desc    Reply to a review
// @route   POST /api/products/:id/reviews/:reviewId/reply
// @access  Private/Admin
const replyToProductReview = async (req, res) => {
    const { text } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.find(
            (r) => r._id.toString() === req.params.reviewId.toString()
        );

        if (review) {
            review.adminReply = {
                text,
                user: req.user._id,
                name: req.user.name,
                createdAt: Date.now()
            };

            await product.save();

            // Notify user via email
            const user = await User.findById(review.user);
            if (user && user.email) {
                try {
                    const message = `
                        <h1>Hello ${user.name},</h1>
                        <p>An admin has replied to your review on <strong>${product.name}</strong>.</p>
                        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                            ${text}
                        </blockquote>
                        <p>You can view the reply by visiting the product page.</p>
                        <p>Regards,<br>Sweet Delights Team</p>
                    `;

                    await sendEmail({
                        email: user.email,
                        subject: 'New Reply to Your Review - Sweet Delights',
                        message
                    });
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                    // Continue without failing the request
                }
            }

            res.json({ message: 'Reply added successfully' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a review reply
// @route   DELETE /api/products/:id/reviews/:reviewId/reply
// @access  Private/SuperAdmin
const deleteProductReviewReply = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const review = product.reviews.find(
            (r) => r._id.toString() === req.params.reviewId.toString()
        );

        if (review && review.adminReply) {
            review.adminReply = undefined; // Remove the reply
            await product.save();
            res.json({ message: 'Reply removed' });
        } else {
            res.status(404).json({ message: 'Reply not found' });
        }
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview,
    replyToProductReview,
    deleteProductReviewReply
};
