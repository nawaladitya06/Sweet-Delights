import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status: newStatus }, config);

            setOrders(orders.map(order => order._id === id ? { ...order, status: newStatus } : order));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'Processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">Recent Orders</h2>
                <button className="btn-secondary text-sm">Export CSV</button>
            </div>

            <div className="glass rounded-xl overflow-hidden border border-accent/10">
                <div className="overflow-x-auto">
                    {orders.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                            <p>No active orders found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/5 border-b border-accent/10">
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Order ID</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Customer</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Date</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Items</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Total</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Status</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent/10">
                                {orders.map((order, index) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="p-4 font-mono text-xs text-text-primary-light dark:text-text-primary-dark">{order._id.substring(0, 8)}...</td>
                                        <td className="p-4 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{order.user?.name || 'Guest'}</td>
                                        <td className="p-4 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm text-text-muted truncate max-w-xs">{order.orderItems.length} Items</td>
                                        <td className="p-4 text-sm font-bold text-accent">${order.totalPrice}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="bg-surface-light dark:bg-surface-dark border border-accent/20 rounded-lg text-xs p-1 focus:ring-accent focus:border-accent text-text-primary-light dark:text-text-primary-dark outline-none cursor-pointer"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="Pending" className="bg-surface-light dark:bg-surface-dark">Pending</option>
                                                <option value="Processing" className="bg-surface-light dark:bg-surface-dark">Processing</option>
                                                <option value="Delivered" className="bg-surface-light dark:bg-surface-dark">Delivered</option>
                                                <option value="Cancelled" className="bg-surface-light dark:bg-surface-dark">Cancelled</option>
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
