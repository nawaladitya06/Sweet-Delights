import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOrders from '../components/admin/AdminOrders';
import AdminReviews from '../components/admin/AdminReviews';
import AdminMessages from '../components/admin/AdminMessages';
import AdminCoupons from '../components/admin/AdminCoupons';
import AdminUsers from '../components/admin/AdminUsers';
import AdminProducts from '../components/admin/AdminProducts';
import AdminSettings from '../components/admin/AdminSettings';
import PageTitle from '../components/PageTitle';
import { useTheme } from '../context/ThemeContext'; // Import Theme Hook
import { DashboardStatsSkeleton } from '../components/Skeleton';
import SalesChart from '../components/admin/SalesChart';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, lowStockProducts: [] });
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme(); // Use Theme Context

    React.useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        setIsStatsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setIsStatsLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                if (isStatsLoading) return <DashboardStatsSkeleton />;
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Total Orders</h3>
                                        <p className="text-4xl font-serif text-accent mt-2">{stats.totalOrders}</p>
                                    </div>
                                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">shopping_cart</span>
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Total Revenue</h3>
                                        <p className="text-4xl font-serif text-accent mt-2">₹{stats.totalRevenue}</p>
                                    </div>
                                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                </div>
                            </div>
                            <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Total Users</h3>
                                        <p className="text-4xl font-serif text-accent mt-2">{stats.totalUsers}</p>
                                    </div>
                                    <div className="p-3 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">group</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Low Stock Alerts */}
                        {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
                            <div className="mt-8 glass border border-error/20 rounded-2xl p-6 bg-error/5">
                                <div className="flex items-center gap-2 mb-4 text-error">
                                    <span className="material-symbols-outlined">warning</span>
                                    <h3 className="font-bold uppercase tracking-wider text-sm">Low Stock Alerts</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.lowStockProducts.map(product => (
                                        <div key={product._id} className="bg-white/50 dark:bg-black/20 p-4 rounded-xl flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-xs truncate max-w-[120px]">{product.name}</p>
                                                <p className="text-[10px] text-text-muted">Stock: <span className="text-error font-black">{product.countInStock}</span></p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('products')}
                                                className="text-[10px] font-bold text-accent hover:underline"
                                            >
                                                Restock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sales Chart */}
                        <SalesChart data={stats.salesHistory} />
                    </>
                );
            case 'orders':
                return <AdminOrders />;
            case 'users':
                return <AdminUsers />;
            case 'settings':
                return <AdminSettings />;
            case 'products':
                return <AdminProducts />;
            case 'reviews':
                return <AdminReviews />;
            case 'messages':
                return <AdminMessages />;
            case 'coupons':
                return <AdminCoupons />;
            case 'settings':
                return <div className="p-8 glass rounded-2xl">Settings Module (Under Construction)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-sans transition-colors duration-300">
            <PageTitle title="Admin Dashboard" />

            {/* Sidebar */}
            <AdminSidebar
                currentView={activeTab}
                setCurrentView={setActiveTab}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
                {/* Top Bar */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors md:hidden"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-black text-primary dark:text-accent capitalize">
                                {activeTab}
                            </h1>
                            <p className="hidden md:block text-text-muted mt-1">Manage your bakery operations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark">
                                {theme === 'light' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </button>

                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <span className="material-symbols-outlined">notifications</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
