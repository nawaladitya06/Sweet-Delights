import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollytellingVisuals = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scenes = [
        {
            title: "Signature Masterpieces",
            subtitle: "The Art of Celebration",
            description: "Handcrafted cakes designed to turn your most precious moments into unforgettable memories.",
            video: "/visuals/cake.mp4",
            accent: "text-accent"
        },
        {
            title: "Miniature Magic",
            subtitle: "Gourmet Bites of Joy",
            description: "Indulge in our artisanal cupcakes—where intense flavors meet delicate, world-class craftsmanship.",
            video: "/visuals/cupcake.mp4",
            accent: "text-primary"
        }
    ];

    const nextScene = () => setActiveIndex((prev) => (prev + 1) % scenes.length);
    const prevScene = () => setActiveIndex((prev) => (prev - 1 + scenes.length) % scenes.length);

    // Auto-play timer
    useEffect(() => {
        const timer = setInterval(nextScene, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[85vh] md:h-screen w-full bg-black overflow-hidden">
            {/* Background Videos */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full"
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-[1.02]"
                    >
                        <source src={scenes[activeIndex].video} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlays */}
            <div className="relative z-20 h-full w-full flex items-center px-6 md:px-20 pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-4xl"
                    >
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${scenes[activeIndex].accent} text-lg md:text-2xl font-display uppercase tracking-[0.4em] mb-4 font-bold`}
                        >
                            {scenes[activeIndex].title}
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-5xl md:text-8xl font-black font-display text-white mb-6 leading-none tracking-tighter"
                        >
                            {scenes[activeIndex].subtitle.split(' ').map((word, i) => (
                                <span key={i} className="inline-block mr-4">{word}</span>
                            ))}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white/70 text-lg md:text-2xl font-light tracking-wide max-w-xl leading-relaxed italic"
                        >
                            {scenes[activeIndex].description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Split-Screen Navigation Overlays */}
            <div className="absolute inset-0 z-40 flex pointer-events-none">
                <div
                    onClick={prevScene}
                    className="flex-1 pointer-events-auto cursor-w-resize group relative"
                    title="Previous Scene"
                >
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div
                    onClick={nextScene}
                    className="flex-1 pointer-events-auto cursor-e-resize group relative"
                    title="Next Scene"
                >
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            </div>

            {/* Scene Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-4 items-center">
                {scenes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className="group relative flex flex-col items-center"
                    >
                        <div className={`h-[2px] w-8 md:w-16 transition-all duration-500 rounded-full ${index === activeIndex ? 'bg-accent' : 'bg-white/20'}`} />
                        <span className={`text-[10px] mt-2 font-display uppercase tracking-widest transition-opacity duration-300 ${index === activeIndex ? 'opacity-100 text-accent' : 'opacity-0'}`}>
                            0{index + 1}
                        </span>
                    </button>
                ))}
            </div>

            {/* Bottom Gradient for Smooth Transition */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent z-10" />
        </section>
    );
};

export default ScrollytellingVisuals;
