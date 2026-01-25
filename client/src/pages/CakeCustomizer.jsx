import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../config';
import CartContext from '../context/CartContext';

// Static configuration moved outside component to prevent re-instantiation on every render
const COLOR_MAP = {
    'White': '#FFFFFF',
    'Pastel': '#FFD1DC',
    'Chocolate Brown': '#3D1C02',
    'Pink': '#FF69B4',
    'Blue': '#87CEEB',
    'Gold': '#D4AF37',
    'Black': '#1A1A1A',
    'Custom Palette': '#FFB7B2'
};

const CUSTOMIZER_OPTIONS = {
    productTypes: ['Cake', 'Cupcake', 'Mini Cake', 'Jar Cake', 'Cake Slice', 'Cupcake Box'],
    flavors: [
        { label: 'Classic Flavors', options: ['Vanilla', 'Chocolate', 'Strawberry', 'Butterscotch', 'Pineapple', 'Coffee', 'Lemon', 'Orange'] },
        { label: 'Premium / Gourmet', options: ['Red Velvet', 'Belgian Chocolate', 'Dark Chocolate', 'White Chocolate', 'Ferrero Rocher', 'Nutella', 'Salted Caramel', 'Mocha', 'Tiramisu'] },
        { label: 'Fruit-Based', options: ['Mango', 'Blueberry', 'Raspberry', 'Mixed Fruit', 'Black Forest', 'Kiwi', 'Passion Fruit'] },
        { label: 'Cheesecake', options: ['New York Classic', 'Mango Cheesecake', 'Blueberry Cheesecake', 'Strawberry Cheesecake', 'Chocolate Cheesecake'] },
        { label: 'Indian / Fusion', options: ['Rasmalai', 'Gulab Jamun', 'Kesar Pista', 'Rabdi', 'Gulkand'] },
    ],
    sponges: ['Soft Sponge', 'Moist Sponge', 'Light & Fluffy', 'Dense', 'Cheesecake Base', 'Brownie Base', 'Biscuit Base', 'Gluten-Free Sponge', 'Vegan Sponge'],

    // Split Options
    shapes: {
        Cake: ['Round', 'Square', 'Rectangle', 'Heart', 'Hexagon', 'Oval', 'Custom Shape'],
        Cupcake: ['Classic Round', 'Tall Swirl', 'Flat Top', 'Stuffed Center', 'Floral Design'],
        Other: ['Round', 'Square', 'Standard']
    },
    sizes: {
        Cake: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', 'Custom Weight'],
        Cupcake: ['Single', 'Pack of 4', 'Pack of 6', 'Pack of 12', 'Pack of 24'],
        Other: ['Standard', 'Large', 'Small']
    },
    layers: {
        Cake: ['Single Layer', 'Double Layer', 'Triple Layer', 'Multi-tier (2-tier)', 'Multi-tier (3-tier)'],
        Cupcake: ['Single Sponge', 'Filled Center', 'Dual-Flavored Core'],
        Other: ['Single', 'Double']
    },

    fillings: [
        { label: 'Cream', options: ['Fresh Cream', 'Whipped Cream', 'Bavarian Cream', 'Pastry Cream', 'Cream Cheese'] },
        { label: 'Chocolate', options: ['Chocolate Ganache', 'Dark Chocolate Ganache', 'White Chocolate Ganache', 'Nutella'] },
        { label: 'Fruit', options: ['Mango Compote', 'Strawberry Compote', 'Blueberry Compote', 'Mixed Fruit Jam'] },
        { label: 'Special', options: ['Caramel Sauce', 'Salted Caramel', 'Coffee Syrup', 'Hazelnut Spread'] },
    ],
    icings: ['Buttercream', 'Swiss Meringue Buttercream', 'Royal Icing', 'Whipped Cream', 'Fondant', 'Cream Cheese Frosting', 'Chocolate Glaze', 'Mirror Glaze'],
    finishes: ['Smooth Finish', 'Semi-Naked', 'Naked Cake', 'Textured Swirls', 'Rustic Finish', 'Sharp Edge Finish', 'Drip Style'],
    toppings: [
        { label: 'Fruits', options: ['Strawberries', 'Blueberries', 'Mango Cubes', 'Kiwi', 'Mixed Berries'] },
        { label: 'Chocolates', options: ['Chocolate Shavings', 'Chocolate Curls', 'Chocolate Chips', 'Chocolate Bars', 'Cocoa Powder'] },
        { label: 'Nuts', options: ['Almonds', 'Cashews', 'Pistachios', 'Hazelnuts', 'Walnuts'] },
        { label: 'Premium', options: ['Edible Gold Leaf', 'Edible Glitter', 'Sugar Pearls', 'Macarons', 'Marshmallows'] },
        { label: 'Sprinkles', options: ['Rainbow Sprinkles', 'Chocolate Drizzle', 'Caramel Drizzle', 'Fruit Sauce Drizzle'] }
    ],
    colors: ['White', 'Pastel', 'Chocolate Brown', 'Pink', 'Blue', 'Gold', 'Black', 'Custom Palette'],
    themes: ['Birthday', 'Anniversary', 'Wedding', 'Engagement', 'Baby Shower', 'Graduation', 'Corporate Event', 'Festival Special'],
    styles: ['Minimalist', 'Elegant', 'Luxury', 'Cartoon', 'Floral', 'Geometric', 'Rustic', 'Vintage'],
    dietary: ['Eggless', 'With Egg', 'Vegan', 'Sugar-Free', 'Gluten-Free', 'Keto'],
    views: [
        { id: 'Front View', icon: 'image' },
        { id: 'Isometric 3D', icon: 'view_in_ar' },
        { id: 'Top-Down / Flat Lay', icon: 'grid_view' },
        { id: 'Side Profile', icon: 'view_sidebar' },
        { id: 'Close-up Detail', icon: 'zoom_in' }
    ]
};

