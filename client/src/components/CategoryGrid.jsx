import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
    return (
        <section className="w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
                <h2 className="text-3xl md:text-5xl font-bold font-display text-center pb-8 md:pb-16 text-text-light dark:text-text-dark">Explore Our Treats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
                    {/* Cakes Category */}
                    <div className="relative flex flex-col justify-end p-8 md:p-12 aspect-[4/5] md:aspect-[16/9] rounded-3xl overflow-hidden group shadow-2xl">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 scale-[1.02] group-hover:scale-110"
                        >
                            <source src="/visuals/cake.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                        <div className="relative z-10">
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-display mb-2">Signature Cakes</h3>
                            <Link to="/products?category=Cakes" className="btn-primary inline-flex items-center">
                                Shop Collection <span className="material-symbols-outlined ml-2">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {/* Cupcakes Category */}
                    <div className="relative flex flex-col justify-end p-8 md:p-12 aspect-[4/5] md:aspect-[16/9] rounded-3xl overflow-hidden group shadow-2xl">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 scale-[1.02] group-hover:scale-110"
                        >
                            <source src="/visuals/cupcake.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                        <div className="relative z-10">
                            <h3 className="text-white text-3xl md:text-4xl font-bold font-display mb-2">Gourmet Cupcakes</h3>
                            <Link to="/products?category=Cupcakes" className="btn-secondary inline-flex items-center">
                                Browse Treats <span className="material-symbols-outlined ml-2">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-12 md:mt-20">
                    <div className="animate-bounce">
                        <span className="material-symbols-outlined text-4xl text-primary/50">keyboard_arrow_down</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
