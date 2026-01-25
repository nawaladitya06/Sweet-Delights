import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    // Check if user exists and has admin role
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
        return children;
    }

    // Redirect to home if not authorized
    return <Navigate to="/home" replace />;
};

export default AdminRoute;
