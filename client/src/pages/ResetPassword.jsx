import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import axios from 'axios';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { resettoken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.put(`${API_URL}/api/auth/resetpassword/${resettoken}`, { password });
            toast.success('Password reset successfully');
            // Optionally auto-login? The API returns a token.
            if (data.token) {
                localStorage.setItem('token', data.token);
                // We might need to refresh auth context, but simpler to redirect to login or handle it.
                // Let's redirect to login for clarity.
                navigate('/login');
            } else {
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans transition-colors duration-300">
            <PageTitle title="Reset Password" />
            <Header />
            <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-12">
                <div className="max-w-md w-full bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-lg border border-accent/10">
                    <h2 className="text-3xl font-display font-bold text-center text-accent mb-6">Reset Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-1">New Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">lock</span>
                                <input
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-text-muted mb-1">Confirm New Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">lock_clock</span>
                                <input
                                    type="password"
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Reseting...' : 'Set New Password'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResetPassword;