const CakeLivePreview = React.memo(({ config, photo }) => {
    const { productType, shape, layers, color, toppings } = config;

    const cakeColor = COLOR_MAP[color] || (productType === 'Cupcake' ? '#FFD1DC' : '#FFF5F8');

    // Helper for tier rendering
    const renderTier = (index, total) => {
        const width = 180 - (index * 40);
        const height = 50;
        const yBase = 200 - (index * 45);

        const isRound = shape === 'Round' || !shape;
        const isHeart = shape === 'Heart';
        const isSquare = shape === 'Square' || shape === 'Rectangle';

        if (isHeart) {
            return (
                <motion.path
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    d={`M ${width / 2 + 10} ${yBase} C ${width / 2 + 10} ${yBase - 20}, ${width + 10} ${yBase - 20}, ${width + 10} ${yBase} C ${width + 10} ${yBase + 20}, ${width / 2 + 10} ${yBase + 40}, ${width / 2 + 10} ${yBase + 40} C ${width / 2 + 10} ${yBase + 40}, 10 ${yBase + 20}, 10 ${yBase} C 10 ${yBase - 20}, ${width / 2 + 10} ${yBase - 20}, ${width / 2 + 10} ${yBase}`}
                    fill={cakeColor}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="1"
                    className="drop-shadow-md"
                />
            );
        }

        return (
            <motion.rect
                key={index}
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: yBase, opacity: 1 }}
                x={(200 - width) / 2}
                y={yBase}
                width={width}
                height={height}
                rx={isRound ? 25 : 4}
                fill={cakeColor}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
                className="drop-shadow-lg"
            />
        );
    };

    const getLayerCount = () => {
        if (layers.includes('3-tier')) return 3;
        if (layers.includes('2-tier')) return 2;
        if (layers.includes('Triple')) return 3;
        if (layers.includes('Double')) return 2;
        return 1;
    };

    return (
        <div className="w-64 h-64 relative flex items-center justify-center">
            <svg viewBox="0 0 200 250" className="w-full h-full filter drop-shadow-2xl">
                {/* Plate/Base */}
                <ellipse cx="100" cy="225" rx="90" ry="20" fill="rgba(255,255,255,0.8)" />
                <ellipse cx="100" cy="220" rx="85" ry="15" fill="rgba(255,255,255,1)" stroke="#eee" />

                {/* Cake Tiers */}
                <AnimatePresence mode="popLayout">
                    {[...Array(getLayerCount())].map((_, i) => renderTier(i, getLayerCount()))}
                </AnimatePresence>

                {/* Photo Placeholder if applicable */}
                {photo && (
                    <motion.rect
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        x="75" y={200 - (getLayerCount() * 45) + 10}
                        width="50" height="30"
                        fill="white" rx="2"
                        stroke="#ddd"
                    />
                )}

                {/* Toppings (Stylized particles) */}
                {toppings.length > 0 && (
                    <g>
                        {[...Array(8)].map((_, i) => (
                            <motion.circle
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                cx={60 + (i * 12)}
                                cy={200 - (getLayerCount() * 45) + (i % 2 === 0 ? 5 : 15)}
                                r="3"
                                fill={toppings.includes('Chocolates') ? '#4A2B0E' : '#FF69B4'}
                            />
                        ))}
                    </g>
                )}
            </svg>

            {/* Legend/Badges */}
            <div className="absolute -bottom-4 flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[8px] font-bold uppercase tracking-wider text-accent truncate max-w-[80px]">
                    {shape || 'Standard'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-bold uppercase tracking-wider text-primary truncate max-w-[80px]">
                    {color || 'Classic'}
                </span>
            </div>
        </div>
    );
});

