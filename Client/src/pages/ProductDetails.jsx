import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Check, Star, Shield, Truck, RefreshCw, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { findProductById } from '../api/productService';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await findProductById(id);
                setProduct(data);
                if (data.color) setSelectedColor(data.color);
            } catch (err) {
                setError("Product not found or failed to load");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart({
            ...product,
            id: product._id, // Ensure ID consistency
            name: product.title,
            image: product.imageUrl,
            color: selectedColor,
            size: selectedSize
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-accent mb-4" size={48} />
            <p className="text-secondary font-medium italic">Unveiling precision...</p>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Discovery Error.</h1>
            <p className="text-secondary mb-8">{error || "The piece you're looking for isn't here."}</p>
            <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-xl font-bold">Return to Store</Link>
        </div>
    );


    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 md:px-10 mb-32">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-[13px] font-medium text-secondary/60 mb-10">
                    <Link to="/shop" className="hover:text-black">Store</Link>
                    <ChevronRight size={14} />
                    <Link to={`/shop/${product.category?.name?.toLowerCase() || 'collections'}`} className="hover:text-black">{product.category?.name || 'Collections'}</Link>
                    <ChevronRight size={14} />
                    <span className="text-black">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Media Gallery */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="aspect-[4/5] bg-gray-50 rounded-[40px] overflow-hidden flex items-center justify-center p-12 group"
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
                            />
                        </motion.div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="aspect-square bg-gray-50 rounded-[32px] overflow-hidden">
                                <img src={product.imageUrl} alt="detail 1" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
                            </div>
                            <div className="aspect-square bg-gray-50 rounded-[32px] overflow-hidden">
                                <img src={product.imageUrl} alt="detail 2" className="w-full h-full object-cover opacity-60 mix-blend-multiply scale-x-[-1]" />
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-5 flex flex-col pt-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-10 sticky top-32"
                        >
                            <header>
                                <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-4">Aura {product.brand}</p>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">{product.title}</h1>
                                <div className="flex items-center space-x-4 mt-4">
                                    <p className="text-2xl font-bold text-primary">${product.discountedPrice}</p>
                                    {product.discountPersent > 0 && (
                                        <p className="text-lg text-secondary line-through">${product.price}</p>
                                    )}
                                </div>
                            </header>

                            <div className="space-y-8">
                                {/* Color Picker */}
                                <div>
                                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-secondary/60 mb-4">Color — {product.color}</h3>
                                    <div className="flex space-x-3">
                                        <button
                                            className="w-10 h-10 rounded-full border-2 p-1 border-accent"
                                        >
                                            <div className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: product.color?.toLowerCase() || '#000' }} />
                                        </button>
                                    </div>
                                </div>

                                {/* Size Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-secondary/60">Select Size</h3>
                                        <button className="text-[11px] font-bold text-accent hover:underline">Size Guide</button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.sizes?.map(sizeObj => (
                                            <button
                                                key={sizeObj.name}
                                                disabled={sizeObj.quantity <= 0}
                                                onClick={() => setSelectedSize(sizeObj.name)}
                                                className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedSize === sizeObj.name
                                                    ? 'bg-black text-white border-black'
                                                    : sizeObj.quantity > 0
                                                        ? 'bg-white text-primary border-gray-100 hover:border-black'
                                                        : 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                {sizeObj.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                {/* Purchase Actions */}
                                <div className="space-y-4 pt-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-xl ${added ? 'bg-green-600 text-white shadow-green-200' : 'bg-black text-white shadow-black/10 hover:bg-gray-900'
                                            }`}
                                    >
                                        {added ? (
                                            <>
                                                <Check size={20} strokeWidth={3} />
                                                <span>Added to Bag</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag size={20} />
                                                <span>Add to Bag</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[11px] text-center text-secondary font-medium">Free delivery and returns available on all orders.</p>
                                </div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-gray-100">
                                <div className="space-y-2">
                                    <Truck size={20} className="text-secondary" />
                                    <p className="text-sm font-bold">Fast Delivery</p>
                                    <p className="text-xs text-secondary leading-relaxed">2-4 business days worldwide.</p>
                                </div>
                                <div className="space-y-2">
                                    <RefreshCw size={20} className="text-secondary" />
                                    <p className="text-sm font-bold">Free Returns</p>
                                    <p className="text-xs text-secondary leading-relaxed">30-day no-hassle returns.</p>
                                </div>
                                <div className="space-y-2">
                                    <Shield size={20} className="text-secondary" />
                                    <p className="text-sm font-bold">Secure Payment</p>
                                    <p className="text-xs text-secondary leading-relaxed">Encrypted checkout process.</p>
                                </div>
                                <div className="space-y-2">
                                    <Star size={20} className="text-secondary" />
                                    <p className="text-sm font-bold">Premium Quality</p>
                                    <p className="text-xs text-secondary leading-relaxed">Crafted from top-tier materials.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Description Body */}
                <div className="mt-32 max-w-3xl border-t border-gray-100 pt-20">
                    <h2 className="text-3xl font-bold mb-8 tracking-tight">Product Details.</h2>
                    <div className="prose prose-lg text-secondary space-y-6 font-medium leading-loose">
                        <p>{product.description}</p>
                        <p>
                            Meticulously engineered for excellence, the {product.title} embodies Aura's commitment to minimalist performance.

                            Combining traditional craftsmanship with futuristic materials, we've created a piece that's ready for any environment.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
