const mongoose = require('mongoose');
const { generateReport } = require('./utils/reportGenerator');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const testReport = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetdelights');
        console.log('Connected.');

        console.log('Generating sample monthly report...');
        const now = new Date();
        const result = await generateReport('monthly', now.getMonth(), now.getFullYear());
        console.log('Success:', result);

        console.log('Generating sample annual report...');
        const annualResult = await generateReport('annual', 11, now.getFullYear());
        console.log('Success:', annualResult);

        await mongoose.connection.close();
        console.log('Done.');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
};

testReport();
