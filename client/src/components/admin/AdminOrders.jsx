import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';
import AuthContext from '../../context/AuthContext';

const AdminOrders = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Order Creation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedItems, setSelectedItems] = useState([]); // { product: id, name, price, qty, image }
    const [shippingAddress, setShippingAddress] = useState({
        address: '', city: '', postalCode: '', country: 'India'
    });
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const fetchUsersAndProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [usersRes, productsRes] = await Promise.all([
                axios.get(`${API_URL}/api/users`, config),
                axios.get(`${API_URL}/api/products`)
            ]);
            setUsers(usersRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            toast.error("Failed to load users or products");
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

    const handleAddItem = (productId) => {
        const product = products.find(p => p._id === productId);
        if (!product) return;

        const existingItem = selectedItems.find(item => item.product === productId);
        if (existingItem) {
            setSelectedItems(selectedItems.map(item => 
                item.product === productId ? { ...item, qty: item.qty + 1 } : item
            ));
        } else {
            setSelectedItems([...selectedItems, {
                product: product._id,
                name: product.name,
                price: product.price,
                qty: 1,
                image: product.image
            }]);
        }
    };

    const handleRemoveItem = (productId) => {
        setSelectedItems(selectedItems.filter(item => item.product !== productId));
    };

    const handleUpdateQty = (productId, qty) => {
        if (qty < 1) return;
        setSelectedItems(selectedItems.map(item => 
            item.product === productId ? { ...item, qty: parseInt(qty) } : item
        ));
    };

    const createOrderHandler = async (e) => {
        e.preventDefault();
        if (!selectedUser) return toast.error("Please select a customer");
        if (selectedItems.length === 0) return toast.error("Please add at least one item");

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const itemsPrice = selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            const shippingPrice = itemsPrice > 500 ? 0 : 50;
            const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            const orderData = {
                user: selectedUser,
                orderItems: selectedItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                isPaid: true,
                status: 'Processing'
            };

            await axios.post(`${API_URL}/api/orders`, orderData, config);
            toast.success("Order created successfully");
            setIsModalOpen(false);
            fetchOrders();
            // Reset form
            setSelectedUser('');
            setSelectedItems([]);
            setShippingAddress({ address: '', city: '', postalCode: '', country: 'India' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create order");
        } finally {
            setIsSubmitting(false);
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
                <div className="flex gap-4">
                    {currentUser?.role === 'superadmin' && (
                        <button 
                            onClick={() => { setIsModalOpen(true); fetchUsersAndProducts(); }}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                            Add Order
                        </button>
                    )}
                    <button className="btn-secondary text-sm">Export CSV</button>
                </div>
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
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Order ID</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Customer</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Date</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Items</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Total</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Status</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Actions</th>
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
                                        <td className="p-4 text-sm font-bold text-accent">₹{order.totalPrice}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                className="bg-surface-light dark:bg-surface-dark border border-accent/20 rounded-lg text-[10px] p-1 focus:ring-accent focus:border-accent text-text-primary-light dark:text-text-primary-dark outline-none cursor-pointer font-bold"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Order Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-background-dark w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-accent/20 max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-accent/10 flex justify-between items-center bg-accent/5">
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-primary dark:text-accent">Create Manual Order</h3>
                                    <p className="text-xs text-text-muted">Place an order on behalf of a customer</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-error/10 text-text-muted hover:text-error transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={createOrderHandler} className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Customer & Items */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">1. Select Customer</label>
                                            <select 
                                                className="w-full px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none text-sm"
                                                value={selectedUser}
                                                onChange={(e) => setSelectedUser(e.target.value)}
                                                required
                                            >
                                                <option value="">Choose a customer...</option>
                                                {users.map(u => (
                                                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">2. Add Products</label>
                                            <div className="flex gap-2 mb-4">
                                                <select 
                                                    className="flex-1 px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none text-sm"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            handleAddItem(e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                >
                                                    <option value="">Search products...</option>
                                                    {products.map(p => (
                                                        <option key={p._id} value={p._id}>{p.name} - ₹{p.price}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                                {selectedItems.length === 0 ? (
                                                    <div className="text-center py-8 bg-accent/5 rounded-2xl border border-dashed border-accent/20 text-text-muted text-xs">
                                                        No items added yet
                                                    </div>
                                                ) : (
                                                    selectedItems.map(item => (
                                                        <div key={item.product} className="flex items-center gap-3 p-3 bg-accent/5 rounded-xl border border-accent/10">
                                                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                            <div className="flex-1">
                                                                <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                                                                <p className="text-[10px] text-accent font-bold">₹{item.price}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <input 
                                                                    type="number" 
                                                                    min="1"
                                                                    className="w-12 text-center bg-white dark:bg-black/20 rounded-lg border border-accent/10 p-1 text-xs"
                                                                    value={item.qty}
                                                                    onChange={(e) => handleUpdateQty(item.product, e.target.value)}
                                                                />
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => handleRemoveItem(item.product)}
                                                                    className="text-error hover:bg-error/10 p-1 rounded"
                                                                >
                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Shipping & Summary */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">3. Shipping Details</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                <input 
                                                    placeholder="Street Address"
                                                    className="w-full px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none text-sm"
                                                    value={shippingAddress.address}
                                                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                                    required
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input 
                                                        placeholder="City"
                                                        className="w-full px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none text-sm"
                                                        value={shippingAddress.city}
                                                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                                        required
                                                    />
                                                    <input 
                                                        placeholder="Postal Code"
                                                        className="w-full px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none text-sm"
                                                        value={shippingAddress.postalCode}
                                                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-2xl border border-accent/10 space-y-3">
                                            <h4 className="text-xs font-bold text-text-muted uppercase">Order Summary</h4>
                                            <div className="flex justify-between text-xs">
                                                <span>Subtotal</span>
                                                <span>₹{selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-text-muted">
                                                <span>Shipping</span>
                                                <span>₹{(selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 500 ? 0 : 50).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-accent/10 pt-3 flex justify-between font-black text-accent">
                                                <span>Total</span>
                                                <span>₹{(
                                                    selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0) + 
                                                    (selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0) > 500 ? 0 : 50) +
                                                    (selectedItems.reduce((acc, item) => acc + item.price * item.qty, 0) * 0.15)
                                                ).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-accent/20 disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                            ) : (
                                                <span className="material-symbols-outlined">verified</span>
                                            )}
                                            Create Order & Mark as Paid
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
