const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetdelights');
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: 'admin@sweetdelights.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create({
            name: 'Admin User',
            email: 'admin@sweetdelights.com',
            password: 'password123',
            role: 'admin'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@sweetdelights.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
