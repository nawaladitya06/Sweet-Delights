import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Define default options
                duration: 4000,
                style: {
                    background: '#FFF8E1', // surface-light (Cream)
                    color: '#3E2723',       // text-primary (Dark Chocolate)
                    border: '1px solid rgba(211, 47, 47, 0.1)', // accent/10
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                },
                // Default options for specific types
                success: {
                    duration: 4000,
                    iconTheme: {
                        primary: '#D32F2F', // accent (Cherry Red)
                        secondary: '#FFF',
                    },
                    style: {
                        background: '#FFF8E1',
                        border: '1px solid rgba(211, 47, 47, 0.2)',
                    }
                },
                error: {
                    duration: 5000,
                    iconTheme: {
                        primary: '#D32F2F', // accent
                        secondary: '#FFF',
                    },
                    style: {
                        background: '#FFF5F5',
                        border: '1px solid #FC8181',
                    }
                },
            }}
        />
    );
};

export default ToastProvider;
