import React from 'react';
import { motion } from 'framer-motion';

const SalesChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxRevenue = Math.max(...data.map(d => d.revenue), 100); // Min 100 for scale
    const chartHeight = 200;
    const chartWidth = 600;
    const barWidth = 40;
    const gap = 20;

    return (
        <div className="glass p-8 rounded-3xl border border-accent/10 mt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark font-serif">7-Day Revenue Trend</h3>
                    <p className="text-sm text-text-muted">Daily earnings overview</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-xs font-bold text-text-muted uppercase">Revenue (₹)</span>
                </div>
            </div>

            <div className="relative h-[220px] w-full flex items-end justify-between px-2">
                {data.map((day, i) => {
                    const barHeight = (day.revenue / maxRevenue) * chartHeight;
                    return (
                        <div key={i} className="flex flex-col items-center group relative flex-1">
                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: barHeight }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                                className="w-full max-w-[40px] bg-gradient-to-t from-accent/40 to-accent rounded-t-lg relative group-hover:from-accent group-hover:to-accent-hover transition-all shadow-cherry-glow/20"
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-dark text-accent text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-accent/20">
                                    ₹{day.revenue.toFixed(2)}
                                </div>
                            </motion.div>

                            {/* Date Label */}
                            <span className="text-[10px] font-bold text-text-muted mt-3 uppercase tracking-tighter">
                                {day.date}
                            </span>
                        </div>
                    );
                })}

                {/* Grid Lines */}
                <div className="absolute inset-0 -z-10 flex flex-col justify-between opacity-5">
                    <div className="border-t border-text-muted w-full"></div>
                    <div className="border-t border-text-muted w-full"></div>
                    <div className="border-t border-text-muted w-full"></div>
                    <div className="border-t border-text-muted w-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
