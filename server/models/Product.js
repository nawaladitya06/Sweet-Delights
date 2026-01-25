const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    adminReply: {
        text: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        createdAt: { type: Date }
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Cakes', 'Cupcakes', 'Cookies', 'Macarons', 'Pies', 'Other', 'Custom']
    },
    image: {
        type: String,
        required: true
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
