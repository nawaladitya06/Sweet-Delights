import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartContext from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2 text-text-light dark:text-text-dark">Your Cart</h1>
                        <div className="flex items-center gap-2 text-sm text-text-light/60 dark:text-text-dark/60">
                            <Link to="/" className="hover:text-primary">Home</Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="text-text-light dark:text-text-dark font-medium">Cart</span>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold mb-4 text-text-light dark:text-text-dark">Your cart is empty</h2>
                            <p className="text-text-light/60 dark:text-text-dark/60 mb-8">Looks like you haven't added any sweets yet.</p>
                            <Link to="/" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-white font-bold transition-transform active:scale-95 hover:bg-primary-dark">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id || item._id} className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-surface-light dark:border-surface-dark/50 shadow-sm">
                                        <div className="w-24 h-24 rounded-lg bg-surface-light dark:bg-surface-dark/50 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{item.name}</h3>
                                                    <p className="text-sm text-text-light/60 dark:text-text-dark/60">₹{item.price}</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id || item._id)} className="text-text-light/40 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-surface-light dark:bg-surface-dark/50 rounded-lg h-8">
                                                    <button onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center hover:text-primary disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center hover:text-primary">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-surface-light dark:border-surface-dark/50 p-6 sticky top-24">
                                    <h2 className="text-xl font-bold mb-6 text-text-light dark:text-text-dark">Order Summary</h2>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70">
                                            <span>Subtotal</span>
                                            <span>₹{getCartTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70">
                                            <span>Shipping</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="border-t border-surface-light dark:border-surface-dark/50 pt-3 flex justify-between font-bold text-lg text-text-light dark:text-text-dark">
                                            <span>Total</span>
                                            <span>₹{getCartTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link to="/checkout" className="w-full inline-flex items-center justify-center h-12 rounded-xl bg-primary text-white font-bold transition-transform active:scale-95 hover:bg-primary-dark shadow-lg shadow-primary/25">
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
