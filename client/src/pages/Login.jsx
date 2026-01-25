import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Logging in...');
        try {
            const userData = await login(email, password);

            // If user is trying to login as admin/superadmin but account is unauthorized
            const targetRole = role || 'user';

            // Check if attempting to access admin/superadmin with insufficient privileges
            if ((targetRole === 'admin' || targetRole === 'superadmin') &&
                userData.role !== 'admin' && userData.role !== 'superadmin') {
                toast.error("Access Denied: You are not authorized.", { id: toastId });
                navigate('/');
                return;
            }

            // Normal routing based on user role
            if (userData.role === 'admin' || userData.role === 'superadmin') {
                toast.success(`Welcome back, ${userData.role === 'superadmin' ? 'Super Admin' : 'Admin'} ${userData.name}!`, { id: toastId });
                navigate('/admin');
            } else {
                toast.success(`Welcome back, ${userData.name}!`, { id: toastId });
                navigate('/home');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed', { id: toastId });
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const toastId = toast.loading('Verifying Google Sign-In...');
        try {
            const userData = await googleSignIn(credentialResponse.credential);

            // If user is trying to login as admin but account is not admin
            if (role === 'admin' && userData.role !== 'admin' && userData.role !== 'superadmin') {
                toast.error("Access Denied: You are not an admin.", { id: toastId });
                navigate('/');
                return;
            }

            if (userData.role === 'admin' || userData.role === 'superadmin') {
                toast.success(`Welcome back, ${userData.role === 'superadmin' ? 'Super Admin' : 'Admin'} ${userData.name}!`, { id: toastId });
                navigate('/admin');
            } else {
                toast.success(`Welcome back, ${userData.name}!`, { id: toastId });
                navigate('/home');
            }
        } catch (err) {
            console.error("Google login error:", err);
            toast.error(err.response?.data?.message || err.message || 'Google Login Failed', { id: toastId });
        }
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
        toast.error('Google Login connection failed.');
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
                        <h2 className="font-serif text-4xl font-black tracking-tight text-primary-dark dark:text-accent">
                            {role === 'admin' ? 'Admin Login' : role === 'superadmin' ? 'Super Admin Login' : 'Welcome Back'}
                        </h2>
                        <p className="mt-2 text-base text-text-muted">
                            {role === 'admin' ? 'Access your dashboard' : role === 'superadmin' ? 'System Control Access' : 'Log in to your Sweet Delights account'}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 px-4 py-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary sm:text-sm transition-all outline-none"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <Link className="font-medium text-primary hover:text-primary-dark transition-colors" to="/forgotpassword">Forgot Password?</Link>
                            </div>
                        </div>

                        <button className="w-full btn-primary" type="submit">
                            Log In
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
                        Don't have an account?{' '}
                        <Link className="font-medium text-primary hover:text-primary-dark transition-colors" to={role === 'admin' ? "/signup?role=admin" : "/signup"}>
                            {role === 'admin' ? 'Create Admin Account' : 'Sign Up'}
                        </Link>
                    </p>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
