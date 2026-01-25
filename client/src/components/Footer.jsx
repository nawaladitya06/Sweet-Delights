import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-dark/70 border-t border-surface-light/80 dark:border-surface-dark/20 relative z-10 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 text-secondary-DEFAULT">
                            <img src="/cake.png" alt="Sweet Delights Logo" className="h-8 w-8" />
                            <h1 className="text-xl font-bold font-serif tracking-tight text-text-primary-light dark:text-text-primary-dark">Sweet Delights</h1>
                        </div>
                        <p className="mt-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">Gourmet desserts, handcrafted with love.</p>
                    </div>
                    <div>
                        <h4 className="font-bold tracking-wider uppercase text-accent">Explore</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/home">Home</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/customizer">Design</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/about">About Us</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/products">Our Menu</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold tracking-wider uppercase text-accent">Support</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/faq">FAQ</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/shipping">Shipping</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/privacy">Privacy Policy</Link></li>
                            <li><Link className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold tracking-wider uppercase text-accent">Follow Us</h4>
                        <div className="flex mt-4 space-x-4">
                            <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" href="https://m.facebook.com/profile.php?id=100073778216087" target="_blank" rel="noopener noreferrer">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" href="https://www.instagram.com/aditya_nawal_07/" target="_blank" rel="noopener noreferrer">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm-1.163 1.943c-1.049.048-1.688.212-2.228.42a3.024 3.024 0 00-1.12 1.12c-.208.54-.372 1.178-.42 2.228-.049 1.024-.06 1.344-.06 3.309s.011 2.285.06 3.309c.048 1.049.212 1.688.42 2.228a3.024 3.024 0 001.12 1.12c.54.208 1.178.372 2.228.42 1.024.049 1.344.06 3.309.06s2.285-.011 3.309-.06c1.049-.048 1.688-.212 2.228-.42a3.024 3.024 0 001.12-1.12c.208-.54.372-1.178.42-2.228.049-1.024.06-1.344.06-3.309s-.011-2.285-.06-3.309c-.048-1.049-.212-1.688-.42-2.228a3.024 3.024 0 00-1.12-1.12c-.54-.208-1.178-.372-2.228-.42-1.024-.049-1.344-.06-3.309-.06s-2.285.011-3.309.06zM12 8.118c-2.193 0-3.972 1.779-3.972 3.972s1.779 3.972 3.972 3.972 3.972-1.779 3.972-3.972S14.193 8.118 12 8.118zm0 6.363c-1.312 0-2.382-1.07-2.382-2.382s1.07-2.382 2.382-2.382 2.382 1.07 2.382 2.382-1.07 2.382-2.382 2.382zm4.583-6.425a.904.904 0 100-1.808.904.904 0 000 1.808z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                            <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-accent dark:hover:text-accent transition-colors" href="https://github.com/nawaladitya06" target="_blank" rel="noopener noreferrer">
                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.607 9.607 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-accent/10 dark:border-white/10 pt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark/70">
                    <p>© 2024 Sweet Delights. All rights reserved. <br></br> © Developed by Aditya Nawal</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
