import React, { useState, useContext } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinkClasses = ({ isActive }) =>
        `relative flex items-center justify-center p-2 transition-colors group ${isActive
            ? 'text-accent font-bold'
            : 'text-text-primary-light dark:text-text-primary-dark hover:text-accent'
        }`;

    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    // ... (keep existing logic)

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-accent/20 transition-all duration-300">
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link to="/home" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-accent/10 p-2 rounded-full border border-accent/20"
                        >
                            <img src="/cake.png" alt="Sweet Delights Logo" className="h-8 w-8 object-contain" />
                        </motion.div>
                        <h1 className="text-2xl font-bold font-serif tracking-tight text-text-primary-light dark:text-text-primary-dark group-hover:text-accent transition-colors">
                            Sweet Delights
                        </h1>
                    </Link>

                    {/* Desktop Nav - Hidden on Auth Pages */}
                    {!isAuthPage && (
                        <nav className="hidden md:flex items-center gap-8">
                            <NavLink className={navLinkClasses} to="/home">
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">home</span>
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full shadow-cherry-glow" />}
                                        <span className="absolute -bottom-8 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Home</span>
                                    </>
                                )}
                            </NavLink>
                            <NavLink className={navLinkClasses} to="/customizer">
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">draw</span>
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full shadow-cherry-glow" />}
                                        <span className="absolute -bottom-8 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Design</span>
                                    </>
                                )}
                            </NavLink>
                            <NavLink className={navLinkClasses} to="/products">
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">storefront</span>
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full shadow-gold-glow" />}
                                        <span className="absolute -bottom-8 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Storefront</span>
                                    </>
                                )}
                            </NavLink>
                            <NavLink className={navLinkClasses} to="/about">
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">info</span>
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full shadow-cherry-glow" />}
                                        <span className="absolute -bottom-8 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">About</span>
                                    </>
                                )}
                            </NavLink>
                            <NavLink className={navLinkClasses} to="/contact">
                                {({ isActive }) => (
                                    <>
                                        <span className="material-symbols-outlined text-2xl">mail</span>
                                        {isActive && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full shadow-cherry-glow" />}
                                        <span className="absolute -bottom-8 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Contact</span>
                                    </>
                                )}
                            </NavLink>
                        </nav>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Search (Hidden on small screens) */}
                    {/* Search (Hidden on small screens) */}
                    <div className="hidden lg:flex items-center relative group">
                        <AnimatePresence>
                            {isSearchOpen ? (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 200, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearchSubmit}
                                    className="flex items-center bg-surface-light dark:bg-surface-dark rounded-full border border-accent/20 overflow-hidden mr-2"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full bg-transparent border-none px-4 py-1 text-sm focus:ring-0 text-text-primary-light dark:text-text-primary-dark"
                                        autoFocus
                                    />
                                    <button type="submit" className="hidden">Search</button>
                                </motion.form>
                            ) : null}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 text-text-primary-light dark:text-text-primary-dark hover:text-accent transition-colors relative"
                        >
                            <span className="material-symbols-outlined text-xl">{isSearchOpen ? 'close' : 'search'}</span>
                            {!isSearchOpen && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Search</span>}
                        </motion.button>
                    </div>

                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: 180 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-accent/10 transition-colors text-text-primary-light dark:text-text-primary-dark hover:text-accent relative group"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </motion.button>

                    {/* Cart */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 rounded-full hover:bg-accent/10 transition-colors text-text-primary-light dark:text-text-primary-dark hover:text-accent group"
                    >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <span className="material-symbols-outlined text-xl">shopping_cart</span>
                        </motion.div>
                        {getCartCount() > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-[10px] font-bold text-surface-dark flex items-center justify-center rounded-full animate-pulse">
                                {getCartCount()}
                            </span>
                        )}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">Cart</span>
                    </button>

                    {/* User Profile */}
                    <div className="relative">
                        {user ? (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="relative flex items-center justify-center p-1 rounded-full border border-accent/20 hover:border-accent transition-colors group"
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover border-2 border-accent/20 group-hover:border-accent transition-colors" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold ring-2 ring-transparent group-hover:ring-accent/50 transition-all">
                                            {user.name ? user.name[0].toUpperCase() : 'G'}
                                        </div>
                                    )}
                                    <span className="absolute top-full mt-2 right-0 px-2 py-1 bg-surface-dark text-accent text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-accent/20">
                                        {user.name}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-xl shadow-cherry-glow border border-accent/20 overflow-hidden py-1"
                                        >
                                            <div className="px-4 py-2 border-b border-accent/10">
                                                <p className="text-xs text-text-muted">Signed in as</p>
                                                <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark truncate">{user.email || 'Guest'}</p>
                                            </div>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-accent/10 hover:text-accent">Profile</Link>
                                            {(user.role === 'admin' || user.role === 'superadmin') && (
                                                <Link to="/admin" className="block px-4 py-2 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-accent/10 hover:text-accent">Dashboard</Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark hover:text-accent transition-colors">Login</Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link to="/signup" className="btn-primary py-2 px-4 text-xs font-bold rounded-full shadow-lg hover:shadow-accent/40 bg-accent text-white hover:bg-accent-hover transition-all">Sign Up</Link>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-text-primary-light dark:text-text-primary-dark hover:text-accent"
                    >
                        <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface-light dark:bg-surface-dark border-t border-accent/20 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            <NavLink
                                to="/home"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-accent/10 text-text-primary-light dark:text-text-primary-dark'}`}
                            >
                                <span className="material-symbols-outlined">home</span>
                                <span>Home</span>
                            </NavLink>
                            <NavLink
                                to="/customizer"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-accent/10 text-text-primary-light dark:text-text-primary-dark'}`}
                            >
                                <span className="material-symbols-outlined">draw</span>
                                <span>Design Cake</span>
                            </NavLink>
                            <NavLink
                                to="/products"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-accent/10 text-text-primary-light dark:text-text-primary-dark'}`}
                            >
                                <span className="material-symbols-outlined">storefront</span>
                                <span>Shop</span>
                            </NavLink>
                            <NavLink
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-accent/10 text-text-primary-light dark:text-text-primary-dark'}`}
                            >
                                <span className="material-symbols-outlined">info</span>
                                <span>About Us</span>
                            </NavLink>
                            <NavLink
                                to="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? 'bg-accent/10 text-accent font-bold' : 'hover:bg-accent/10 text-text-primary-light dark:text-text-primary-dark'}`}
                            >
                                <span className="material-symbols-outlined">mail</span>
                                <span>Contact</span>
                            </NavLink>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header >
    );
};

export default Header;
