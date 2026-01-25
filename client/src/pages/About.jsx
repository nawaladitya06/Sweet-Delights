import React from 'react';
import { motion } from 'framer-motion';
import PageTitle from '../components/PageTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <PageTitle title="About Us" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-12 shadow-cherry-glow border border-accent/10 backdrop-blur-sm"
                >
                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-center text-accent">
                        About <span className="text-text-primary-light dark:text-text-primary-dark">Sweet Delights</span>
                    </h1>
                    <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark font-light max-w-2xl mx-auto text-center mb-8">
                        We are a virtual bakery delivering happiness to your doorstep.
                    </p>
                    <div className="space-y-6 text-lg text-text-primary-light dark:text-text-primary-dark leading-relaxed">
                        <p>
                            Welcome to <span className="font-bold text-accent">Sweet Delights</span>, where passion meets pastry.
                            Founded with a simple mission: to make the world a sweeter place, one dessert at a time.
                        </p>
                        <p>
                            Our journey began in a small kitchen with big dreams. Today, we are proud to serve our community
                            with handcrafted cakes, artisanal truffles, and a variety of gourmet treats that are as beautiful
                            as they are delicious.
                        </p>
                        <p>
                            We believe in using only the finest ingredients—rich chocolates, fresh cream, and seasonal fruits.
                            Every creation is a labor of love, designed not just to satisfy your cravings but to create
                            memorable moments.
                        </p>
                        <div className="flex justify-center mt-12">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src="/cake.png"
                                alt="Our Signature Cake"
                                className="h-48 w-48 object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default About;
