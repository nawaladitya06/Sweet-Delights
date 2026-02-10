import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import RazorpayButton from '../components/RazorpayButton';
import { sendWeb3FormsEmail } from '../utils/sendWeb3FormsEmail';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Online'); // 'Online' or 'COD'
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(null); // { code, amount }
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });

    const subtotal = getCartTotal();
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const total = Math.max(0, subtotal + shipping + tax - discount);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        try {
            const { data } = await axios.post(`${API_URL}/api/coupons/validate`, {
                code: couponCode,
                orderAmount: subtotal
            });
            setDiscount(parseFloat(data.discount));
            setCouponApplied(data);
            toast.success(`Coupon "${data.code}" applied! You saved ₹${data.discount}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
            setDiscount(0);
            setCouponApplied(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createOrder = async (method) => {
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id || item.id
            })),
            shippingAddress: {
                address: formData.address,
                city: formData.city,
                postalCode: formData.zipCode,
                country: 'USA'
            },
            paymentMethod: method,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shipping,
            totalPrice: total,
            discountAmount: discount,
            discountCode: couponApplied?.code || ''
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data: createdOrder } = await axios.post(`${API_URL}/api/orders`, orderData, config);
        return { createdOrder, config };
    }

    const handleCODOrder = async () => {
        try {
            await createOrder('COD');

            // Notify Admin via Web3Forms (Client-side)
            await sendWeb3FormsEmail({
                subject: `New COD Order - Sweet Delights`,
                fromName: 'Sweet Delights Checkout',
                fields: {
                    order_type: 'Cash on Delivery',
                    customer_name: `${formData.firstName} ${formData.lastName}`,
                    customer_email: formData.email,
                    total_amount: `₹${total}`,
                    items: cartItems.map(i => `${i.name} (x${i.quantity})`).join(', '),
                    address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}`,
                    date: new Date().toLocaleString()
                }
            });

            clearCart();
            toast.success('Order placed successfully! Cash on Delivery selected.', { icon: '🎉' });
            navigate('/');
        } catch (error) {
            console.error('COD Order creation failed:', error);
            toast.error('Order creation failed. Please check your details.');
        }
    };

    const handlePaymentSuccess = async (paymentResponse) => {
        try {
            // 1. Create Order in DB (Not Paid)
            const { createdOrder, config } = await createOrder('Razorpay');

            // 2. Verify Payment (Update Order to Paid)
            await axios.post(`${API_URL}/api/payment/verify`, {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                order_id: createdOrder._id
            }, config);

            // Notify Admin via Web3Forms (Client-side)
            await sendWeb3FormsEmail({
                subject: `New Paid Order - Sweet Delights`,
                fromName: 'Sweet Delights Checkout',
                fields: {
                    order_type: 'Online Payment (Razorpay)',
                    customer_name: `${formData.firstName} ${formData.lastName}`,
                    customer_email: formData.email,
                    total_amount: `₹${total}`,
                    items: cartItems.map(i => `${i.name} (x${i.quantity})`).join(', '),
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    date: new Date().toLocaleString()
                }
            });

            clearCart();
            toast.success('Payment successful! Your sweet order is renewed.', { icon: '🎉' });
            navigate('/');
        } catch (error) {
            console.error('Order creation/verification failed:', error);
            toast.error('Order processing failed. Please contact support if money was deducted.');
        }
    };

    const handlePaymentFailure = (error) => {
        console.error('Payment Failed', error);
        toast.error('Payment Failed. Please try again.', { icon: '⚠️' });
    };

    if (cartItems.length === 0) {
        return (
            <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-8">
                    <h1 className="text-3xl font-bold mb-4 text-text-light dark:text-text-dark">Your Cart is Empty</h1>
                    <Link to="/" className="text-primary hover:underline">Go back to Home</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2 text-text-light dark:text-text-dark">Checkout</h1>
                        <div className="flex items-center gap-2 text-sm text-text-light/60 dark:text-text-dark/60">
                            <Link to="/cart" className="hover:text-primary">Cart</Link>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                            <span className="text-text-light dark:text-text-dark font-medium">Checkout</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Contact Info */}
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-surface-light dark:border-surface-dark/50 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-light dark:text-text-dark">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                                    Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-surface-light dark:border-surface-dark/50 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-light dark:text-text-dark">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                            placeholder="123 Sweet Street"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                                placeholder="NY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-light/70 dark:text-text-dark/70">ZIP Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="w-full rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-text-light dark:text-text-dark"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 border border-surface-light dark:border-surface-dark/50 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-text-light dark:text-text-dark">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-primary bg-primary/5' : 'border-surface-light dark:border-surface-dark/50'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Online"
                                            checked={paymentMethod === 'Online'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-3 font-medium text-text-light dark:text-text-dark">Online Payment (Cards, UPI, NetBanking)</span>
                                    </label>
                                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-surface-light dark:border-surface-dark/50'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-3 font-medium text-text-light dark:text-text-dark">Cash on Delivery</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-surface-light dark:border-surface-dark/50 p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-6 text-text-light dark:text-text-dark">Order Summary</h2>

                                {/* Cart Items Preview */}
                                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id || item._id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-md bg-surface-light dark:bg-surface-dark/50 overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-text-light dark:text-text-dark line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-text-light/60 dark:text-text-dark/60">Qty: {item.quantity}</p>
                                                <p className="text-sm font-medium text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-surface-light dark:border-surface-dark/50 my-4"></div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70">
                                        <span>Shipping</span>
                                        <span>₹{shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70">
                                        <span>Tax</span>
                                        <span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-light/70 dark:text-text-dark/70 font-bold text-accent">
                                        <span>Discount {couponApplied && `(${couponApplied.code})`}</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-surface-light dark:border-surface-dark/50 pt-3 flex justify-between font-bold text-lg text-text-light dark:text-text-dark">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Coupon Input */}
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Promo Code"
                                            className="flex-1 rounded-lg border-surface-light dark:border-surface-dark/50 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-sm uppercase"
                                            disabled={couponApplied}
                                        />
                                        <button
                                            onClick={couponApplied ? () => { setCouponApplied(null); setDiscount(0); setCouponCode(''); } : handleApplyCoupon}
                                            disabled={isApplyingCoupon || (!couponCode && !couponApplied)}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${couponApplied
                                                ? 'bg-error/10 text-error hover:bg-error/20'
                                                : 'bg-accent/10 text-accent hover:bg-accent/20'}`}
                                        >
                                            {isApplyingCoupon ? '...' : (couponApplied ? 'Remove' : 'Apply')}
                                        </button>
                                    </div>
                                </div>

                                {paymentMethod === 'Online' ? (
                                    <>
                                        <RazorpayButton
                                            amount={total}
                                            onSuccess={handlePaymentSuccess}
                                            onFailure={handlePaymentFailure}
                                            user={user}
                                        />
                                        <p className="text-xs text-center text-text-light/50 dark:text-text-dark/50 mt-4">
                                            Secure Payment via Razorpay
                                        </p>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleCODOrder}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                                    >
                                        Place Order (COD)
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
