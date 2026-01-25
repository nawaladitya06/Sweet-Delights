
import React, { useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const Profile = () => {
    const { user, logout, updateUserProfile } = useContext(AuthContext);
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]); // Default to empty array, no mock data
    const [myReviews, setMyReviews] = useState([]);
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [loading, setLoading] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: '',
        contact: '',
        isDefault: false
    });
    const [activeSection, setActiveSection] = useState('Order History');
    const [notificationSettings, setNotificationSettings] = useState({
        'Order Updates': true,
        'Promotions & Offers': false,
        'New Arrivals': true,
        'Account Security': true
    });
    const [securityPassword, setSecurityPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleNotificationToggle = (key) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Update global user state which also persists to localStorage
                updateUserProfile({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAddresses = async () => {
            // We can use the user object if updated properly, or fetch profile.
            // Relying on user object from context which should be updated on login/profile update
            if (user && user.addresses) {
                setAddresses(user.addresses);
            }
        };

        const fetchMyReviews = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                const userReviews = [];
                data.forEach(product => {
                    product.reviews.forEach(review => {
                        if (review.user === user._id) {
                            userReviews.push({ ...review, productName: product.name, productImage: product.image, productId: product._id });
                        }
                    });
                });
                setMyReviews(userReviews);
            } catch (error) {
                console.error("Error fetching reviews", error);
            }
        };

        if (user) {
            fetchOrders();
            fetchMyReviews();
            fetchAddresses();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <p className="text-xl text-text-muted">Please log in to view your profile.</p>
                </main>
                <Footer />
            </div>
        );
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'Personal Information':
                return (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-text-muted mb-1 block">Full Name</label>
                                <input type="text" defaultValue={user.name} className="input-field" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-text-muted mb-1 block">Email Address</label>
                                <input type="email" defaultValue={user.email} className="input-field" disabled />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-text-muted mb-1 block">Phone Number</label>
                                <input type="tel" placeholder="+1 (555) 000-0000" className="input-field" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-text-muted mb-1 block">Birthday</label>
                                <input type="date" className="input-field" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="btn-primary py-2 px-6">Save Changes</button>
                        </div>
                    </div>
                );

            case 'Payment Methods':
                const paymentMethods = user.paymentMethods || [];
                return (
                    <div className="space-y-6">
                        {paymentMethods.length > 0 ? (
                            paymentMethods.map((method, index) => (
                                <div key={index} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <span className="material-symbols-outlined text-9xl">credit_card</span>
                                    </div>
                                    <p className="text-xs opacity-70 mb-8">{method.type || 'Card'}</p>
                                    <p className="text-xl font-mono tracking-widest mb-4">**** **** **** {method.last4 || '0000'}</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs opacity-70">Card Holder</p>
                                            <p className="font-bold">{method.cardHolder || user.name.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs opacity-70">Expires</p>
                                            <p className="font-bold">{method.expiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">credit_card_off</span>
                                <p className="text-text-muted">No saved payment methods.</p>
                            </div>
                        )}
                        <button className="flex items-center gap-2 text-accent font-bold hover:text-accent-hover w-full justify-center md:justify-start">
                            <span className="material-symbols-outlined">add</span> Add Payment Method
                        </button>
                    </div>
                );

            case 'Security':
                const handleUpdatePassword = async (e) => {
                    e.preventDefault();
                    if (securityPassword.newPassword !== securityPassword.confirmPassword) {
                        return toast.error("Passwords don't match");
                    }
                    try {
                        await updateUserProfile({ password: securityPassword.newPassword });
                        setSecurityPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        toast.success("Password updated successfully");
                    } catch (error) {
                        toast.error("Failed to update password");
                    }
                };

                const handleForgotPasswordTrigger = async () => {
                    if (!window.confirm("Send password reset link to your email?")) return;
                    try {
                        await axios.post(`${API_URL}/api/auth/forgotpassword`, { email: user.email });
                        toast.success(`Password reset link sent to ${user.email}`);
                    } catch (error) {
                        toast.error("Failed to send reset link");
                    }
                };

                return (
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">Change Password</h4>
                            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-bold text-text-muted mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-field"
                                        value={securityPassword.newPassword}
                                        onChange={e => setSecurityPassword({ ...securityPassword, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-muted mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="input-field"
                                        value={securityPassword.confirmPassword}
                                        onChange={e => setSecurityPassword({ ...securityPassword, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary py-2 px-6">Update Password</button>
                            </form>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <h4 className="font-bold text-lg mb-4 text-error">Danger Zone</h4>
                            <p className="text-text-muted mb-4">If you have forgotten your password entirely or cannot access your account normally.</p>
                            <button
                                onClick={handleForgotPasswordTrigger}
                                className="btn-outline border-warning text-warning hover:bg-warning hover:text-white"
                            >
                                I Forgot My Password (Send Recovery Email)
                            </button>
                        </div>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-4">
                        {Object.keys(notificationSettings).map(item => (
                            <div key={item} className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-xl">
                                <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{item}</span>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id={item}
                                        checked={notificationSettings[item]}
                                        onChange={() => handleNotificationToggle(item)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-accent"
                                    />
                                    <label htmlFor={item} className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${notificationSettings[item] ? 'bg-accent' : 'bg-gray-300'}`}></label>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'My Reviews':
                return myReviews.length > 0 ? (
                    <div className="space-y-4">
                        {myReviews.map((review, index) => (
                            <div key={index} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-accent/5 flex gap-4">
                                <img src={review.productImage} alt={review.productName} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark mb-1">{review.productName}</h4>
                                    <div className="flex text-yellow-500 text-sm mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined fill-current text-sm">
                                                {review.rating >= i + 1 ? 'star' : 'star_outline'}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-text-muted text-sm italic">"{review.comment}"</p>
                                    <p className="text-xs text-text-muted mt-2">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => window.location.href = `/product/${review.productId}`}
                                    className="text-accent hover:text-accent-hover self-start"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4">rate_review</span>
                        <p className="text-text-muted">You haven't reviewed any products yet.</p>
                    </div>
                );
            case 'Address Book':
                const handleAddAddress = async (e) => {
                    e.preventDefault();
                    try {
                        const token = localStorage.getItem('token');
                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };
                        const { data } = await axios.post(`${API_URL}/api/users/profile/address`, newAddress, config);
                        setAddresses(data);
                        updateUserProfile({ addresses: data });
                        setIsAddingAddress(false);
                        setNewAddress({ street: '', city: '', postalCode: '', country: '', contact: '', isDefault: false });
                        toast.success('Address added');
                    } catch (error) {
                        toast.error('Failed to add address');
                    }
                };

                const handleDeleteAddress = async (id) => {
                    if (!window.confirm('Delete address?')) return;
                    try {
                        const token = localStorage.getItem('token');
                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };
                        const { data } = await axios.delete(`${API_URL}/api/users/profile/address/${id}`, config);
                        setAddresses(data);
                        updateUserProfile({ addresses: data });
                        toast.success('Address deleted');
                    } catch (error) {
                        toast.error('Failed to delete address');
                    }
                };

                return (
                    <div className="space-y-6">
                        {!isAddingAddress ? (
                            <button
                                onClick={() => setIsAddingAddress(true)}
                                className="w-full py-3 border-2 border-dashed border-accent/30 rounded-xl text-accent font-bold hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add New Address
                            </button>
                        ) : (
                            <form onSubmit={handleAddAddress} className="bg-white/50 dark:bg-black/20 p-6 rounded-xl space-y-4">
                                <h3 className="font-bold text-lg">New Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Street Address" className="input" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                    <input required type="text" placeholder="City" className="input" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                    <input required type="text" placeholder="Postal Code" className="input" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                                    <input required type="text" placeholder="Country" className="input" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} />
                                    <input required type="text" placeholder="Contact Number" className="input" value={newAddress.contact} onChange={e => setNewAddress({ ...newAddress, contact: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="defaultAddr" checked={newAddress.isDefault} onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="accent-accent" />
                                    <label htmlFor="defaultAddr">Set as default</label>
                                </div>
                                <div className="flex gap-4">
                                    <button type="submit" className="btn btn-primary flex-1">Save Address</button>
                                    <button type="button" onClick={() => setIsAddingAddress(false)} className="btn btn-outline flex-1">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((addr, idx) => (
                                <div key={idx} className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-accent/10 relative group">
                                    {addr.isDefault && <span className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">Default</span>}
                                    <p className="font-bold">{addr.street}</p>
                                    <p className="text-sm text-text-muted">{addr.city}, {addr.postalCode}</p>
                                    <p className="text-sm text-text-muted">{addr.country}</p>
                                    <p className="text-sm text-text-muted mt-2">Tel: {addr.contact}</p>
                                    <button
                                        onClick={() => handleDeleteAddress(addr._id)}
                                        className="absolute bottom-2 right-2 text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/10 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Order History':
            default:
                return orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white/50 dark:bg-black/20">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 gap-2">
                                    <div>
                                        <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Order #{order._id.slice(-6)}</p>
                                        <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-success/10 text-success' :
                                            order.status === 'Cancelled' ? 'bg-error/10 text-error' :
                                                order.status === 'Processing' ? 'bg-primary/10 text-primary' :
                                                    'bg-warning/10 text-warning'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <p className="font-bold text-accent">₹{order.totalPrice}</p>
                                    </div>
                                </div>

                                {/* Order Progress Tracking */}
                                {order.status !== 'Cancelled' && (
                                    <div className="mb-6 px-4">
                                        <div className="relative h-2 bg-accent/10 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: order.status === 'Delivered' ? '100%' :
                                                        order.status === 'Shipped' ? '75%' :
                                                            order.status === 'Processing' ? '50%' : '25%'
                                                }}
                                                className="absolute inset-0 bg-accent"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                            <span className={order.status === 'Pending' || order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-accent' : ''}>Ordered</span>
                                            <span className={order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-accent' : ''}>Processing</span>
                                            <span className={order.status === 'Shipped' || order.status === 'Delivered' ? 'text-accent' : ''}>Shipped</span>
                                            <span className={order.status === 'Delivered' ? 'text-accent' : ''}>Delivered</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {order.orderItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">{item.name}</p>
                                                <p className="text-xs text-text-muted">Qty: {item.qty} x ₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    {order.status === 'Pending' ? (
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('Are you sure you want to cancel this order?')) return;
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.put(`${API_URL}/api/orders/${order._id}/cancel`, {}, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    toast.success('Order cancelled successfully');
                                                    // Refresh orders
                                                    const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    setOrders(data);
                                                } catch (err) {
                                                    toast.error(err.response?.data?.message || 'Failed to cancel order');
                                                }
                                            }}
                                            className="text-xs font-bold text-error hover:underline transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-sm">cancel</span> Cancel Order
                                        </button>
                                    ) : <div></div>}
                                    <button className="text-sm font-bold text-accent hover:text-accent-hover flex items-center gap-1">
                                        View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4">shopping_basket</span>
                        <p className="text-text-muted">No orders yet. Time to treat yourself!</p>
                        <button onClick={() => window.location.href = '/products'} className="mt-4 btn-primary text-sm py-2">Start Shopping</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans transition-colors duration-300">
            <PageTitle title="My Profile" />
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-lg border border-accent/10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8"
                    >
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center text-4xl font-bold text-accent ring-4 ring-white dark:ring-surface-dark shadow-cherry-glow overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name ? user.name[0].toUpperCase() : 'G'
                                )}
                            </div>
                            <label className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white">edit</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="font-display text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{user.name}</h1>
                            <p className="text-text-muted mb-4">{user.email}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-3 py-1 rounded-full bg-secondary/20 text-text-secondary-light text-sm font-bold border border-secondary/50">
                                    🍰 Cake Lover
                                </span>
                                {user.isAdmin && (
                                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold border border-accent/50">
                                        🛡️ Admin
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="btn-outline border-error text-error hover:bg-error hover:text-white px-6"
                        >
                            Logout
                        </button>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Account Settings Navigation */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-lg border border-accent/10 h-fit"
                        >
                            <h3 className="font-display text-xl font-bold mb-6 text-text-primary-light dark:text-text-primary-dark">Account Settings</h3>
                            <nav className="space-y-2">
                                {['Order History', 'My Reviews', 'Personal Information', 'Address Book', 'Payment Methods', 'Notifications', 'Security'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveSection(item)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${activeSection === item ? 'bg-accent text-white shadow-md' : 'hover:bg-accent/5 text-text-muted hover:text-accent'}`}
                                    >
                                        <span className="font-medium">{item}</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                                    </button>
                                ))}
                            </nav>
                        </motion.div>

                        {/* Main Content Area */}
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-lg border border-accent/10"
                        >
                            <h3 className="font-display text-xl font-bold mb-6 text-text-primary-light dark:text-text-primary-dark border-b border-gray-100 dark:border-gray-700 pb-4">
                                {activeSection}
                            </h3>
                            {renderContent()}
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
