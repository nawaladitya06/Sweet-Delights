import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminUsers = () => {
    const { user: currentUser } = React.useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/api/users`, config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${API_URL}/api/users/${id}`, { role: newRole }, config);

            setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
            toast.success(`User role updated to ${newRole === 'admin' ? 'Baker' : newRole === 'superadmin' ? 'Owner' : 'Customer'}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update user role");
        }
    };

    const handleStatusUpdate = async (id, status) => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${API_URL}/api/auth/status/${id}`, { status }, config);

            setUsers(users.map(u => u._id === id ? { ...u, status } : u));
            toast.success(`User ${status === 'approved' ? 'approved' : 'declined'} successfully`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`${API_URL}/api/users/${id}`, config);

                setUsers(users.filter(user => user._id !== id));
                toast.success('User deleted successfully');
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/users`, newUser, config);

            setUsers([...users, data]);
            setIsModalOpen(false);
            setNewUser({ name: '', email: '', password: '', role: 'user' });
            toast.success("User created successfully");
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error(error.response?.data?.message || "Failed to create user");
        }
    };

    const pendingAdmins = users.filter(u => u.role === 'admin' && u.status === 'pending');
    const approvedUsers = users.filter(u => u.role !== 'admin' || u.status === 'approved' || u.status === 'active' || !u.status);

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading users...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">User Management</h2>
                    <div className="text-sm text-text-muted">Total Users: {users.length}</div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Add User
                </button>
            </div>

            {/* Pending Approvals Section (Only for Superadmin) */}
            {currentUser?.role === 'superadmin' && pendingAdmins.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                        <span className="material-symbols-outlined">pending_actions</span>
                        Pending Baker Approvals
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingAdmins.map((admin) => (
                            <motion.div
                                key={admin._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-6 rounded-2xl border border-accent/20 flex flex-col gap-4 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 bg-accent/10 rounded-bl-xl">
                                    <span className="text-[10px] font-bold text-accent uppercase">Pending</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-primary-light dark:text-text-primary-dark truncate">{admin.name}</p>
                                        <p className="text-sm text-text-muted truncate">{admin.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate(admin._id, 'approved')}
                                        className="flex-1 py-2 rounded-xl bg-accent text-white font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Approve
                                    </button>
                                    <button
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate(admin._id, 'declined')}
                                        className="flex-1 py-2 rounded-xl border border-error text-error font-bold text-sm hover:bg-error/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                        Decline
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="glass rounded-xl overflow-hidden border border-accent/10">
                <div className="overflow-x-auto">
                    {approvedUsers.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                            <p>No active users found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/5 border-b border-accent/10">
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">User</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Email</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Role</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Status</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark font-display">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent/10">
                                {approvedUsers.map((user, index) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{user.name}</span>
                                        </td>
                                        <td className="p-4 text-sm text-text-muted">{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                className={`bg-surface-light dark:bg-surface-dark border border-accent/20 rounded-lg text-xs p-1 focus:ring-accent focus:border-accent outline-none cursor-pointer font-bold ${user.role === 'admin' ? 'text-accent' : 'text-text-muted'
                                                    }`}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="user" className="bg-surface-light dark:bg-surface-dark">Customer</option>
                                                <option value="admin" className="bg-surface-light dark:bg-surface-dark">Baker</option>
                                                <option value="superadmin" className="bg-surface-light dark:bg-surface-dark">Owner</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'approved' || user.status === 'active' || !user.status ? 'bg-success/10 text-success' :
                                                    user.status === 'pending' ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'
                                                }`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-background-dark w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-accent/20"
                        >
                            <div className="p-6 border-b border-accent/10 flex justify-between items-center bg-accent/5">
                                <h3 className="text-xl font-serif font-bold text-primary dark:text-accent">Add New User</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-error transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="user">Customer</option>
                                        <option value="admin">Baker</option>
                                        <option value="superadmin">Owner</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-text-muted hover:bg-accent/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary px-6 py-2"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

import AuthContext from '../../context/AuthContext';

export default AdminUsers;
