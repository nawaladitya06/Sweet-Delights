const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    inquiryType: {
        type: String,
        required: true,
        default: 'General Inquiry'
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional, as guest users can also contact
    },
    status: {
        type: String,
        enum: ['New', 'Replied'],
        default: 'New'
    },
    adminReply: {
        type: String
    },
    repliedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
