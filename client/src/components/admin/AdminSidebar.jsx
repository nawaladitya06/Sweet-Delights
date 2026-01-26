import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const AdminSidebar = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
    const { user, logout } = useContext(AuthContext); // Get user from context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'products', label: 'Products', icon: 'inventory_2' },
        { id: 'orders', label: 'Orders', icon: 'shopping_bag' },
        { id: 'reviews', label: 'Reviews', icon: 'reviews' },
        { id: 'messages', label: 'Messages', icon: 'mail' },
        { id: 'coupons', label: 'Coupons', icon: 'sell' },
        ...(user?.role === 'superadmin' ? [{ id: 'users', label: 'Users', icon: 'group' }] : []),
        { id: 'settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface-light dark:bg-surface-dark border-r border-accent/20 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="p-6 border-b border-accent/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/cake.png" alt="Sweet Delights" className="w-10 h-10 object-contain" />
                        <span className="font-serif font-bold text-xl text-primary dark:text-accent">Admin Panel</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-text-muted hover:text-accent transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentView(item.id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${currentView === item.id
                                ? 'bg-accent text-white shadow-lg'
                                : 'text-text-muted hover:bg-accent/10 hover:text-accent'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                            {currentView === item.id && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-accent/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// Add AnimatePresence import
import { AnimatePresence } from 'framer-motion';

export default AdminSidebar;
