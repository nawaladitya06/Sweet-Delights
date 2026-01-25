import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/forgotpassword`, { email });
            setSuccess(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans transition-colors duration-300">
            <PageTitle title="Forgot Password" />
            <Header />
            <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-12">
                <div className="max-w-md w-full bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-lg border border-accent/10">
                    <h2 className="text-3xl font-display font-bold text-center text-accent mb-6">Forgot Password</h2>
                    {success ? (
                        <div className="text-center space-y-4">
                            <span className="material-symbols-outlined text-6xl text-success">mark_email_read</span>
                            <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Check your email</p>
                            <p className="text-text-muted">We have sent a password reset link to {email}</p>
                            <p className="text-sm text-text-muted">(Check console for the link in this demo)</p>
                            <Link to="/login" className="btn-primary w-full block text-center py-2 mt-4">Back to Login</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-text-muted text-center mb-4">Enter your email address to receive a password reset link.</p>
                            <div>
                                <label className="block text-sm font-bold text-text-muted mb-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">email</span>
                                    <input
                                        type="email"
                                        className="input-field pl-10"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                                {!loading && <span className="material-symbols-outlined">send</span>}
                            </button>
                            <div className="text-center mt-4">
                                <Link to="/login" className="text-accent hover:underline font-bold text-sm">Remember password? Login</Link>
                            </div>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
