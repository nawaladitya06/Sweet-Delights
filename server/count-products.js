const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Product.countDocuments();
        console.log(`Total products in database: ${count}`);
        const products = await Product.find({}, 'name price category');
        console.log('Product Names:');
        products.forEach(p => console.log(`- ${p.name} (₹${p.price}) [${p.category}]`));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkProducts();
