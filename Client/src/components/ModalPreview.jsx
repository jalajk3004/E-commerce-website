import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ModalPreview({ product, isOpen, onClose, onAddToCart }) {
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-gray-100 shadow-sm transition-all z-30"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-auto bg-gray-50 flex items-center justify-center p-8 md:p-12">
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={product.imageUrl || product.image}
                            alt={product.title || product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {/* Details Section - Scrollable */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col overflow-y-auto">
                        <div className="my-auto space-y-8">
                            <div>
                                <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3">{product.brand || 'New Exclusive'}</p>
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">{product.title || product.name}</h2>
                                <p className="text-2xl font-bold mt-4 text-primary">₹{product.discountedPrices || product.price}</p>
                            </div>

                            <div className="space-y-6">
                                <p className="text-secondary font-medium leading-relaxed">
                                    A masterpiece of sustainable design and premium craft. The {product.title || product.name} represents our commitment to exceptional quality and timeless style, curated for the modern individual.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        '100% Organic Cotton',
                                        'Ethically Sourced',
                                        'Reinforced Stitching',
                                        'Breathable Tech'
                                    ].map(feat => (
                                        <div key={feat} className="flex items-center space-x-3 text-sm font-semibold text-primary/80">
                                            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center">
                                                <Check size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 pb-2">
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 shadow-xl active:scale-[0.98] ${added
                                        ? 'bg-green-600 text-white'
                                        : 'bg-black text-white hover:bg-gray-900 shadow-black/10'
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
                                <p className="text-[11px] text-center text-secondary font-medium mt-4">
                                    Free shipping and 30-day returns on all Aura orders.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}


