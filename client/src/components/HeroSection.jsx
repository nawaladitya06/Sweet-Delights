import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const navigate = useNavigate();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <section className="relative w-full py-12 md:py-20 overflow-hidden">
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-30 dark:opacity-20 transition-opacity duration-1000"
                >
                    <source src="/visuals/cake.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background-light/40 to-background-light dark:from-background-dark/40 dark:to-background-dark" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/4" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="text-center mb-16"
                >
                    <motion.h1
                        variants={item}
                        className="font-display text-4xl md:text-7xl font-bold mb-4 text-accent"
                    >
                        Create Your <span className="text-text-primary-light dark:text-text-primary-dark">Masterpiece</span>
                    </motion.h1>
                    <motion.p
                        variants={item}
                        className="text-xl text-text-secondary-light dark:text-text-secondary-dark font-light max-w-2xl mx-auto"
                    >
                        Design your dream dessert with our AI-powered studio or bring your own sketch to life.
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* AI Design Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="group relative overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark border border-accent/10 p-8 md:p-12 cursor-pointer shadow-lg hover:shadow-cherry-glow transition-all duration-300"
                        onClick={() => navigate('/customizer?mode=ai')}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-9xl text-accent">auto_awesome</span>
                        </div>
                        <div className="relative z-10">
                            <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl text-accent">auto_awesome</span>
                            </div>
                            <h3 className="text-2xl font-bold font-display text-text-primary-light dark:text-text-primary-dark mb-3">Design with AI</h3>
                            <p className="text-text-muted mb-8">Describe your dream cake and let our AI generate a stunning design for you instantly.</p>
                            <button className="btn-primary w-full sm:w-auto">
                                Start AI Design
                            </button>
                        </div>
                    </motion.div>

                    {/* Upload Design Card */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="group relative overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark border border-accent/10 p-8 md:p-12 cursor-pointer shadow-lg hover:shadow-cherry-glow transition-all duration-300"
                        onClick={() => navigate('/customizer?mode=upload')}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-9xl text-text-secondary-light dark:text-text-secondary-dark">cloud_upload</span>
                        </div>
                        <div className="relative z-10">
                            <div className="h-16 w-16 rounded-2xl bg-secondary/10 dark:bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">cloud_upload</span>
                            </div>
                            <h3 className="text-2xl font-bold font-display text-text-primary-light dark:text-text-primary-dark mb-3">Upload Your Design</h3>
                            <p className="text-text-muted mb-8">Have a sketch or inspiration photo? Upload it here and we'll bring it to life.</p>
                            <button className="btn-secondary w-full sm:w-auto">
                                Upload Design
                            </button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-center mt-16"
                >
                    <p className="text-text-muted mb-4">Or choose from our signature collection</p>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <span className="material-symbols-outlined text-3xl text-primary">keyboard_arrow_down</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
