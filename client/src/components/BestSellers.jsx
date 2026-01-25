import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import CartContext from '../context/CartContext';

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                setProducts(data.filter(p => p.isBestSeller).slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading Best Sellers...</div>;
    }

    return (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4">Our Best Sellers</h2>
                        <p className="text-text-light/70 dark:text-text-dark/70 text-lg max-w-2xl">
                            Indulge in our most loved creations, crafted with passion and the finest ingredients.
                        </p>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors">
                        View All Products
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-surface-light dark:border-surface-dark/50 hover:shadow-xl transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                                    <div>
                                        <p className="text-white font-medium mb-2">"{product.description}"</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-yellow-400 text-sm fill-current">star</span>
                                        <span className="text-sm font-bold text-text-light dark:text-text-dark">{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-display text-xl font-bold text-text-light dark:text-text-dark group-hover:text-accent transition-colors">
                                        {product.name}
                                    </h3>
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
