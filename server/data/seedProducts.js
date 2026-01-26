const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config(); // Use default .env in current directory (server/)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sweetdelights')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.log(err));

const products = [
    {
        name: "Strawberry Shortcake",
        description: "Classic vanilla sponge layered with fresh strawberries and whipped cream.",
        price: 1400,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000",
        countInStock: 8,
        rating: 4.8,
        isBestSeller: true
    },
    {
        name: "Blueberry Bliss Cupcake Pack",
        description: "Soft vanilla cupcakes filled with blueberry compote and topped with lavender frosting. Pack of 6.",
        price: 850,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000",
        countInStock: 25,
        rating: 4.7,
        isBestSeller: false
    },
    {
        name: "Red Velvet Royale",
        description: "Decadent red velvet layers with cream cheese frosting and red crumb finish.",
        price: 1600,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=1000",
        countInStock: 5,
        rating: 4.9,
        isBestSeller: true
    },
    {
        name: "Triple Chocolate Truffle",
        description: "A decadent explosion of dark, milk, and white chocolate layers, finished with a glossy ganache.",
        price: 1800,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000",
        countInStock: 10,
        rating: 4.9,
        isBestSeller: true
    },
    {
        name: "Salted Caramel Cheesecake",
        description: "Rich and creamy New York style cheesecake topped with house-made salted caramel sauce.",
        price: 2000,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?q=80&w=1000",
        countInStock: 12,
        rating: 4.9,
        isBestSeller: true
    },
    {
        name: "Lemon Drizzle Delight",
        description: "Zesty lemon cake with a sugary crunch topping and lemon curd filling.",
        price: 1300,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?q=80&w=1000",
        countInStock: 15,
        rating: 4.6,
        isBestSeller: false
    },
    {
        name: "Vanilla Bean Dream",
        description: "Pure madagascar vanilla bean cake with swiss meringue buttercream.",
        price: 1200,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1000",
        countInStock: 20,
        rating: 4.5,
        isBestSeller: false
    },
    {
        name: "Chocolate Fudge Cupcakes",
        description: "Moist chocolate cupcakes with rich fudge frosting. Pack of 6.",
        price: 750,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000",
        countInStock: 30,
        rating: 4.8,
        isBestSeller: false
    },
    {
        name: "Black Forest Classic",
        description: "Layers of chocolate sponge moistened with kirsch syrup, filled with whipped cream and cherries.",
        price: 1550,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000",
        countInStock: 8,
        rating: 4.8,
        isBestSeller: true
    },
    {
        name: "Mango Mousse Madness",
        description: "Light and airy mango mousse nestled between layers of vanilla sponge, topped with fresh mango glaze.",
        price: 1450,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=1000",
        countInStock: 12,
        rating: 4.7,
        isBestSeller: false
    },
    {
        name: "Confetti Celebration Cupcakes",
        description: "Fun vanilla cupcakes with rainbow sprinkles baked in, topped with vanilla buttercream.",
        price: 800,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000",
        countInStock: 30,
        rating: 4.6,
        isBestSeller: false
    },
    {
        name: "Salted Caramel Swirl Cupcakes",
        description: "Moist caramel cupcakes with a salted caramel center and caramel buttercream.",
        price: 900,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=1000",
        countInStock: 20,
        rating: 4.8,
        isBestSeller: true
    },
    {
        name: "Espresso Coffee Cake",
        description: "Rich coffee infused sponge with walnut layers and espresso buttercream frosting.",
        price: 1350,
        category: "Cakes",
        image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=1000",
        countInStock: 10,
        rating: 4.5,
        isBestSeller: false
    },
    {
        name: "Mint Chocolate Cupcake",
        description: "Dark chocolate cupcake topped with refreshing mint green buttercream and chocolate chips.",
        price: 850,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=1000",
        countInStock: 25,
        rating: 4.7,
        isBestSeller: false
    },
    {
        name: "Velvet Swirl Cupcake",
        description: "Classic red velvet cupcake with a tall swirl of cream cheese frosting.",
        price: 900,
        category: "Cupcakes",
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000",
        countInStock: 15,
        rating: 4.9,
        isBestSeller: true
    }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({}); // Clear existing products
        await Product.insertMany(products);
        console.log('Database Cleared & Seeded with Cakes/Cupcakes!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();
