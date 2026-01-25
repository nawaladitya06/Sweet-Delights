import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const AdminReviews = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null); // { reviewId, productId }
    const [replyText, setReplyText] = useState('');

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get(`${API_URL}/api/products`, config); // Fetch all products to get reviews

            let allReviews = [];
            data.forEach(product => {
                if (product.reviews && product.reviews.length > 0) {
                    product.reviews.forEach(review => {
                        allReviews.push({
                            ...review,
                            productName: product.name,
                            productId: product._id
                        });
                    });
                }
            });

            // Sort by newest first
            allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setReviews(allReviews);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to load reviews");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (productId, reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`${API_URL}/api/products/${productId}/reviews/${reviewId}`, config);
                toast.success('Review deleted successfully');
                fetchReviews();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete review');
            }
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.post(
                `${API_URL}/api/products/${replyingTo.productId}/reviews/${replyingTo.reviewId}/reply`,
                { text: replyText },
                config
            );
            toast.success('Reply posted successfully');
            setReplyingTo(null);
            setReplyText('');
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post reply');
        }
    };

    const handleDeleteReply = async (productId, reviewId) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`${API_URL}/api/products/${productId}/reviews/${reviewId}/reply`, config);
                toast.success('Reply deleted successfully');
                fetchReviews();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete reply');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20 dark:border-white/5">
            <h2 className="text-2xl font-bold font-display text-primary dark:text-accent mb-6">Product Reviews</h2>

            {reviews.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">reviews</span>
                    <p>No reviews found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                                <th className="pb-4 font-bold text-primary dark:text-accent">Date</th>
                                <th className="pb-4 font-bold text-primary dark:text-accent">Product</th>
                                <th className="pb-4 font-bold text-primary dark:text-accent">User</th>
                                <th className="pb-4 font-bold text-primary dark:text-accent">Rating</th>
                                <th className="pb-4 font-bold text-primary dark:text-accent">Comment</th>
                                <th className="pb-4 font-bold text-primary dark:text-accent text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <React.Fragment key={review._id}>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 text-sm text-text-muted">
                                            {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-medium text-text-primary-light dark:text-text-primary-dark">
                                            {review.productName}
                                        </td>
                                        <td className="py-4 text-text-primary-light dark:text-text-primary-dark">
                                            {review.name}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex text-yellow-500 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined fill-current text-[16px]">
                                                        {review.rating >= i + 1 ? 'star' : 'star_outline'}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 text-text-muted max-w-xs truncate" title={review.comment}>
                                            {review.comment}
                                        </td>
                                        <td className="py-4 text-right flex gap-2 justify-end">
                                            {!review.adminReply && (
                                                <button
                                                    onClick={() => {
                                                        setReplyingTo({ reviewId: review._id, productId: review.productId });
                                                        setReplyText('');
                                                    }}
                                                    className="p-2 hover:bg-accent/10 rounded-lg text-accent transition-colors"
                                                    title="Reply"
                                                >
                                                    <span className="material-symbols-outlined">reply</span>
                                                </button>
                                            )}

                                            {user?.role === 'superadmin' && (
                                                <>
                                                    {review.adminReply && (
                                                        <button
                                                            onClick={() => handleDeleteReply(review.productId, review._id)}
                                                            className="p-2 hover:bg-warning/10 rounded-lg text-warning transition-colors"
                                                            title="Delete Reply"
                                                        >
                                                            <span className="material-symbols-outlined">comment_bank</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review.productId, review._id)}
                                                        className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors"
                                                        title="Delete Review"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    {(replyingTo?.reviewId === review._id) && (
                                        <tr className="bg-accent/5">
                                            <td colSpan="6" className="p-4">
                                                <form onSubmit={handleReplySubmit} className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Type your reply..."
                                                        className="flex-1 bg-white/50 dark:bg-black/20 rounded-lg px-4 py-2 border border-accent/20 focus:outline-none focus:border-accent"
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors font-medium"
                                                    >
                                                        Post
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-4 py-2 text-text-muted hover:text-text-primary-light transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    )}
                                    {review.adminReply && (
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <td colSpan="6" className="pb-4 px-4 pt-0">
                                                <div className="ml-12 p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-accent">Admin Reply ({review.adminReply.name || 'Admin'})</span>
                                                        <span className="text-xs text-text-muted">{new Date(review.adminReply.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-text-primary-light dark:text-text-primary-dark">{review.adminReply.text}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;
