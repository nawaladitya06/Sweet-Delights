import React from 'react';

const Skeleton = ({ className, height, width, circle = false }) => {
    const style = {
        height: height || '1rem',
        width: width || '100%',
        borderRadius: circle ? '50%' : '0.5rem',
    };

    return (
        <div
            className={`bg-accent/10 dark:bg-accent/5 animate-pulse ${className}`}
            style={style}
        />
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="glass p-4 rounded-2xl border border-accent/10 space-y-4">
            <Skeleton height="200px" className="rounded-xl" />
            <Skeleton width="60%" height="1.5rem" />
            <div className="flex justify-between items-center">
                <Skeleton width="40%" height="1.25rem" />
                <Skeleton width="20%" height="1rem" />
            </div>
            <Skeleton height="3rem" className="rounded-xl" />
        </div>
    );
};

export const DashboardStatsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="glass p-6 rounded-2xl border border-accent/10">
                    <Skeleton width="50%" height="1rem" className="mb-4" />
                    <Skeleton width="80%" height="2.5rem" />
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
