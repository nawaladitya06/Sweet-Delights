const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Added path import
const fs = require('fs'); // Added fs import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Production Safety Check
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error('CRITICAL: JWT_SECRET environment variable is missing in production!');
    // We don't exit here to allow Vercel to potentially show logs, but auth will fail safely.
}
console.log(`Application starting in ${process.env.NODE_ENV || 'development'} mode`);

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitize = require('mongo-sanitize');

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Manual sanitization middleware for Express 5 compatibility
app.use((req, res, next) => {
    req.body = sanitize(req.body);
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = sanitize(req.query[key]);
        });
    }
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            req.params[key] = sanitize(req.params[key]);
        });
    }
    next();
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter specifically to auth and order routes
app.use('/api/auth/login', limiter);
app.use('/api/auth/register', limiter);
app.use('/api/orders', limiter);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetdelights')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Create uploads folder if not exists (Safe for serverless)
try {
    if (!fs.existsSync(path.join(__dirname, '/uploads'))) {
        fs.mkdirSync(path.join(__dirname, '/uploads'), { recursive: true });
    }
} catch (err) {
    console.warn('Warning: Could not create uploads directory. This is expected in most serverless environments.');
}

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const imageRoutes = require('./routes/imageRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Added uploadRoutes
const contactRoutes = require('./routes/contactRoutes');
const couponRoutes = require('./routes/couponRoutes');

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'production',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        url: req.url,
        originalUrl: req.originalUrl
    });
});

// Explicitly handle root API route
app.get('/api', (req, res) => {
    res.json({ message: 'Sweet Delights API is running', version: '1.0.0' });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
    res.json({
        message: 'Sweet Delights Debug Express Alive',
        url: req.url,
        originalUrl: req.originalUrl,
        method: req.method,
        headers: req.headers,
        node_env: process.env.NODE_ENV
    });
});



// Mount routes both with /api and without in case Vercel strips the prefix
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/coupons', couponRoutes);

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/image', imageRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/contact', contactRoutes);
app.use('/coupons', couponRoutes);

// Custom 404 for API routes to debug path issues
app.use('/api', (req, res) => {
    console.log(`404 at API: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        message: 'Endpoint not found in Sweet Delights API',
        path: req.originalUrl,
        method: req.method
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
