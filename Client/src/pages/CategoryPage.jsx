import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { findProducts } from '../api/productService';

const BRANDS = ['Aura', 'DenimCo', 'Premium', 'Formal', 'MiniAura'];
const COLORS = ['Black', 'White', 'Gray', 'Beige', 'Navy', 'Blue', 'Burgundy', 'Red'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', '4Y', '6Y', '8Y'];
const DISCOUNTS = [
    { label: 'Any Discount', min: 1 },
    { label: '10% Off or more', min: 10 },
    { label: '20% Off or more', min: 20 },
];
const SORT_OPTIONS = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
    { label: 'Newest Arrivals', value: 'newest' },
];

export default function CategoryPage() {
    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const searchFromUrl = searchParams.get('search') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [minDiscount, setMinDiscount] = useState(0);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [sortOption, setSortOption] = useState('recommended');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const query = {
                    category: category,
                    color: selectedColors.join(','),
                    size: selectedSizes.join(','),
                    minDiscount: minDiscount,
                    sort: sortOption === 'recommended' ? '' : sortOption,
                    stock: showOnlyInStock ? 'in_stock' : '',
                    search: searchFromUrl,
                    pageSize: 50
                };
                const data = await findProducts(query);
                setProducts(data.content || []);
            } catch (err) {
                setError("Failed to load products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [category, selectedColors, selectedSizes, minDiscount, showOnlyInStock, sortOption, searchFromUrl]);


    const toggleFilter = (item, state, setState) => {
        setState(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const activeFilterCount = selectedBrands.length + selectedColors.length + selectedSizes.length + (minDiscount > 0 ? 1 : 0) + (showOnlyInStock ? 1 : 0);

    const clearAll = () => {
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setMinDiscount(0);
        setShowOnlyInStock(false);
    };


    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{categoryTitle}'s.</h1>
                    <p className="text-xl text-secondary font-medium">Precision-crafted essentials for {categoryTitle.toLowerCase()}.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <aside className="lg:w-72 flex-shrink-0 space-y-10">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center">
                                <Filter size={14} className="mr-2" /> Filters
                                {activeFilterCount > 0 && <span className="ml-2 bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{activeFilterCount}</span>}
                            </h3>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} className="text-[11px] font-bold text-accent hover:underline">Clear All</button>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-bold text-primary">In Stock Only</span>
                            <button
                                onClick={() => setShowOnlyInStock(!showOnlyInStock)}
                                className={`w-11 h-6 rounded-full transition-colors relative ${showOnlyInStock ? 'bg-black' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showOnlyInStock ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/60 mb-6">Brand</h4>
                            <div className="space-y-3">
                                {BRANDS.map(brand => (
                                    <label key={brand} className="flex items-center group cursor-pointer">
                                        <div
                                            onClick={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}
                                        >
                                            {selectedBrands.includes(brand) && <Check size={12} className="text-white" strokeWidth={4} />}
                                        </div>
                                        <span className="ml-3 text-[13px] font-medium text-secondary group-hover:text-black transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color Filter */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/60 mb-6">Color</h4>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}
                                        className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${selectedColors.includes(color) ? 'border-accent' : 'border-transparent'}`}
                                        title={color}
                                    >
                                        <div className="w-full h-full rounded-full border border-gray-100 shadow-inner" style={{ backgroundColor: color.toLowerCase() }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/60 mb-6">Size</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {SIZES.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                                        className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'border-gray-50 text-secondary hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Discount Filter */}
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/60 mb-6">Offers</h4>
                            <div className="space-y-3">
                                {DISCOUNTS.map(discount => (
                                    <label key={discount.label} className="flex items-center group cursor-pointer">
                                        <div
                                            onClick={() => setMinDiscount(minDiscount === discount.min ? 0 : discount.min)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${minDiscount === discount.min ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}
                                        >
                                            {minDiscount === discount.min && <Check size={12} className="text-white" strokeWidth={4} />}
                                        </div>
                                        <span className="ml-3 text-[13px] font-medium text-secondary group-hover:text-black transition-colors">{discount.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-grow">
                        <div className="mb-10 flex justify-between items-center">
                            <p className="text-[11px] font-bold text-secondary/40 uppercase tracking-[0.2em]">{products.length} results</p>

                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center space-x-2 text-[13px] font-bold hover:text-accent transition-colors"
                                >
                                    <span>Sort By: {SORT_OPTIONS.find(o => o.value === sortOption).label}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isSortOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-premium border border-gray-50 p-2 z-20"
                                        >
                                            {SORT_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { setSortOption(option.value); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors ${sortOption === option.value ? 'bg-gray-50 text-accent' : 'hover:bg-gray-50'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="animate-spin text-accent mb-4" size={40} />
                                <p className="text-secondary font-medium">Curating the best for you...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-32">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id || product._id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 mb-32">
                                <p className="text-xl font-bold mb-2">No matching items.</p>
                                <p className="text-secondary text-sm font-medium">Try refining your filter criteria.</p>
                                <button onClick={clearAll} className="mt-6 text-accent font-bold hover:underline">Reset all filters</button>
                            </div>
                        )}
                    </main>

                </div>
            </div>
            <Footer />
        </div>
    );
}

