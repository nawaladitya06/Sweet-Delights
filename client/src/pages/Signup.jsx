import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        try {
            const userData = await signup(name, email, password, role);

            // Check actual user role from backend response
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setLocalError(err.response?.data?.message || 'Signup failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleSignIn(credentialResponse.credential);
            navigate('/home');
        } catch (err) {
            console.error("Google Signup Error:", err);
            setLocalError(err.response?.data?.message || 'Google Signup Failed');
        }
    };

    const handleGoogleError = () => {
        console.log('Google Signup Failed');
        setLocalError('Google Signup Failed');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark transition-colors duration-300">
            <Header />
            <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8 glass p-8 rounded-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <img src="/cake.png" alt="Sweet Delights Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
                    </motion.div>

                    <div className="text-center">
                        <h2 className="font-serif text-4xl font-black tracking-tight text-primary-dark dark:text-accent">Create Account</h2>
                        <p className="mt-2 text-base text-text-muted">Join Sweet Delights today</p>
                    </div>

                    {localError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-error/10 border border-error text-error text-sm rounded-lg p-3 text-center"
                        >
                            {localError}
                        </motion.div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-secondary dark:text-secondary-dark" htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 px-4 py-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary sm:text-sm transition-all outline-none"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-secondary dark:text-secondary-dark" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 px-4 py-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary sm:text-sm transition-all outline-none"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-secondary dark:text-secondary-dark" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 px-4 py-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary sm:text-sm transition-all outline-none"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button className="w-full btn-primary" type="submit">
                            Sign Up
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-transparent px-2 text-text-muted">or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="filled_black"
                                shape="pill"
                                size="large"
                                width="100%"
                            />
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-muted">
                        Already have an account?{' '}
                        <Link className="font-medium text-primary hover:text-primary-dark transition-colors" to="/login">Log In</Link>
                    </p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;
