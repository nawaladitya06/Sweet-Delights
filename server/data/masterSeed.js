const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
    // --- CAKES ---
    {
        name: "Classic Strawberry Shortcake",
        description: "Light vanilla sponge with fresh cream and strawberries.",
        price: 1200, category: "Cakes", countInStock: 10, rating: 4.8, isBestSeller: true,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000"
    },
    {
        name: "Triple Chocolate Ganache",
        description: "Rich dark chocolate cake with smooth chocolate ganache frosting.",
        price: 1500, category: "Cakes", countInStock: 5, rating: 4.9, isBestSeller: true,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000"
    },
    {
        name: "Red Velvet Royale",
        description: "Classic red velvet with silky cream cheese frosting.",
        price: 1400, category: "Cakes", countInStock: 8, rating: 4.7,
        image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=1000"
    },
    {
        name: "Lemon Zest Dream",
        description: "Zesty lemon layer cake with lemon curd filling.",
        price: 1100, category: "Cakes", countInStock: 12, rating: 4.5,
        image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=1000"
    },
    {
        name: "Carrot Walnut Cake",
        description: "Spiced carrot cake with toasted walnuts and cream cheese.",
        price: 1300, category: "Cakes", countInStock: 7, rating: 4.6,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000"
    },
    {
        name: "Black Forest Classic",
        description: "German-style cake with cherries, whipped cream, and chocolate.",
        price: 1600, category: "Cakes", countInStock: 6, rating: 4.8,
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000"
    },
    {
        name: "Espresso Mocha Cake",
        description: "Coffee-infused layers with rich mocha buttercream.",
        price: 1450, category: "Cakes", countInStock: 9, rating: 4.7,
        image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=1000"
    },
    {
        name: "Blueberry Lemon Bliss",
        description: "Refreshing lemon cake with fresh blueberries inside.",
        price: 1250, category: "Cakes", countInStock: 15, rating: 4.6,
        image: "https://images.unsplash.com/photo-1621236378699-8597fac6bb4d?q=80&w=1000"
    },
    {
        name: "Mango Paradise Cake",
        description: "Tropical mango mousse cake with seasonal mango slices.",
        price: 1350, category: "Cakes", countInStock: 10, rating: 4.7,
        image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=1000"
    },
    {
        name: "Salted Caramel Cheesecake",
        description: "Creamy cheesecake with a thick salted caramel swirl.",
        price: 1800, category: "Cakes", countInStock: 4, rating: 4.9, isBestSeller: true,
        image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?q=80&w=1000"
    },

    // --- CUPCAKES ---
    {
        name: "Velvet Swirl Cupcakes",
        description: "Mini red velvet delights with cream cheese frosting.",
        price: 120, category: "Cupcakes", countInStock: 50, rating: 4.8,
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000"
    },
    {
        name: "Vanilla Bean Cupcake",
        description: "Classic vanilla cupcake with Madagascar bean frosting.",
        price: 100, category: "Cupcakes", countInStock: 60, rating: 4.5,
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1000"
    },
    {
        name: "Double Chocolate Cupcake",
        description: "Chocolate sponge with rich chocolate fudge topping.",
        price: 130, category: "Cupcakes", countInStock: 40, rating: 4.7,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000"
    },
    {
        name: "Confetti Celebration Cupcake",
        description: "Funfetti sponge with colorful sprinkles and vanilla cream.",
        price: 110, category: "Cupcakes", countInStock: 100, rating: 4.6,
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000"
    },
    {
        name: "Lemon Curd Cupcake",
        description: "Lemon cupcake filled with zesty home-made lemon curd.",
        price: 140, category: "Cupcakes", countInStock: 30, rating: 4.7,
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1000"
    },
    {
        name: "Mint Choco-Chip Cupcake",
        description: "Refreshing mint frosting with dark chocolate chips.",
        price: 135, category: "Cupcakes", countInStock: 35, rating: 4.6,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000"
    },
    {
        name: "Peanut Butter Blast",
        description: "Chocolate cupcake with a creamy peanut butter heart.",
        price: 150, category: "Cupcakes", countInStock: 25, rating: 4.8,
        image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?q=80&w=1000"
    },
    {
        name: "Oreo Crumble Cupcake",
        description: "Cookies and cream frosting with Oreo cookie chunks.",
        price: 145, category: "Cupcakes", countInStock: 45, rating: 4.7,
        image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=1000"
    },

    // --- COOKIES ---
    {
        name: "Chunky Choco-Chip Cookie",
        description: "Large, chewy cookie loaded with Belgian chocolate chunks.",
        price: 80, category: "Cookies", countInStock: 200, rating: 4.9, isBestSeller: true,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000"
    },
    {
        name: "Oatmeal Raisin Classic",
        description: "Soft and spiced oatmeal cookie with sweet raisins.",
        price: 70, category: "Cookies", countInStock: 150, rating: 4.4,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000"
    },
    {
        name: "Double Chocolate Brownie Cookie",
        description: "Fudgy brownie-like cookie for chocolate lovers.",
        price: 90, category: "Cookies", countInStock: 120, rating: 4.8,
        image: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?q=80&w=1000"
    },
    {
        name: "White Choco Macadamia",
        description: "Buttery cookie with white chocolate and macadamia nuts.",
        price: 110, category: "Cookies", countInStock: 80, rating: 4.7,
        image: "https://images.unsplash.com/photo-1590080875515-8aeb27952862?q=80&w=1000"
    },
    {
        name: "Peanut Butter Perfection",
        description: "Thick peanut butter cookie with a criss-cross pattern.",
        price: 85, category: "Cookies", countInStock: 140, rating: 4.6,
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1000"
    },

    // --- MACARONS ---
    {
        name: "Lavender Honey Macaron",
        description: "Delicate lavender shell with sweet honey ganache.",
        price: 150, category: "Macarons", countInStock: 100, rating: 4.8,
        image: "https://images.unsplash.com/photo-1569864358642-9d16197022c3?q=80&w=1000"
    },
    {
        name: "Classic Pistachio Macaron",
        description: "Green macaron shell with authentic pistachio filling.",
        price: 160, category: "Macarons", countInStock: 80, rating: 4.7,
        image: "https://images.unsplash.com/photo-1558326237-8a37db8f3446?q=80&w=1000"
    },
    {
        name: "Rose Petal Macaron",
        description: "Elegant rosewater-infused macaron with a raspberry center.",
        price: 155, category: "Macarons", countInStock: 90, rating: 4.8,
        image: "https://images.unsplash.com/photo-1569864358642-9d16197022c3?q=80&w=1000"
    },
    {
        name: "Salted Caramel Macaron",
        description: "Buttery macaron shell with salted caramel cream.",
        price: 150, category: "Macarons", countInStock: 110, rating: 4.9, isBestSeller: true,
        image: "https://images.unsplash.com/photo-1558326237-8a37db8f3446?q=80&w=1000"
    },

    // --- PIES ---
    {
        name: "Classic Apple Pie",
        description: "Warm flaky crust with spiced cinnamon apples.",
        price: 800, category: "Pies", countInStock: 5, rating: 4.7,
        image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=1000"
    },
    {
        name: "Blueberry Lattice Pie",
        description: "Hand-woven lattice crust with bursting blueberries.",
        price: 900, category: "Pies", countInStock: 7, rating: 4.6,
        image: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?q=80&w=1000"
    },
    {
        name: "Pumpkin Spice Pie",
        description: "Seasonal favorite with smooth pumpkin and ginger.",
        price: 750, category: "Pies", countInStock: 10, rating: 4.5,
        image: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?q=80&w=1000"
    },

    // --- OTHERS & CUSTOM ---
    {
        name: "Chocolate Dipped Donuts",
        description: "Classic glazed donuts dipped in dark chocolate.",
        price: 90, category: "Other", countInStock: 40, rating: 4.4,
        image: "https://images.unsplash.com/photo-1527515545081-5db817172677?q=80&w=1000"
    },
    {
        name: "Assorted Pastry Box",
        description: "A mixed selection of our finest daily pastries.",
        price: 600, category: "Other", countInStock: 20, rating: 4.8,
        image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Master Seeding');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`Database Cleared & Seeded with ${products.length} Products!`);
        process.exit();
    } catch (error) {
        console.error('Master Seed Error:', error);
        process.exit(1);
    }
};

seedDB();
