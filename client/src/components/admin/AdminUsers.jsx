import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
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
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update user role");
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

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading users...</div>;
    }

    return (
        <div className="space-y-6">
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

            <div className="glass rounded-xl overflow-hidden border border-accent/10">
                <div className="overflow-x-auto">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                            <p>No registered users found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-accent/5 border-b border-accent/10">
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">User</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Email</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Role</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Joined</th>
                                    <th className="p-4 text-sm font-bold text-primary dark:text-secondary-dark">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-accent/10">
                                {users.map((user, index) => (
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
                                                <option value="user" className="bg-surface-light dark:bg-surface-dark">User</option>
                                                <option value="admin" className="bg-surface-light dark:bg-surface-dark">Admin</option>
                                                <option value="superadmin" className="bg-surface-light dark:bg-surface-dark">Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-sm text-text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
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
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Super Admin</option>
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

export default AdminUsers;
