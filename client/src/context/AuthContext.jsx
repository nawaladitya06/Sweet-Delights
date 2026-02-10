import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { sendWeb3FormsEmail } from '../utils/sendWeb3FormsEmail';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const isGuest = localStorage.getItem('isGuest');

            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const { data } = await axios.get(`${API_URL}/api/auth/me`, config);

                    // Check for locally saved avatar
                    const savedAvatar = localStorage.getItem('user_avatar');
                    setUser({ ...data, avatar: savedAvatar || data.avatar });
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else if (isGuest) {
                const savedAvatar = localStorage.getItem('user_avatar');
                setUser({ _id: 'guest', name: 'Guest User', email: '', role: 'guest', avatar: savedAvatar });
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        setError(null);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            localStorage.setItem('token', data.token);

            // Check for locally saved avatar
            const savedAvatar = localStorage.getItem('user_avatar');
            setUser({ ...data, avatar: savedAvatar || data.avatar });
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const signup = async (name, email, password, role = 'user') => {
        setError(null);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
            localStorage.setItem('token', data.token);
            setUser(data);

            // Notify SuperAdmin about new Baker registration
            if (role === 'admin') {
                await sendWeb3FormsEmail({
                    subject: 'Sweet Delights - New Admin Approval Required',
                    fromName: 'Sweet Delights Auth System',
                    fields: {
                        notification_type: 'New Baker Registration',
                        baker_name: name,
                        baker_email: email,
                        status: 'Pending Approval',
                        message: 'A new baker has registered and is waiting for your approval in the Owner Dashboard.'
                    }
                });
            }

            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
            throw err;
        }
    };

    const googleSignIn = async (token) => {
        setError(null);
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/google`, { token });
            localStorage.setItem('token', data.token);
            setUser(data);
            if (data.avatar) {
                localStorage.setItem('user_avatar', data.avatar);
            }
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isGuest');
        // Optional: Clear avatar on logout? Usually yes for security/privacy on shared screens, 
        // but user might expect it to persist on same device. Let's keep it for now or clear it. 
        // User asked for persistence, but usually per-user. 
        // For simplicity and "wow" factor of it working, let's leave it or maybe clear it?
        // Let's clear it to be clean.
        localStorage.removeItem('user_avatar');
        setUser(null);
    };

    const guestLogin = () => {
        const guestUser = { _id: 'guest', name: 'Guest User', email: '', role: 'guest' };
        setUser(guestUser);
        localStorage.setItem('isGuest', 'true');
    };

    const updateUserProfile = (updatedData) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedData };
            if (updatedData.avatar) {
                localStorage.setItem('user_avatar', updatedData.avatar);
            }
            return newUser;
        });
    };

    const updateWishlist = (newWishlist) => {
        setUser(prev => ({ ...prev, wishlist: newWishlist }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, signup, logout, guestLogin, updateUserProfile, googleSignIn, updateWishlist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
