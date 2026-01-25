import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentProduct, setCurrentProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Cakes',
        description: '',
        image: '',
        countInStock: 0
    });
    const [uploading, setUploading] = useState(false);

    const categories = ['Cakes', 'Cupcakes', 'Cookies', 'Macarons', 'Pies', 'Other', 'Custom'];

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', price: '', category: 'Cakes', description: '', image: '', countInStock: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            countInStock: product.countInStock
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            if (modalMode === 'add') {
                const { data } = await axios.post(`${API_URL}/api/products`, formData, config);
                setProducts([...products, data]);
                toast.success('Product created successfully');
            } else {
                const { data } = await axios.put(`${API_URL}/api/products/${currentProduct._id}`, formData, config);
                setProducts(products.map(p => p._id === data._id ? data : p));
                toast.success('Product updated successfully');
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                await axios.delete(`${API_URL}/api/products/${id}`, config);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Config is overridden by browser for FormData but good practice to be explicit or let axios handle boundary
                },
            };

            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);

            // Backend returns path like /uploads/image.jpg. We need full URL for frontend to display
            const fullUrl = `${API_URL}${data}`;

            setFormData(prev => ({ ...prev, image: fullUrl }));
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted">Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">Product Management</h2>
                    <div className="text-sm text-text-muted">Total Products: {products.length}</div>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass overflow-hidden rounded-xl border border-accent/10 group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
                                <span className="font-bold text-accent">${product.price}</span>
                            </div>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-accent/10">
                                <span className="text-xs text-text-primary-light dark:text-text-primary-dark flex items-center gap-1">
                                    Stock: {product.countInStock}
                                    {product.countInStock > 0 && product.countInStock < 5 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full animate-pulse">
                                            <span className="material-symbols-outlined text-xs">warning</span>
                                            Low Stock
                                        </span>
                                    )}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="p-2 hover:bg-accent/10 rounded-lg text-primary dark:text-secondary-dark transition-colors"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-background-dark w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-accent/20 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-accent/10 flex justify-between items-center bg-accent/5">
                                <h3 className="text-xl font-serif font-bold text-primary dark:text-accent">
                                    {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-error transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                            value={formData.price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
                                        <select
                                            name="category"
                                            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-1">Count In Stock</label>
                                        <input
                                            type="number"
                                            name="countInStock"
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none"
                                            value={formData.countInStock}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted tracking-wider">Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none transition-colors"
                                            placeholder="Enter URL or upload image"
                                        />
                                        <label className="cursor-pointer bg-accent/10 hover:bg-accent/20 text-accent rounded-lg px-4 py-2 flex items-center gap-2 transition-colors whitespace-nowrap">
                                            <span className="material-symbols-outlined">upload_file</span>
                                            <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload'}</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={uploadFileHandler}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    {formData.image && (
                                        <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-black/20">
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows="4"
                                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-black/20 border border-accent/20 focus:border-accent outline-none resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="pt-4 flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-text-muted hover:bg-accent/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary px-6 py-2"
                                    >
                                        {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;
