import React, { useState } from 'react';
import axios from 'axios';
import { Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState({
        imageUrl: '',
        brand: '',
        title: '',
        color: '',
        quantity: '',
        price: '',
        discountedPrice: '',
        discountPersent: '',
        topLavelCategory: '',
        secondLavelCategory: '',
        thirdLavelCategory: '',
        description: '',
    });

    const [sizes, setSizes] = useState([
        { name: 'S', quantity: 0 },
        { name: 'M', quantity: 0 },
        { name: 'L', quantity: 0 },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeChange = (index, value) => {
        const newSizes = [...sizes];
        newSizes[index].quantity = value;
        setSizes(newSizes);
    };

    const addSize = () => {
        setSizes([...sizes, { name: '', quantity: 0 }]);
    };

    const removeSize = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const jwt = localStorage.getItem('jwt');

            // Format sizes and filter out empty ones
            const formattedSizes = sizes
                .filter(s => s.name.trim() !== '' && s.quantity > 0)
                .map(s => ({
                    name: s.name,
                    quantity: Number(s.quantity)
                }));

            const payload = {
                title: productData.title,
                description: productData.description,
                price: Number(productData.price),
                discountedPrice: Number(productData.discountedPrice),
                discountPersent: Number(productData.discountPersent),
                quantity: Number(productData.quantity),
                brand: productData.brand,
                color: productData.color,
                imageUrl: productData.imageUrl,
                topLavelCategory: productData.topLavelCategory,
                secondLavelCategory: productData.secondLavelCategory,
                thirdLavelCategory: productData.thirdLavelCategory,
                size: formattedSizes
            };

            console.log("SENDING PAYLOAD: ", payload);

            await axios.post('http://localhost:3000/api/admin/products', payload, {
                headers: { Authorization: `Bearer ${jwt}` }
            });

            alert('Product added successfully!');
            navigate('/admin/products');
        } catch (error) {
            console.error('Failed to add product', error);
            const errorMsg = error.response?.data?.error || error.message;
            alert(`Error adding product: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-sm font-medium text-gray-700">Product Title *</label>
                                <input
                                    type="text" required name="title" value={productData.title} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="e.g. Premium Cotton Shirt"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Brand *</label>
                                <input
                                    type="text" required name="brand" value={productData.brand} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. Zara"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium text-gray-700">Description *</label>
                                <textarea
                                    required name="description" value={productData.description} onChange={handleChange} rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="Describe the product details and material..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                            Pricing & Inventory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                                <input
                                    type="number" required name="price" value={productData.price} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Discounted Price *</label>
                                <input
                                    type="number" required name="discountedPrice" value={productData.discountedPrice} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Discount Percent *</label>
                                <input
                                    type="number" required name="discountPersent" value={productData.discountPersent} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. 20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Total Quantity *</label>
                                <input
                                    type="number" required name="quantity" value={productData.quantity} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categorization & Visuals */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center border-b pb-2">
                            Categorization & Visuals
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Top-Level Category *</label>
                                <input
                                    type="text" required name="topLavelCategory" value={productData.topLavelCategory} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. Men"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Second-Level Category *</label>
                                <input
                                    type="text" required name="secondLavelCategory" value={productData.secondLavelCategory} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. Clothing"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Third-Level Category *</label>
                                <input
                                    type="text" required name="thirdLavelCategory" value={productData.thirdLavelCategory} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. shirt"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Color *</label>
                                <input
                                    type="text" required name="color" value={productData.color} onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="e.g. White"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Image URL *</label>
                                <div className="flex items-center space-x-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ImageIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="url" required name="imageUrl" value={productData.imageUrl} onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    {productData.imageUrl && (
                                        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                                            <img src={productData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sizes Configuration */}
                    <div>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-900">Sizes Inventory</h2>
                            <button
                                type="button" onClick={addSize}
                                className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Add Size</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {sizes.map((size, index) => (
                                <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Size Name</label>
                                        <input
                                            type="text" value={size.name} onChange={(e) => {
                                                const newSizes = [...sizes];
                                                newSizes[index].name = e.target.value;
                                                setSizes(newSizes);
                                            }}
                                            placeholder="e.g. S, M, XL, 32, 34"
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Quantity</label>
                                        <input
                                            type="number" value={size.quantity} onChange={(e) => handleSizeChange(index, e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button" onClick={() => removeSize(index)}
                                        className="mt-6 p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {sizes.length === 0 && (
                                <p className="text-sm text-gray-500 italic text-center py-4 bg-gray-50 rounded border border-dashed border-gray-300">
                                    No specific sizes defined. Standard product quantities will be used.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="mr-3 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-70"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : 'Save Product'}</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;
