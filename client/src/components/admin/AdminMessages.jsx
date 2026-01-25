import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { API_URL } from '../../config';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log("AdminMessages Review Component Mounted");
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/api/contact`, config);
            setMessages(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
            setIsLoading(false);
        }
    };

    const handleReplyClick = (id) => {
        setReplyingTo(id);
        setReplyText('');
    };

    const handleSendReply = async (id) => {
        if (!replyText.trim()) return toast.error("Reply cannot be empty");

        const toastId = toast.loading("Sending reply...");
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post(`${API_URL}/api/contact/${id}/reply`, { replyMessage: replyText }, config);

            toast.success('Reply sent successfully!', { id: toastId });
            setReplyingTo(null);
            setReplyText('');

            // Update local state
            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, status: 'Replied', adminReply: replyText, repliedAt: new Date() } : msg
            ));
        } catch (error) {
            console.error('Reply failed:', error);
            toast.error('Failed to send reply', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${API_URL}/api/contact/${id}`, config);
            toast.success('Message deleted', { icon: '🗑️' });
            setMessages(messages.filter(msg => msg._id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error(error.response?.data?.message || 'Failed to delete message');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Inquiries ({messages.length})
                </h2>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 glass rounded-2xl border border-accent/10">
                    <span className="material-symbols-outlined text-4xl text-text-muted mb-2">inbox</span>
                    <p className="text-text-muted">No messages found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {Array.isArray(messages) && messages.map((msg) => (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all duration-300 relative group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold uppercase">
                                            {msg.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                                                {msg.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                                <span className="material-symbols-outlined text-xs">mail</span>
                                                {msg.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1 mr-2
                                            ${msg.status === 'Replied' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {msg.status || 'New'}
                                        </span>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1 
                                            ${msg.inquiryType === 'Custom Order' ? 'bg-purple-100 text-purple-600' :
                                                msg.inquiryType === 'Corporate Order' ? 'bg-blue-100 text-blue-600' :
                                                    msg.inquiryType === 'Feedback' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'}`}>
                                            {msg.inquiryType}
                                        </span>
                                        <p className="text-xs text-text-muted">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-background-light dark:bg-black/20 p-4 rounded-xl text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed mb-4">
                                    {msg.message}
                                </div>

                                {/* Start of Reply Section */}
                                {msg.status === 'Replied' && (
                                    <div className="mb-4 pl-4 border-l-2 border-accent/20">
                                        <p className="text-xs font-bold text-accent mb-1">
                                            Replied on {new Date(msg.repliedAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-text-muted italic">"{msg.adminReply}"</p>
                                    </div>
                                )}

                                {replyingTo === msg._id ? (
                                    <div className="mt-4 animate-fadeIn">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your reply here..."
                                            className="w-full p-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-accent/20 focus:border-accent outline-none text-sm mb-2"
                                            rows="3"
                                            autoFocus
                                        ></textarea>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setReplyingTo(null)}
                                                className="px-3 py-1 text-xs font-bold text-text-muted hover:text-text-primary-light dark:hover:text-white"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSendReply(msg._id)}
                                                className="px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover shadow-lg"
                                            >
                                                Send Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-2">
                                        {msg.status !== 'Replied' && (
                                            <button
                                                onClick={() => handleReplyClick(msg._id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-accent border border-accent/20 rounded-lg hover:bg-accent hover:text-white transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">reply</span>
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                )}
                                {/* End of Reply Section */}

                                {user && user.role === 'superadmin' && (
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete Message"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
