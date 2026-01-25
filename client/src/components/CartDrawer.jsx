import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartContext from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateCartQty } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-background-dark shadow-2xl z-[101] flex flex-col border-l border-accent/10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-accent/10 flex justify-between items-center bg-accent/5">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-accent text-3xl">shopping_basket</span>
                                <h2 className="text-2xl font-serif font-black text-primary dark:text-accent">Your Cart</h2>
                                <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">{cartItems.length}</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-text-muted">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-24 h-24 bg-accent/5 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-accent/30">shopping_cart_off</span>
                                    </div>
                                    <p className="text-text-muted font-medium">Your cart is empty</p>
                                    <button
                                        onClick={() => { onClose(); navigate('/products'); }}
                                        className="text-accent font-bold hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-accent/10">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-text-primary-light dark:text-text-primary-dark truncate">{item.name}</h4>
                                            <p className="text-accent font-bold">₹{item.price}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center border border-accent/20 rounded-lg overflow-hidden h-8">
                                                    <button
                                                        onClick={() => updateCartQty(item._id, Math.max(1, item.qty - 1))}
                                                        className="px-2 hover:bg-accent/10 text-accent transition-colors"
                                                    >-</button>
                                                    <span className="px-3 text-xs font-bold w-10 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateCartQty(item._id, item.qty + 1)}
                                                        className="px-2 hover:bg-accent/10 text-accent transition-colors"
                                                    >+</button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-error/50 hover:text-error transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-accent/10 space-y-4 bg-accent/5">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-text-muted">Total Amount</span>
                                    <span className="text-accent text-2xl">₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => { onClose(); navigate('/checkout'); }}
                                    className="w-full btn-primary py-4 rounded-xl font-bold shadow-lg hover:shadow-accent/40 bg-accent text-white flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <span className="material-symbols-outlined">payments</span>
                                </button>
                                <button
                                    onClick={() => { onClose(); navigate('/cart'); }}
                                    className="w-full text-center text-sm font-bold text-text-muted hover:text-accent transition-colors"
                                >
                                    View Full Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
