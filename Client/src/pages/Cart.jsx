import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, cart, loading } = useCart();
    const { user } = useAuth();

    if (loading && cartItems.length === 0) {
        return (
            <div className="bg-background min-h-screen pt-24 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-accent mb-4" size={48} />
                <p className="text-secondary font-medium">Recalibrating your bag...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="bg-background min-h-screen pt-24">
                <div className="max-w-3xl mx-auto px-6 text-center py-20">
                    <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" strokeWidth={1} />
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Your bag is empty.</h1>
                    <p className="text-secondary mb-10 text-lg max-w-md mx-auto">
                        {user
                            ? "Start shopping to fill it up with your favorite Aura pieces."
                            : "Sign in to see if you have any saved items, or start shopping to fill it up."
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {!user && <Link to="/login" className="bg-black text-white px-12 py-4 rounded-2xl font-bold">Sign In</Link>}
                        <Link to="/shop" className="bg-white border border-gray-100 text-black px-12 py-4 rounded-2xl font-bold shadow-sm">Continue Shopping</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <header className="mb-10 pb-8 border-b border-gray-100">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Review your bag.</h1>
                    <p className="text-secondary font-medium">Free delivery and free returns on all orders.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-0">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={item._id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center py-10 border-b border-gray-100 gap-8 group"
                                >
                                    <Link to={`/product/${item.product?._id}`} className="w-full sm:w-48 h-48 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 group-hover:shadow-premium transition-shadow">
                                        <img
                                            src={item.product?.imageUrl || (item.product?.imageUrls && item.product.imageUrls[0]) || ''}
                                            alt={item.product?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </Link>

                                    <div className="flex-grow space-y-4 w-full">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                                                    <Link to={`/product/${item.product?._id}`} className="hover:text-accent transition-colors">
                                                        {item.product?.title}
                                                    </Link>
                                                </h3>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <p className="text-secondary font-medium text-sm">Size: <span className="text-black font-bold uppercase">{item.size}</span></p>
                                                    <p className="text-secondary font-medium text-sm">Color: <span className="text-black font-bold capitalize">{item.color}</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl md:text-2xl font-bold">₹{item.discountedPrice * item.quantity}</p>
                                                {item.price > item.discountedPrice && (
                                                    <p className="text-sm text-secondary line-through">₹{item.price * item.quantity}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2 flex flex-wrap items-center justify-between gap-6">
                                            <div className="flex items-center bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all active:scale-90"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-sm tracking-tight">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-full transition-all active:scale-90"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-secondary hover:text-red-500 transition-colors flex items-center space-x-2 text-sm font-semibold"
                                            >
                                                <Trash2 size={16} />
                                                <span>Remove from bag</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-gray-50/50 backdrop-blur-sm rounded-[40px] p-8 md:p-10 border border-gray-100">
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-secondary font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-black">₹{cart?.totalPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-secondary font-medium">
                                    <span>Savings</span>
                                    <span className="text-accent font-bold">-₹{cart?.discounte || 0}</span>
                                </div>
                                <div className="flex justify-between text-secondary font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-bold tracking-tighter">₹{cartTotal}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-900 shadow-xl transition-all active:scale-[0.98]"
                            >
                                <span>Check Out</span>
                                <ChevronRight size={20} strokeWidth={3} />
                            </Link>

                            <p className="text-[11px] text-center text-secondary font-medium mt-6 leading-relaxed">
                                By proceeding to checkout, you agree to Aura's <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}



