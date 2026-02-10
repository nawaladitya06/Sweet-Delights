const Contact = require('../models/Contact');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const jwt = require('jsonwebtoken');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, inquiryType, message } = req.body;

        // Manually check for token to associate user (since route is Public)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
                req.user = await User.findById(decoded.id).select('-password');
            } catch (error) {
                // Ignore invalid tokens for public route
                console.log('Contact form: Invalid token ignored');
            }
        }

        const contact = await Contact.create({
            name,
            email,
            inquiryType,
            message,
            user: req.user ? req.user._id : null
        });

        // Note: Email notification is sent client-side via Web3Forms
        // (Cloudflare blocks server-side requests to Web3Forms API)

        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find({}).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get recent public inquiries (name & type only, no sensitive data)
// @route   GET /api/contact/public
// @access  Public
const getPublicInquiries = async (req, res) => {
    try {
        const inquiries = await Contact.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name inquiryType createdAt');
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/SuperAdmin
const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);

        if (message) {
            await message.deleteOne();
            res.json({ message: 'Message removed' });
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reply to a contact message
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
const replyToMessage = async (req, res) => {
    try {
        const { replyMessage } = req.body;
        const message = await Contact.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Send reply notification via Web3Forms
        try {
            await sendEmail({
                email: message.email,
                subject: `Re: ${message.inquiryType} - Sweet Delights`,
                message: `
                    Reply to ${message.name} (${message.email})
                    
                    Original Message: "${message.message}"
                    
                    Admin Reply: ${replyMessage}
                `
            });
        } catch (emailError) {
            console.error('Email send failed:', emailError);
        }

        // Update message status
        message.status = 'Replied';
        message.adminReply = replyMessage;
        message.repliedAt = Date.now();

        const updatedMessage = await message.save();
        res.status(200).json(updatedMessage);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    submitContactForm,
    getAllMessages,
    getPublicInquiries,
    deleteMessage,
    replyToMessage
};
