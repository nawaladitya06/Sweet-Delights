import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminSettings = () => {
    const { theme, toggleTheme } = useTheme();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get(`${API_URL}/api/auth/me`, config);
                setProfileData(prev => ({
                    ...prev,
                    name: data.name || '',
                    email: data.email || ''
                }));
            } catch (error) {
                console.error("Error fetching profile:", error);
                // toast.error("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, {
                name: profileData.name,
                email: profileData.email
            }, config);

            toast.success("Profile updated successfully!");
            // Optionally update localStorage if needed
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (profileData.newPassword !== profileData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`${API_URL}/api/auth/profile`, {
                password: profileData.newPassword
            }, config);

            toast.success("Password updated successfully!");
            setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password");
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">

            {/* Appearance Settings */}
            <section className="glass p-8 rounded-2xl border border-accent/10">
                <h3 className="text-xl font-serif font-bold text-primary dark:text-accent mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">palette</span>
                    Appearance
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-text-primary-light dark:text-text-primary-dark">Dark Mode</p>
                        <p className="text-sm text-text-muted">Switch between light and dark themes</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-accent' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </section>

            {/* Profile Settings */}
            <section className="glass p-8 rounded-2xl border border-accent/10">
                <h3 className="text-xl font-serif font-bold text-primary dark:text-accent mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">person</span>
                    Profile Settings
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </section>

            {/* Security Settings */}
            <section className="glass p-8 rounded-2xl border border-accent/10">
                <h3 className="text-xl font-serif font-bold text-primary dark:text-accent mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined">lock</span>
                    Security
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-muted">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={profileData.currentPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={profileData.newPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-muted">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={profileData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-background-dark border border-accent/20 focus:border-accent outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="btn-secondary">
                            Update Password
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AdminSettings;
