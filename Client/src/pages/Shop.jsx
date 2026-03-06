import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ModalPreview from '../components/ModalPreview';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { findProducts } from '../api/productService';
import { useSearchParams } from 'react-router-dom';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchFromUrl = searchParams.get('search') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();

    const CATEGORIES = ['All', 'Men', 'Women', 'Kids'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    category: selectedCategory === 'All' ? '' : selectedCategory.toLowerCase(),
                    search: searchFromUrl,
                    pageSize: 50
                };
                const data = await findProducts(params);
                setProducts(data.content || []);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, searchFromUrl]);

    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Store.</h1>
                        <p className="text-xl text-secondary font-light">
                            {searchFromUrl ? `Results for "${searchFromUrl}"` : "The absolute best way to buy the clothes you love."}
                        </p>
                    </motion.div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-black transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search store"
                            value={searchFromUrl}
                            onChange={(e) => setSearchParams({ search: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-accent/10 transition-all outline-none text-sm placeholder:text-secondary/50"
                        />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto no-scrollbar pb-8 mb-4 border-b border-gray-100">
                    <span className="text-xs uppercase tracking-widest font-bold text-secondary/40 mr-4 whitespace-nowrap">Filter By</span>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-black text-white shadow-xl scale-105'
                                : 'bg-gray-50 text-secondary hover:bg-gray-100 active:scale-95'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-accent mb-4" size={40} />
                        <p className="text-secondary font-medium italic">Curating excellence...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <p className="text-[13px] text-secondary/60 font-medium">{products.length} Results</p>
                        </div>

                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 mb-32"
                        >
                            <AnimatePresence>
                                {products.map(product => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        key={product._id}
                                    >
                                        <ProductCard
                                            product={product}
                                            onClick={(p) => setSelectedProduct(p)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {products.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[40px] mb-32"
                            >
                                <div className="max-w-xs mx-auto text-center">
                                    <p className="text-xl font-bold mb-2">No results.</p>
                                    <p className="text-secondary mb-8 text-sm">Try searching for something else or clearing your filters.</p>
                                    <button
                                        onClick={() => { setSelectedCategory('All'); setSearchParams({}); }}
                                        className="aura-button-primary"
                                    >
                                        Clear all
                                    </button>

                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            <ModalPreview
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(p) => addToCart(p)}
            />


            <Footer />
        </div>
    );
}


