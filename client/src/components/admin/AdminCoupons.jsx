import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountAmount: '',
        minOrderAmount: '',
        expiryDate: '',
        usageLimit: ''
    });

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/coupons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load coupons");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/coupons`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Coupon created successfully');
            setIsModalOpen(false);
            setFormData({ code: '', discountType: 'percentage', discountAmount: '', minOrderAmount: '', expiryDate: '', usageLimit: '' });
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create coupon");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/coupons/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading coupons...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">Coupon Management</h2>
                    <div className="text-sm text-text-muted">Active Codes: {coupons.filter(c => c.isActive).length}</div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Create Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map(coupon => (
                    <motion.div
                        key={coupon._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-2xl border border-accent/10 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">sell</span>
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xl font-black text-accent tracking-widest">{coupon.code}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${new Date(coupon.expiryDate) > new Date() ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                {new Date(coupon.expiryDate) > new Date() ? 'ACTIVE' : 'EXPIRED'}
                            </span>
                        </div>
                        <div className="space-y-2 mb-6">
                            <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `₹${coupon.discountAmount} OFF`}
                            </p>
                            <p className="text-xs text-text-muted">Min Order: ₹{coupon.minOrderAmount}</p>
                            <p className="text-xs text-text-muted">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                            <div className="pt-2">
                                <div className="flex justify-between text-[10px] font-bold text-text-muted mb-1">
                                    <span>USAGE</span>
                                    <span>{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                                </div>
                                <div className="h-1.5 bg-accent/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent"
                                        style={{ width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '5%' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(coupon._id)}
                            className="text-error/50 hover:text-error transition-colors flex items-center gap-1 text-xs font-bold"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Remove
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-background-dark w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-accent/20"
                        >
                            <div className="p-6 border-b border-accent/10 bg-accent/5 flex justify-between items-center">
                                <h3 className="text-xl font-serif font-bold text-accent">New Promo Code</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-error"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase">Code</label>
                                    <input required type="text" className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2 uppercase" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="E.G. SWEET10" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase">Type</label>
                                        <select className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase">Amount</label>
                                        <input required type="number" className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2" value={formData.discountAmount} onChange={e => setFormData({ ...formData, discountAmount: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase">Min Order</label>
                                        <input type="number" className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2" value={formData.minOrderAmount} onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase">Usage Limit</label>
                                        <input type="number" className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} placeholder="Unlimited" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase">Expiry Date</label>
                                    <input required type="date" className="w-full bg-accent/5 border border-accent/10 rounded-lg p-2" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full btn-primary py-3">Create Coupon</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCoupons;
