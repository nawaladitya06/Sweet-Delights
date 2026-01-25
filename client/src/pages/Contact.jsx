import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';

const Contact = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        inquiryType: 'General Inquiry',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Sending message...');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            };

            await axios.post(`${API_URL}/api/contact`, formData, config);
            toast.success("Message sent! We'll get back to you shortly.", { id: toastId, icon: '💌' });
            setFormData({ name: '', email: '', inquiryType: 'General Inquiry', message: '' });

            if (user) {
                navigate('/home');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.", { id: toastId });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
            <Header />

            {/* Hero Section */}
            <div className="relative pt-20 pb-12 overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <PageTitle title="Contact Us" />
                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-accent">
                        Get In <span className="text-text-primary-light dark:text-text-primary-dark">Touch</span>
                    </h1>
                    <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark font-light max-w-2xl mx-auto">
                        We are a virtual bakery delivering happiness to your doorstep.
                    </p>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-24">

                {/* 3 Contact Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl text-center group hover:-translate-y-2 transition duration-300 border border-accent/10 shadow-lg"
                    >
                        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-accent/20 group-hover:border-accent transition">
                            <span className="material-symbols-outlined text-3xl text-accent">call</span>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1">Call Us</h3>
                        <p className="text-text-muted text-sm mb-4">Available 9am - 2am</p>
                        <a href="tel:+918591336819" className="inline-flex items-center gap-2 text-accent font-bold hover:underline">
                            +91 85913 36819
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl text-center group hover:-translate-y-2 transition duration-300 border border-accent/10 shadow-lg"
                    >
                        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-accent/20 group-hover:border-accent transition">
                            <span className="material-symbols-outlined text-3xl text-accent">mail</span>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1">Email Us</h3>
                        <p className="text-text-muted text-sm mb-4">We'll respond within 24 hours</p>
                        <a href="mailto:nawaladitya06@gmail.com" className="inline-flex items-center gap-2 text-accent font-bold hover:underline break-all">
                            nawaladitya06@gmail.com
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl text-center group hover:-translate-y-2 transition duration-300 border border-accent/10 shadow-lg"
                    >
                        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 border border-accent/20 group-hover:border-accent transition">
                            <span className="material-symbols-outlined text-3xl text-accent">local_shipping</span>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1">We Deliver</h3>
                        <p className="text-text-muted text-sm mb-4">Across Mumbai & Suburbs</p>
                        <p className="text-accent font-bold">Cloud Kitchen</p>
                    </motion.div>
                </div>

                {/* Split Section: Info & Form */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Col: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl relative overflow-hidden group border border-accent/10 shadow-lg h-full flex flex-col justify-center">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition duration-500"></div>

                            <h3 className="font-display text-2xl font-bold mb-8 border-l-4 border-accent pl-4">About Our Kitchen</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl flex-shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined">cloud</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">Virtual Presence</h4>
                                        <p className="text-text-muted leading-relaxed">
                                            We operate exclusively as a cloud kitchen. This allows us to focus 100% on the quality of our ingredients and baking process. No storefront, just pure taste delivered to you.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl flex-shrink-0 shadow-sm">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-2">Late Night Cravings?</h4>
                                        <p className="text-text-muted">
                                            We are open for deliveries from:
                                        </p>
                                        <p className="text-accent font-bold text-lg mt-1">9:00 AM - 2:00 AM</p>
                                        <p className="text-text-muted text-sm mt-1">Every single day.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-3xl flex-shrink-0 shadow-sm">
                                    <span className="material-symbols-outlined">share</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-3">Connect With Us</h4>
                                    <p className="text-text-muted text-lg mb-4">
                                        Follow our baking journey:
                                    </p>
                                    <div className="flex gap-4">
                                        <a
                                            href="https://www.instagram.com/aditya_nawal_07/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-surface-dark dark:bg-background-light text-white dark:text-surface-dark flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md group/icon"
                                        >
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://m.facebook.com/profile.php?id=100073778216087"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-surface-dark dark:bg-background-light text-white dark:text-surface-dark flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md group/icon"
                                        >
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://github.com/nawaladitya06"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-surface-dark dark:bg-background-light text-white dark:text-surface-dark flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md group/icon"
                                        >
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Col: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-2xl relative shadow-lg border border-accent/10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Your Name</label>
                                    <input
                                        type="text" name="name" placeholder="John Doe" required
                                        value={formData.name} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Inquiry Type</label>
                                    <select
                                        name="inquiryType"
                                        value={formData.inquiryType} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Custom Order">Custom Cake Order</option>
                                        <option value="Corporate Order">Corporate Order</option>
                                        <option value="Feedback">Feedback</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    type="email" name="email" placeholder="you@example.com" required
                                    value={formData.email} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Message</label>
                                <textarea
                                    name="message" rows="5" placeholder="How can we sweeten your day?" required
                                    value={formData.message} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-4 bg-accent text-white font-display font-bold text-lg rounded-xl hover:bg-accent-hover shadow-lg transition-all duration-300"
                            >
                                SEND MESSAGE
                            </motion.button>
                        </form>
                    </motion.div>

                </div>
            </main >
            <Footer />
        </div >
    );
};

export default Contact;
