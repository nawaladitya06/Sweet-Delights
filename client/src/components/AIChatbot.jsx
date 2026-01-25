import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_BASE = [
    { keywords: ['delivery', 'ship', 'when'], answer: "We deliver happiness daily from 9 AM to 8 PM! Most local orders arrive within 2-4 hours. 🚚" },
    { keywords: ['custom', 'design', 'my own'], answer: "Yes! Use our 'Design' tool in the menu to build your dream cake, or contact us for complex requests. 🎂" },
    { keywords: ['eggless', 'vegan', 'allergy'], answer: "We offer eggless and gluten-free options for most of our cakes! Just check the product details or mention it in your order. 🌱" },
    { keywords: ['price', 'cost', 'expensive'], answer: "Our prices start as low as ₹199 for cupcakes. Quality ingredients are our priority! 💰" },
    { keywords: ['location', 'where', 'shop'], answer: "We are a virtual bakery, which means we bake fresh and deliver straight to your door. No physical store, just pure convenience! 🏠" },
    { keywords: ['cancel', 'refund'], answer: "Orders can be cancelled up to 24 hours before the delivery time for a full refund. ↩️" },
];

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hello! I'm your Sweet Assistant. How can I make your day sweeter today? 🍰" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const query = input.toLowerCase();
            let response = "That's a great question! I'm not sure about that specifically, but you can always contact our human bakers at support@sweetdelights.com! 👩‍🍳";

            for (const item of KNOWLEDGE_BASE) {
                if (item.keywords.some(k => query.includes(k))) {
                    response = item.answer;
                    break;
                }
            }

            setMessages(prev => [...prev, { role: 'ai', text: response }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] glass rounded-3xl shadow-2xl border border-accent/20 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-accent text-white flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Sweet Assistant</h3>
                                    <span className="text-[10px] opacity-70 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                        Online & Helpful
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background-light/50 dark:bg-background-dark/50">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'ai'
                                            ? 'bg-white dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark rounded-tl-none border border-accent/10'
                                            : 'bg-accent text-white rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-surface-dark p-3 rounded-2xl rounded-tl-none border border-accent/10 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/50 dark:bg-black/20 border-t border-accent/10 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about delivery, custom cakes..."
                                className="flex-1 bg-white dark:bg-background-dark border border-accent/10 rounded-full px-4 py-2 text-sm outline-none focus:border-accent transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent-hover transition-colors"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-colors relative ${isOpen ? 'bg-error text-white' : 'bg-accent text-white'
                    }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.span key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} className="material-symbols-outlined text-3xl">close</motion.span>
                    ) : (
                        <motion.span key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} className="material-symbols-outlined text-3xl">chat_bubble</motion.span>
                    )}
                </AnimatePresence>

                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white dark:border-background-dark"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default AIChatbot;
