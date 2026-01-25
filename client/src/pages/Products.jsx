import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartContext from '../context/CartContext';
import { motion } from 'framer-motion';
import PageTitle from '../components/PageTitle';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ProductCardSkeleton } from '../components/Skeleton';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const categoryFilter = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const { addToCart } = useContext(CartContext);
    const { user, updateWishlist } = useContext(AuthContext);
    const [showLikedOnly, setShowLikedOnly] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products`);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        const matchesSearch = searchQuery
            ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesLiked = showLikedOnly ? user && user.wishlist && user.wishlist.includes(product._id) : true;
        return matchesCategory && matchesSearch && matchesLiked;
    });

    const toggleWishlistHandler = async (e, productId) => {
        e.stopPropagation();
        if (!user) {
            toast.error('Please login to like products');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${API_URL}/api/users/wishlist`, { productId }, config);
            updateWishlist(data); // data is the new wishlist array
            if (data.includes(productId)) {
                toast.success('Added to Likes');
            } else {
                toast.success('Removed from Likes');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
                <Header />
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="h-10 w-64 mx-auto bg-accent/10 animate-pulse rounded-full mb-12"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-error text-xl">{error}</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
            <PageTitle title="Shop" />
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="font-display text-5xl md:text-7xl font-bold text-center mb-4 text-accent">
                    {searchQuery ? `Search Results for "${searchQuery}"` : (categoryFilter ? `${categoryFilter}` : 'All Products')}
                </h1>
                <p className="text-xl text-text-secondary-light dark:text-text-secondary-dark font-light max-w-2xl mx-auto text-center mb-12">
                    We are a virtual bakery delivering happiness to your doorstep.
                </p>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => { navigate('/products'); setShowLikedOnly(false); }}
                        className={`px-6 py-2 rounded-full font-bold transition-all border border-accent/20 ${!categoryFilter && !showLikedOnly
                            ? 'bg-accent text-white shadow-cherry-glow scale-105'
                            : 'bg-surface-light dark:bg-surface-dark text-text-muted hover:border-accent hover:text-accent'}`}
                    >
                        All
                    </button>
                    {['Cakes', 'Cupcakes', 'Custom'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => { navigate(`/products?category=${cat}`); setShowLikedOnly(false); }}
                            className={`px-6 py-2 rounded-full font-bold transition-all border border-accent/20 ${categoryFilter === cat && !showLikedOnly
                                ? 'bg-accent text-white shadow-cherry-glow scale-105'
                                : 'bg-surface-light dark:bg-surface-dark text-text-muted hover:border-accent hover:text-accent'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowLikedOnly(!showLikedOnly)}
                        className={`px-6 py-2 rounded-full font-bold transition-all border border-accent/20 flex items-center gap-2 ${showLikedOnly
                            ? 'bg-accent text-white shadow-cherry-glow scale-105'
                            : 'bg-surface-light dark:bg-surface-dark text-text-muted hover:border-accent hover:text-accent'}`}
                    >
                        <span className="material-symbols-outlined text-sm">{showLikedOnly ? 'favorite' : 'favorite_border'}</span>
                        Liked
                    </button>
                </div>

                {filteredProducts.length === 0 ? (
                    <p className="text-center text-xl text-text-muted">No products found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg overflow-hidden border border-accent/10 hover:shadow-cherry-glow transition-shadow duration-300 flex flex-col group"
                            >
                                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                                    <motion.img
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Heart Icon */}
                                    <button
                                        onClick={(e) => toggleWishlistHandler(e, product._id)}
                                        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
                                    >
                                        <span className={`material-symbols-outlined text-xl ${user && user.wishlist && user.wishlist.includes(product._id) ? 'text-accent fill-current' : 'text-text-muted'}`}>
                                            favorite
                                        </span>
                                    </button>
                                    {/* Hover Overlay for Details */}
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                                        <div>
                                            <p className="text-white font-medium mb-2">"{product.description}"</p>
                                            <span className="inline-block bg-accent/20 text-accent border border-accent/50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    {(product.countInStock <= 0 || product.rating > 0) && (
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                            <div className="flex items-center gap-1">
                                                {product.countInStock <= 0 ? (
                                                    <span className="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded-full">Out of Stock</span>
                                                ) : product.numReviews > 0 ? (
                                                    <>
                                                        <span className="material-symbols-outlined text-yellow-400 text-sm fill-current">star</span>
                                                        <span className="text-sm font-bold text-text-light dark:text-text-dark">{product.rating ? product.rating.toFixed(1) : 0}</span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                                        <h3 className="text-xl font-bold font-display text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors">{product.name}</h3>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto mb-4">
                                        <span className="text-2xl font-bold text-accent">₹{product.price.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-accent text-surface-dark font-bold py-3 px-4 rounded-xl hover:bg-accent-hover transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-2 group/btn"
                                    >
                                        Add to Cart
                                        <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">shopping_bag</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div >
    );
};

export default Products;
