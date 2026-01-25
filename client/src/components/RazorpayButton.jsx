import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const RazorpayButton = ({ amount, onSuccess, onFailure, user }) => {
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order on Backend (Razorpay Order)
            const { data: order } = await axios.post(`${API_URL}/api/payment/orders`, { amount }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // 2. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Sweet Delights",
                description: "Order Payment",
                image: "https://example.com/your_logo",
                order_id: order.id,
                handler: function (response) {
                    // Just pass the response back to parent for verification
                    onSuccess(response);
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#d62828"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            onFailure(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
        >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
            {!loading && <span className="material-symbols-outlined">credit_card</span>}
        </button>
    );
};

export default RazorpayButton;
