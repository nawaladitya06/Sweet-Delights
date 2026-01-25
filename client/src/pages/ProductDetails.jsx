import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import PageTitle from '../components/PageTitle';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);

                // Fetch related products (same category or cross-recommended)
                const { data: allProducts } = await axios.get(`${API_URL}/api/products`);
                const related = allProducts
                    .filter(p => p._id !== id && (p.category === data.category || (data.category === 'Cakes' && p.category === 'Cupcakes')))
                    .slice(0, 4);
                setRelatedProducts(related);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.post(`${API_URL}/api/products/${id}/reviews`, { rating, comment }, config);
            toast.success('Review submitted!');
            setComment('');
            setRating(5);
            // Refresh product to show new review
            const { data } = await axios.get(`${API_URL}/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
            </main>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-error text-xl">{error}</div>
            </main>
            <Footer />
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300">
            <PageTitle title={product.name} />
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-accent font-bold hover:underline gap-1">
                    <span className="material-symbols-outlined">arrow_back</span> Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden shadow-2xl border border-accent/10"
                    >
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center"
                    >
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary dark:text-accent mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="material-symbols-outlined fill-current text-2xl">
                                        {product.rating >= i + 1 ? 'star' : product.rating >= i + 0.5 ? 'star_half' : 'star_outline'}
                                    </span>
                                ))}
                            </div>
                            <span className="text-text-muted text-lg">({product.numReviews} reviews)</span>
                        </div>
                        <p className="text-2xl font-bold text-accent mb-6">₹{product.price}</p>
                        <p className="text-text-primary-light dark:text-text-primary-dark text-lg leading-relaxed mb-8">{product.description}</p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${product.countInStock > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                <span className="bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-bold border border-accent/50 uppercase tracking-widest">
                                    {product.category}
                                </span>
                            </div>

                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.countInStock === 0}
                                className="mt-4 w-full md:w-auto bg-accent text-white font-bold py-4 px-8 rounded-xl hover:bg-accent-hover transition-all shadow-cherry-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">shopping_cart</span>
                                {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products / AI Recommendations */}
                <div className="mt-16 pt-12 border-t border-accent/10">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-accent text-3xl">auto_awesome</span>
                        <h2 className="font-display text-3xl font-bold text-primary dark:text-accent">Perfect Match</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(relProduct => (
                            <motion.div
                                key={relProduct._id}
                                whileHover={{ y: -5 }}
                                onClick={() => { navigate(`/product/${relProduct._id}`); window.scrollTo(0, 0); }}
                                className="glass p-4 rounded-2xl border border-accent/5 cursor-pointer group"
                            >
                                <div className="h-40 rounded-xl overflow-hidden mb-3">
                                    <img src={relProduct.image} alt={relProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h4 className="font-bold text-sm truncate">{relProduct.name}</h4>
                                <p className="text-accent font-black text-sm">₹{relProduct.price}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 pt-12 border-t border-accent/10">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-primary dark:text-accent mb-8">Reviews</h2>
                        {product.reviews.length === 0 && <p className="text-text-muted italic">No reviews yet. Be the first to review!</p>}
                        <div className="space-y-6">
                            {product.reviews.map((review) => (
                                <div key={review._id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-accent/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-text-primary-light dark:text-text-primary-dark">{review.name}</span>
                                        </div>
                                        <div className="flex text-yellow-500 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined fill-current">
                                                    {review.rating >= i + 1 ? 'star' : 'star_outline'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-text-primary-light dark:text-text-primary-dark mt-2 text-sm">
                                        {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                    <p className="text-text-muted mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-3xl font-bold text-primary dark:text-accent mb-8">Write a Review</h2>
                        {user ? (
                            <form onSubmit={submitHandler} className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-lg border border-accent/10">
                                <div className="mb-6">
                                    <label className="block text-text-muted font-bold mb-2">Rating: {rating} Stars</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <span className={`material-symbols-outlined text-4xl ${star <= rating ? 'fill-current text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}>
                                                    star
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-text-muted font-bold mb-2">Comment</label>
                                    <textarea
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-background-light dark:bg-black/20 border border-accent/20 rounded-xl px-4 py-3 outline-none focus:border-accent text-text-primary-light dark:text-text-primary-dark resize-none"
                                        placeholder="Share your experience..."
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full py-3">Submit Review</button>
                            </form>
                        ) : (
                            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-8 text-center">
                                <p className="text-lg text-text-muted mb-4">Please <span className="font-bold text-accent">sign in</span> to write a review.</p>
                                <button onClick={() => navigate('/login')} className="btn-outline border-accent text-accent hover:bg-accent hover:text-white px-8">Login</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetails;