const CakeCustomizer = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlMode = searchParams.get('mode'); // 'ai' or 'upload'

    // Internal mode state, synced with URL initially
    const [activeMode, setActiveMode] = useState(urlMode === 'upload' ? 'upload' : 'ai');

    // Update URL when mode changes
    useEffect(() => {
        setSearchParams({ mode: activeMode });
    }, [activeMode, setSearchParams]);

    // AI State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState(null); // Stores text result
    const [generatedImage, setGeneratedImage] = useState(null); // Stores placeholder image
    const [aiPhoto, setAiPhoto] = useState(null); // Stores the user's photo for the AI cake
    const [aiPhotoPreview, setAiPhotoPreview] = useState(null);

    // Manual Configuration State
    const [manualConfig, setManualConfig] = useState({
        productType: 'Cake', // Default to Cake
        flavor: '',
        sponge: '',
        shape: '',
        size: '',
        layers: '',
        filling: '',
        icing: '',
        finish: '',
        toppings: [],
        color: '',
        theme: '',
        designStyle: '',
        dietary: '',
        customText: '',
        viewPerspective: 'Isometric 3D' // Default view
    });

    // UI State for Tabs
    const [activeTab, setActiveTab] = useState('Build'); // Build, Flavor, Design, Decor

    const options = CUSTOMIZER_OPTIONS;

    const handleManualChange = (field, value) => {
        setManualConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleTopping = (topping) => {
        setManualConfig(prev => {
            const newToppings = prev.toppings.includes(topping)
                ? prev.toppings.filter(t => t !== topping)
                : [...prev.toppings, topping];
            return { ...prev, toppings: newToppings };
        });
    };
    const getFilteredOptions = (category) => {
        const type = manualConfig.productType;
        if (type.includes('Cupcake')) return options[category].Cupcake;
        if (type.includes('Cake')) return options[category].Cake;
        return options[category].Other || options[category].Cake;
    };

    const handleAiGenerate = async () => {
        setIsGenerating(true);
        setGeneratedResult(null);
        setGeneratedImage(null);

        try {
            // Construct Prompt
            const combinedPrompt = `
            A photorealistic, professional food photography shot of a custom ${manualConfig.productType || 'cake'}.
            Description: ${aiPrompt || 'A delicious, elegantly decorated cake'}

            Camera View: ${manualConfig.viewPerspective}

            Specifications:
            - Product: ${manualConfig.productType}
            - Shape: ${manualConfig.shape}
            - Size: ${manualConfig.size}
            - Layers: ${manualConfig.layers}
            - Sponge/Texture: ${manualConfig.sponge}
            - Dietary: ${manualConfig.dietary}

            Flavor Profile:
            - Flavor: ${manualConfig.flavor}
            - Filling: ${manualConfig.filling}

            Exterior & Design:
            - Icing: ${manualConfig.icing}
            - Finish: ${manualConfig.finish}
            - Color Theme: ${manualConfig.color}
            - Design Style: ${manualConfig.designStyle}
            - Theme/Occasion: ${manualConfig.theme}

            Decorations:
            - Toppings: ${manualConfig.toppings.join(', ')}
            ${manualConfig.customText ? `- Custom Text: "${manualConfig.customText}"` : ''}
            ${aiPhoto ? '- Style: Photo Cake, with a large square edible photo print prominently placed on the flat top surface or side.' : ''}

            Photography:
            - View: ${manualConfig.viewPerspective} (${manualConfig.viewPerspective === 'Top-Down / Flat Lay' ? 'Flat lay, table top view' : '3D render, depth of field'})
            - Lighting: Studio lighting, appetizing, high resolution, soft shadows, sharp focus.
            `;

            console.log("Requesting Bytez generation with prompt:", combinedPrompt);

            const response = await axios.post(`${API_URL}/api/image/generate`, {
                prompt: combinedPrompt
            });

            const imageUrl = response.data.output;
            console.log("Image URL received:", imageUrl);
            setGeneratedImage(imageUrl);
            toast.success("Your masterpiece is ready! ✨", { icon: '🎨' });

        } catch (error) {
            console.error("Bytez Generation Error:", error);

            if (error.response && error.response.data && error.response.data.error) {
                const details = error.response.data.details ? `\nDetails: ${JSON.stringify(error.response.data.details)}` : '';
                toast.error(`Error: ${error.response.data.error}${details}`);
            } else {
                console.error("Full Error Object:", error);
                toast.error(`Error generating image. Please try again.`);
            }

            // Fallback for visual confirmation that UI works
            if (manualConfig.flavor && (manualConfig.flavor.includes('Chocolate') || aiPrompt.toLowerCase().includes('chocolate'))) {
                setGeneratedImage("https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop");
            } else {
                setGeneratedImage("https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1000&auto=format&fit=crop");
            }
            toast('Using fallback inspiration due to error.', { icon: '💡' });
        } finally {
            setIsGenerating(false);
        }
    };

    const renderModeSelector = () => (
        <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-surface-dark rounded-full p-1 shadow-inner flex gap-2 border border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveMode('ai')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeMode === 'ai' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
                >
                    AI Designer
                </button>
                <button
                    onClick={() => setActiveMode('upload')}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeMode === 'upload' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
                >
                    Upload Design
                </button>
            </div>
        </div>
    );

    const renderAiMode = () => (
        <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8">
                <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-accent">
                    AI Cake <span className="text-text-primary-light dark:text-text-primary-dark">Designer</span>
                </h1>
                <p className="text-text-muted max-w-2xl mx-auto">Describe your dream cake or select your preferences, and let our AI bring your vision to life.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col h-auto lg:h-[600px]">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-surface-light dark:bg-surface-dark rounded-xl mb-4 overflow-x-auto">
                        {['Build', 'Flavor', 'Design', 'Decor'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-white/50 dark:hover:bg-white/10'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>


                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-1">
                        {activeTab === 'Build' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-accent/10 shadow-lg space-y-4">
                                    <h3 className="font-bold text-lg text-secondary dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">cake</span> Base Structure
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                                Product Type
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.productType} onChange={(e) => handleManualChange('productType', e.target.value)}>
                                                <option value="">Select Type</option>
                                                {options.productTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">interests</span>
                                                Shape
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.shape} onChange={(e) => handleManualChange('shape', e.target.value)}>
                                                <option value="">Select Shape</option>
                                                {getFilteredOptions('shapes')?.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">straighten</span>
                                                Size
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.size} onChange={(e) => handleManualChange('size', e.target.value)}>
                                                <option value="">Select Size</option>
                                                {getFilteredOptions('sizes')?.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">layers</span>
                                                Layers / Structure
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.layers} onChange={(e) => handleManualChange('layers', e.target.value)}>
                                                <option value="">Select Layers</option>
                                                {getFilteredOptions('layers')?.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">texture</span>
                                                Texture / Sponge
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.sponge} onChange={(e) => handleManualChange('sponge', e.target.value)}>
                                                <option value="">Select Texture</option>
                                                {options.sponges.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">spa</span>
                                                Dietary Preference
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.dietary} onChange={(e) => handleManualChange('dietary', e.target.value)}>
                                                <option value="">Select Preference</option>
                                                {options.dietary.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Flavor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="glass p-5 rounded-2xl border border-accent/10 space-y-4">
                                    <h3 className="font-bold text-lg text-secondary dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">restaurant_menu</span> Taste Profile
                                    </h3>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">icecream</span>
                                            Flavor
                                        </label>
                                        <select className="input-field w-full" value={manualConfig.flavor} onChange={(e) => handleManualChange('flavor', e.target.value)}>
                                            <option value="">Select Flavor</option>
                                            {options.flavors.map((group, idx) => (
                                                <optgroup key={idx} label={group.label}>
                                                    {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">donut_small</span>
                                            Internal Filling
                                        </label>
                                        <select className="input-field w-full" value={manualConfig.filling} onChange={(e) => handleManualChange('filling', e.target.value)}>
                                            <option value="">Select Filling</option>
                                            {options.fillings.map((group, idx) => (
                                                <optgroup key={idx} label={group.label}>
                                                    {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Design' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="glass p-5 rounded-2xl border border-accent/10 space-y-4">
                                    <h3 className="font-bold text-lg text-secondary dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">palette</span> Exterior Look
                                    </h3>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">waves</span>
                                            Icing / Frosting
                                        </label>
                                        <select className="input-field w-full" value={manualConfig.icing} onChange={(e) => handleManualChange('icing', e.target.value)}>
                                            <option value="">Select Icing</option>
                                            {options.icings.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">brush</span>
                                            Frosting Finish
                                        </label>
                                        <select className="input-field w-full" value={manualConfig.finish} onChange={(e) => handleManualChange('finish', e.target.value)}>
                                            <option value="">Select Finish</option>
                                            {options.finishes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">palette</span>
                                                Color Theme
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.color} onChange={(e) => handleManualChange('color', e.target.value)}>
                                                <option value="">Select Color</option>
                                                {options.colors.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">style</span>
                                                Design Style
                                            </label>
                                            <select className="input-field w-full" value={manualConfig.designStyle} onChange={(e) => handleManualChange('designStyle', e.target.value)}>
                                                <option value="">Select Style</option>
                                                {options.styles.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">celebration</span>
                                            Theme / Occasion
                                        </label>
                                        <select className="input-field w-full" value={manualConfig.theme} onChange={(e) => handleManualChange('theme', e.target.value)}>
                                            <option value="">Select Theme</option>
                                            {options.themes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Decor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="glass p-5 rounded-2xl border border-accent/10 space-y-4">
                                    <h3 className="font-bold text-lg text-secondary dark:text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined">celebration</span> Decorations
                                    </h3>

                                    {/* Text Description for extra context */}
                                    <div className="bg-white/30 dark:bg-black/20 p-3 rounded-xl">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-primary">psychology</span>
                                            Additional Prompt Idea
                                        </label>
                                        <textarea
                                            className="w-full h-20 rounded-lg border-gray-200 dark:border-gray-700 bg-transparent p-2 text-sm focus:outline-none resize-none"
                                            placeholder="E.g., A woodland theme with mushrooms..."
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">grid_view</span>
                                            Toppings & Add-ons
                                        </label>
                                        <div className="space-y-4">
                                            {options.toppings.map((group, idx) => (
                                                <div key={idx}>
                                                    <h4 className="text-xs font-semibold text-primary mb-2">{group.label}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {group.options.map(topping => (
                                                            <button
                                                                key={topping}
                                                                onClick={() => toggleTopping(topping)}
                                                                className={`px-3 py-1 rounded-full text-xs transition-all border ${manualConfig.toppings.includes(topping) ? 'bg-primary text-white border-primary shadow-sm' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-text-muted'}`}
                                                            >
                                                                {topping}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">edit_note</span>
                                            Custom Message / Name
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field w-full mb-4"
                                            placeholder="E.g. Happy Birthday Aditya"
                                            value={manualConfig.customText}
                                            onChange={(e) => handleManualChange('customText', e.target.value)}
                                        />
                                    </div>

                                    {/* Photo Cake Option */}
                                    <div className="pt-4 border-t border-accent/10">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                                            Signature Photo Print (Optional)
                                        </label>

                                        {!aiPhotoPreview ? (
                                            <div
                                                onClick={() => document.getElementById('aiPhotoInput').click()}
                                                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-accent hover:bg-accent/5 transition-all cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-3xl text-text-muted mb-2">add_a_photo</span>
                                                <p className="text-[10px] text-text-muted">Upload a photo to be printed on your AI cake</p>
                                                <input
                                                    id="aiPhotoInput"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setAiPhoto(file);
                                                            setAiPhotoPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative group">
                                                <img src={aiPhotoPreview} alt="AI Photo Hint" className="w-full h-32 object-cover rounded-xl shadow-md" />
                                                <button
                                                    onClick={() => { setAiPhoto(null); setAiPhotoPreview(null); }}
                                                    className="absolute top-2 right-2 bg-error text-white h-8 w-8 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>
                                                <div className="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none" />
                                            </div>
                                        )}
                                        <p className="text-[10px] text-text-muted mt-2">Recommended for "Photo Cakes" or "Logo Cakes"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-accent/10">
                        <button
                            onClick={handleAiGenerate}
                            disabled={isGenerating}
                            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg shadow-cherry-glow hover:scale-[1.02] transition-transform"
                        >
                            {isGenerating ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined">refresh</span>
                                    Generating Design...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    Generate Cake Design
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-7 sticky top-28 h-fit">
                    <div className="bg-surface-light dark:bg-surface-dark p-4 md:p-8 rounded-3xl min-h-[400px] lg:min-h-[600px] flex flex-col items-center justify-start border border-dashed border-accent/20 relative overflow-hidden shadow-lg">
                        {generatedResult || generatedImage ? (
                            <div className="w-full h-full flex flex-col items-center">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-full flex flex-col items-center flex-1"
                                >
                                    {generatedImage && (
                                        <div className="relative w-full group">
                                            <img src={generatedImage} alt="AI Generated Cake" className="w-full max-h-[400px] object-cover rounded-xl shadow-2xl mb-6" />

                                            {/* Edible Photo Overlay (Visual Simulation) */}
                                            {aiPhotoPreview && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute inset-x-0 mx-auto w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-2xl overflow-hidden rounded-sm top-[20%] rotate-[-2deg] pointer-events-none"
                                                >
                                                    <img src={aiPhotoPreview} alt="Edible Print" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-white/10" /> {/* Sugar icing sheen */}
                                                </motion.div>
                                            )}

                                            {/* Download Button Overlay */}
                                            <a
                                                href={generatedImage}
                                                download={`my-cake-design-${Date.now()}.png`}
                                                className="absolute top-4 right-4 bg-white/90 text-secondary p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                                title="Download Image"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <span className="material-symbols-outlined">download</span>
                                            </a>
                                        </div>
                                    )}

                                    {/* View Perspective Selector - Moved Here */}
                                    <div className="w-full bg-white/50 dark:bg-black/20 p-4 rounded-xl mb-6 backdrop-blur-sm">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block text-center">Camera Perspective 📸</label>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {options.views.map(view => (
                                                <button
                                                    key={view.id}
                                                    onClick={() => handleManualChange('viewPerspective', view.id)}
                                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${manualConfig.viewPerspective === view.id ? 'bg-primary border-primary text-white' : 'border-transparent bg-white/50 dark:bg-black/20 text-text-muted hover:border-primary/20'}`}
                                                >
                                                    <span className="material-symbols-outlined text-xl mb-1">{view.icon}</span>
                                                    <span className="text-[9px] font-bold uppercase">{view.id.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full max-w-md mt-auto">
                                        <button onClick={handleUseDesign} className="btn-primary flex-1 py-3 font-bold shadow-cherry-glow">Order This Design</button>
                                        <button className="btn-secondary flex-1 py-3" onClick={() => { setGeneratedImage(null); setGeneratedResult(null); }}>Create New</button>
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full w-full">
                                <div className="text-center text-text-muted max-w-sm mt-10">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mb-6 h-[250px] flex items-center justify-center pt-8"
                                    >
                                        <CakeLivePreview config={manualConfig} photo={aiPhotoPreview} />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Ready to Create?</h3>
                                    <p className="mb-8">Describe your idea or select options on the left to generate your custom cake design.</p>

                                    {/* View Perspective Selector - Visible in Empty State too */}
                                    <div className="w-full bg-white/50 dark:bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Select Camera View</label>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {options.views.map(view => (
                                                <button
                                                    key={view.id}
                                                    onClick={() => handleManualChange('viewPerspective', view.id)}
                                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${manualConfig.viewPerspective === view.id ? 'bg-primary border-primary text-white' : 'border-transparent bg-white/50 dark:bg-black/20 text-text-muted hover:border-primary/20'}`}
                                                >
                                                    <span className="material-symbols-outlined text-xl mb-1">{view.icon}</span>
                                                    <span className="text-[9px] font-bold uppercase">{view.id.split(' ')[0]}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


    // Upload State
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleFileProcess(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileProcess(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileProcess = (file) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        setUploadedFile(file);
        setUploadPreview(URL.createObjectURL(file));
    };

    const removeUpload = () => {
        setUploadedFile(null);
        setUploadPreview(null);
    };

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleUseDesign = () => {
        if (!uploadedFile && !generatedImage) return;

        const imageToUse = uploadedFile ? uploadPreview : generatedImage;
        const isAi = !uploadedFile;

        // Convert generated image URL to base64 if needed, or just use URL if it's public
        // For simplicity in this demo, we'll try to use the URL/Blob directly if possible, 
        // but for uploaded files we need FileReader.

        const saveAndOrder = async (imageData) => {
            try {
                const token = localStorage.getItem('token'); // Might be null if guest

                // 1. Create Product in DB
                const productData = {
                    name: isAi ? `Custom AI Cake - ${manualConfig.theme || 'Special'}` : 'Custom User Design',
                    description: isAi
                        ? `AI Generated Design. Flavor: ${manualConfig.flavor}, Style: ${manualConfig.designStyle}, Prompt: ${aiPrompt}${aiPhoto ? ' (Includes Custom Edible Photo Print)' : ''}`
                        : 'Custom design uploaded by user',
                    price: aiPhoto ? 1800 : 1500, // Premium for photo print
                    category: 'Custom',
                    image: imageData,
                    countInStock: 1
                };

                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                // If user is guest, they might not be able to save to DB depending on our routes (we set it to 'protect')
                // For this demo, we'll try to save. If 401, we just add to cart locally.

                let savedProduct;
                try {
                    const { data } = await axios.post(`${API_URL}/api/products`, productData, config);
                    savedProduct = data;
                    toast.success('Design saved! Admin can now see this.');
                } catch (err) {
                    console.log("Could not save to DB (likely guest), adding to cart only.", err);
                    savedProduct = {
                        ...productData,
                        _id: `temp-${Date.now()}`
                    };
                }

                // 2. Add to Cart
                addToCart(savedProduct);

                if (window.confirm("Design added to cart! Proceed to checkout?")) {
                    navigate('/cart');
                }
            } catch (error) {
                console.error("Error processing design:", error);
                toast.error("Something went wrong");
            }
        };

        if (uploadedFile) {
            const reader = new FileReader();
            reader.onloadend = () => saveAndOrder(reader.result);
            reader.readAsDataURL(uploadedFile);
        } else {
            saveAndOrder(generatedImage);
        }
    };

    const renderContent = () => {
        if (activeMode === 'ai') {
            return renderAiMode();
        }

        if (activeMode === 'upload') {
            return (
                <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500">
                    <div className="text-center mb-8">
                        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-secondary dark:text-primary mb-4">Upload Your Design</h1>
                        <p className="text-text-muted max-w-2xl mx-auto">Have a sketch or inspiration photo? Upload it here and we'll bring it to life.</p>
                    </div>

                    {uploadPreview ? (
                        /* Reuse the Preview UI Layout */
                        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl min-h-[600px] flex flex-col items-center justify-start border border-dashed border-accent/20 relative overflow-hidden max-w-4xl mx-auto shadow-lg">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-full flex flex-col items-center w-full"
                            >
                                <img src={uploadPreview} alt="Uploaded Design" className="w-full max-h-[500px] object-contain rounded-xl shadow-2xl mb-8" />

                                <div className="flex gap-4 w-full max-w-md mt-auto">
                                    <button onClick={handleUseDesign} className="btn-primary flex-1 py-3 font-bold shadow-cherry-glow">Use This Design</button>
                                    <button className="btn-secondary flex-1 py-3" onClick={removeUpload}>Remove & Upload New</button>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Upload Box */
                        <div className="max-w-3xl mx-auto">
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('fileInput').click()}
                                className="bg-surface-light dark:bg-surface-dark p-16 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all cursor-pointer group flex flex-col items-center justify-center text-center space-y-4 hover:bg-accent/5 shadow-lg"
                            >
                                <div className="p-4 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-5xl text-primary">cloud_upload</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-primary dark:text-text-dark mb-1">Click to upload or drag and drop</h3>
                                    <p className="text-text-muted text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark transition-colors duration-300">
            <PageTitle title="Designer" />
            <Header />
            <main className="w-full px-4 sm:px-6 lg:px-8 py-10 flex-grow">
                {renderModeSelector()}
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default CakeCustomizer;
