import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="w-48 h-48 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                        <span className="material-symbols-outlined text-[100px] text-accent">bakery_dining</span>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg animate-bounce">
                        404
                    </div>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif font-black text-accent mb-4">Oops! This cake is missing.</h1>
                <p className="text-lg text-text-muted max-w-md mx-auto mb-10">
                    We couldn't find the page you were looking for. It might have been moved or eaten by our hungry bakers!
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/home"
                        className="btn-primary py-4 px-10 rounded-full font-bold shadow-lg hover:shadow-accent/40 bg-accent text-white flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Back to Bakery
                    </Link>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
