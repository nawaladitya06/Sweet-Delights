import React, { createContext, useState, useEffect } from 'react';

import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Load cart from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        const existingItem = cartItems.find((item) =>
            (item.id && product.id && item.id === product.id) ||
            (item._id && product._id && item._id === product._id)
        );

        if (existingItem) {
            toast.success(`Updated quantity for ${product.name}!`, { icon: '🍰' });
            setCartItems(prevItems => prevItems.map(item =>
                ((item.id && product.id && item.id === product.id) || (item._id && product._id && item._id === product._id))
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            toast.success(`Delightful! ${product.name} added to your cart.`, { icon: '🍰' });
            setCartItems(prevItems => [...prevItems, { ...product, quantity }]);
        }
    };

    const removeFromCart = (productId) => {
        const itemToRemove = cartItems.find(item => item.id === productId || item._id === productId);
        if (itemToRemove) {
            toast('Item removed from cart', { icon: '🗑️' });
        }
        setCartItems((prevItems) => prevItems.filter((item) => (item.id !== productId && item._id !== productId)));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                (item.id === productId || item._id === productId) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
