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

        // Send email to Admins and Super Admins
        const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } });

        const adminEmails = admins.map(admin => admin.email);

        if (adminEmails.length > 0) {
            const emailMessage = `
                <h2>New Contact Inquiry</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Type:</strong> ${inquiryType}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <br>
                <p>Login to the Admin Dashboard to view more details.</p>
            `;

            // Send to each admin (could be optimized with BCC but loop is fine for small number)
            // Using a loop to send individual emails or using BCC in one email. 
            // Loop ensures individual delivery tracking if needed later.
            // For simplicity/reliability with free SMTP, sending one by one or loop.

            for (const adminEmail of adminEmails) {
                try {
                    await sendEmail({
                        email: adminEmail,
                        subject: `New Inquiry from ${name} - ${inquiryType}`,
                        message: emailMessage
                    });
                } catch (error) {
                    console.error(`Failed to send email to admin ${adminEmail}:`, error);
                    // Continue to next admin even if one fails
                }
            }
        }

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

        // Send email to the user
        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #ff4d6d; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-family: 'Playfair Display', serif;">Sweet Delights</h1>
                </div>
                <div style="padding: 30px; color: #333;">
                    <h2 style="color: #ff4d6d;">Response to Your Inquiry</h2>
                    <p>Dear <strong>${message.name}</strong>,</p>
                    <p>Thank you for reaching out to us. We've reviewed your inquiry and here is our response:</p>
                    
                    <div style="background-color: #fff5f6; padding: 15px; border-left: 4px solid #ff4d6d; margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your Original Message:</strong></p>
                        <p style="margin: 5px 0 0 0; font-style: italic;">"${message.message}"</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <p style="margin: 0; font-size: 14px; color: #ff4d6d;"><strong>Our Response:</strong></p>
                        <p style="margin: 5px 0 0 0; line-height: 1.6;">${replyMessage}</p>
                    </div>

                    <p style="margin-top: 30px;">If you have any further questions, feel free to reply to this email or visit our website.</p>
                    
                    <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
                        <p>Best Regards,</p>
                        <p style="font-weight: bold; color: #ff4d6d;">The Sweet Delights Team</p>
                        <p>Mumbai & Suburbs Delivery</p>
                    </div>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: message.email,
                subject: `Re: ${message.inquiryType} - Sweet Delights`,
                message: emailContent
            });
        } catch (emailError) {
            console.error('Email send failed:', emailError);
            // Optionally decide if we should stop here or continue to save the reply
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
    deleteMessage,
    replyToMessage
};
