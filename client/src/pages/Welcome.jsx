import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';

const Welcome = () => {
    const navigate = useNavigate();
    const { guestLogin } = useContext(AuthContext);

    const handleRoleSelect = (role) => {
        if (role === 'guest') {
            guestLogin();
            navigate('/home');
        } else {
            navigate(`/login?role=${role}`);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">

            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <img src="/cake.png" alt="Logo" className="w-24 h-24 mx-auto mb-6 drop-shadow-xl" />
                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-primary-dark dark:text-accent">
                        Sweet Delights
                    </h1>
                    <p className="text-xl md:text-2xl text-text-muted font-light">
                        Gourmet desserts, handcrafted with love.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {/* Super Admin Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => handleRoleSelect('superadmin')}
                        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-accent/10 hover:border-accent hover:shadow-cherry-glow cursor-pointer group transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl text-yellow-600 group-hover:text-white">verified_user</span>
                        </div>
                        <h3 className="text-xl font-bold font-display mb-2">Super Admin</h3>
                        <p className="text-sm text-text-muted">Full system control and user management.</p>
                    </motion.div>

                    {/* Admin Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => handleRoleSelect('admin')}
                        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-accent/10 hover:border-accent hover:shadow-cherry-glow cursor-pointer group transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white">admin_panel_settings</span>
                        </div>
                        <h3 className="text-xl font-bold font-display mb-2">Admin</h3>
                        <p className="text-sm text-text-muted">Manage products and orders.</p>
                    </motion.div>

                    {/* User Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => handleRoleSelect('user')}
                        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-accent/10 hover:border-accent hover:shadow-cherry-glow cursor-pointer group transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-3xl text-accent group-hover:text-white">person</span>
                        </div>
                        <h3 className="text-xl font-bold font-display mb-2">Customer</h3>
                        <p className="text-sm text-text-muted">Order cakes and customize your treats.</p>
                    </motion.div>

                    {/* Guest Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        onClick={() => handleRoleSelect('guest')}
                        className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-lg border border-accent/10 hover:border-accent hover:shadow-cherry-glow cursor-pointer group transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-primary-dark transition-colors">
                            <span className="material-symbols-outlined text-3xl text-secondary group-hover:text-primary-dark">storefront</span>
                        </div>
                        <h3 className="text-xl font-bold font-display mb-2">Guest</h3>
                        <p className="text-sm text-text-muted">Browse our menu without signing in.</p>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-sm text-text-muted"
                >
                    Select an option to proceed
                </motion.p>
            </div>
        </div>
    );
};

export default Welcome;
