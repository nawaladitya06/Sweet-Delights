const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    {
        name: 'Velvet Red Cupcakes',
        description: 'Rich and moist red velvet cupcakes topped with cream cheese frosting.',
        price: 18.00,
        category: 'Cupcakes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBQ5K-laTPno49k2UFen6Cx8k6hDp27O_YEuV0I4yRcyLY_MH4SXTNkLPBDh-Sw86but5b62bD5W90M55rn13QRptoKQB97mei6G3sjVcOFplchGwK_KXpgomtgjkQrZEOqNAFnX9Q3qV1dwKw-gbBKNcUX77zCdNBv6xwiBjVOcPfILChyBsYtAr-ZJmkOLRUVYy4pTq9IzFv7IIq2EecP20OL7mP1FH5RDmD8ZLtl0Ws1N69dOKwPOP9ZsGyQ-7XOYWcZJ8iWrzb',
        isBestSeller: true,
        rating: 4.8,
        numReviews: 120,
        countInStock: 50
    },
    {
        name: 'Chocolate Lava Cakes',
        description: 'Decadent chocolate cakes with a molten chocolate center.',
        price: 24.00,
        category: 'Cakes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb28A7Oq7cN_cKDs65Sr79rHPYbGZWQnM9D_xswf-i94G1sqNGXHo2w3djl0LM9pwCxcWxRi4cT1YTNx9JgLAE0mOt4o0rYyNAysLLFTcihQDEld_k2SyuZN1fjVwHE2_ip0cNrtxlwculL4YfJjFbXNjbP4961V6OR2gfDTEPxQEwPPezISHt3d5HjLBtdoQn7SZdPANB86A9DwDI32lIILZG8RqASsdoQXZSw_iVRg7uxXzmoiOPa4r_YxwZ8vQ22Gkw723gDPI8',
        isBestSeller: true,
        rating: 4.9,
        numReviews: 85,
        countInStock: 30
    },
    {
        name: 'Assorted Macarons',
        description: 'A colorful assortment of delicate French macarons.',
        price: 32.00,
        category: 'Macarons',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF4SHNgka_3E_2Fb4SiiwHMs3pWZYguHqD2AHFBApDQHhWjMJJKEGGNHAgDOQ5T2DzvhEZZY-TR5INh5NcssUo-9yxFAguqD8qUEhyXYLy4UFIB-cS8zX2pQWY5_-zQR9Qa7KZO0g5mRYQg_aQ7u2r86O950YsxXpdxCrarnjo2FSeZKArigwSeNkOmobK4mTdba2tVkM_phcC9OjULCwnEuarm5wPb5pB4F7zvvPxQw3bUXEZwHQuSgA6gE3tB8ymWFRhsoFoDb0p',
        isBestSeller: true,
        rating: 4.7,
        numReviews: 200,
        countInStock: 100
    },
    {
        name: 'Strawberry Shortcake',
        description: 'Light sponge cake layered with fresh strawberries and whipped cream.',
        price: 25.00,
        category: 'Cakes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWCHKedLeM_BGtA3X8XRO6WGEhbIXfUGHdysOqhK4jfKuTKK3R8mmWFcrpvA89UDLfFoOtrus9Bs_6nN4vUHuaH0NWMIKNZyVe_NXIivdyovxvX8Yuy0D1FmEEN1Fi2eszDefblz4hAIsj5vrawLslrXMDaxFJRjyJS7DX-L6BUKuQ9uWfTHXroycR9LiIQZtphjOb9A1YbTNsDbM1Z5FNNy04wggg8YBmSCYlgPAkpAOZu3w9satkI1YcVPGTB7hC5RcIN9u0vyZr',
        isBestSeller: false,
        rating: 4.5,
        numReviews: 45,
        countInStock: 20
    },
    {
        name: 'Lemon Meringue Pie',
        description: 'Zesty lemon filling topped with fluffy meringue.',
        price: 18.50,
        category: 'Pies',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWCHKedLeM_BGtA3X8XRO6WGEhbIXfUGHdysOqhK4jfKuTKK3R8mmWFcrpvA89UDLfFoOtrus9Bs_6nN4vUHuaH0NWMIKNZyVe_NXIivdyovxvX8Yuy0D1FmEEN1Fi2eszDefblz4hAIsj5vrawLslrXMDaxFJRjyJS7DX-L6BUKuQ9uWfTHXroycR9LiIQZtphjOb9A1YbTNsDbM1Z5FNNy04wggg8YBmSCYlgPAkpAOZu3w9satkI1YcVPGTB7hC5RcIN9u0vyZr',
        isBestSeller: false,
        rating: 4.6,
        numReviews: 60,
        countInStock: 40
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetdelights');
        console.log('MongoDB Connected');
        await importData();
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

connectDB();
