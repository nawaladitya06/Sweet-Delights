import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CakeCustomizer from './pages/CakeCustomizer';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Background3D from './components/Background3D';
import About from './pages/About';
import Contact from './pages/Contact';
import { FAQ, Shipping, Privacy, Terms } from './pages/SupportPages';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Welcome from './pages/Welcome';
import { ThemeProvider } from './context/ThemeContext';
import ToastProvider from './components/ToastProvider';
import AdminRoute from './components/AdminRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import { AnimatePresence } from 'framer-motion';
import AIChatbot from './components/AIChatbot';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
        <ToastProvider />
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <ErrorBoundary>
                <Background3D />
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Welcome />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/customizer" element={<CakeCustomizer />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/admin" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/forgotpassword" element={<ForgotPassword />} />
                      <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />
                      <Route path="/terms" element={<Terms />} />
                      {/* Catch-all route for 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </div>
                <AIChatbot />
              </ErrorBoundary>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
  );
}

export default App;
