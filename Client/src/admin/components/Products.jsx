import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, Search, Filter, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // Filters & Pagination state
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [sort, setSort] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const jwt = localStorage.getItem('jwt');
            const params = new URLSearchParams({
                pageNumber: page,
                pageSize: 10
            });
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            if (stock) params.append('stock', stock);
            if (sort) params.append('sort', sort);

            const response = await axios.get(`http://localhost:3000/api/admin/products?${params.toString()}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });

            // The backend returns { content: [...], currentPage: X, totalPages: Y }
            setProducts(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, search, category, stock, sort]);

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const jwt = localStorage.getItem('jwt');
            await axios.delete(`http://localhost:3000/api/admin/products/${productId}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Error deleting product.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:bg-white transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
                    />
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="">All Categories</option>
                        <option value="mens_kurta">Mens Kurta</option>
                        <option value="jeans">Jeans</option>
                        <option value="shirts">Shirts</option>
                        <option value="women_dress">Women Dress</option>
                    </select>

                    <select
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="">Availability</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="">Sort By</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 text-center">
                                <th className="p-4 w-24">Image</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">No products found.</td>
                                </tr>
                            ) : (
                                products.map((product, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={product._id}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <td className="p-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                                {product.imageUrl ? (
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageOff size={20} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-left">
                                            <p className="font-medium text-gray-900 line-clamp-2">{product.title}</p>
                                            <p className="text-xs text-gray-500">{product.brand}</p>
                                        </td>
                                        <td className="p-4 text-left">
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                {product.category?.name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-semibold text-gray-900">₹{product.discountedPrices}</span>
                                                {product.price > product.discountedPrices && (
                                                    <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${product.quantity > 5 ? 'bg-green-50 text-green-600' : product.quantity > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                                {product.quantity} in stock
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                {/* Edit Button (Placeholder functionality) */}
                                                <button
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="Edit Product"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="p-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
