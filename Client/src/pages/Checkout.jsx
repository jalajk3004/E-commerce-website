import { useCart } from '../context/CartContext';
import { CreditCard, Truck, Check, Loader2, ChevronRight, MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import { useState } from 'react';
import { createOrder } from '../api/orderService';
import { createPayment } from '../api/paymentService';

export default function Checkout() {
    const { cartItems, cartTotal, cart } = useCart();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        mobile: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // 1. Create Order
            const order = await createOrder(address);

            // 2. Create Payment Link
            const paymentData = await createPayment(order._id);

            // 3. Redirect to Razorpay
            if (paymentData.payment_link_url) {
                window.location.href = paymentData.payment_link_url;
            } else {
                alert("Failed to create payment link. Please try again.");
            }
        } catch (err) {
            console.error("Checkout failed", err);
            alert("Checkout failed: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-background min-h-screen pt-40 text-center">
                <h2 className="text-3xl font-bold mb-4">Your bag is empty.</h2>
                <button onClick={() => window.location.href = '/shop'} className="bg-black text-white px-8 py-3 rounded-xl font-bold">Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Checkout.</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Flow */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Step 1: Shipping */}
                        <div className={`p-8 md:p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm transition-all ${step !== 1 ? 'opacity-50 pointer-events-none' : 'scale-100'}`}>
                            <div className="flex items-center space-x-6 mb-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step > 1 ? 'bg-green-500 text-white' : 'bg-black text-white'}`}>
                                    {step > 1 ? <Check size={20} strokeWidth={3} /> : '1'}
                                </div>
                                <h2 className="text-2xl font-bold text-primary tracking-tight">Shipping Information</h2>
                            </div>

                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">First Name</label>
                                            <input name="firstName" value={address.firstName} onChange={handleInputChange} type="text" placeholder="e.g. John" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">Last Name</label>
                                            <input name="lastName" value={address.lastName} onChange={handleInputChange} type="text" placeholder="e.g. Doe" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">Street Address</label>
                                        <input name="streetAddress" value={address.streetAddress} onChange={handleInputChange} type="text" placeholder="123 Aura Street, Suite 4B" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">City</label>
                                            <input name="city" value={address.city} onChange={handleInputChange} type="text" placeholder="New Delhi" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">State</label>
                                            <input name="state" value={address.state} onChange={handleInputChange} type="text" placeholder="DL" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">ZIP Code</label>
                                            <input name="zipCode" value={address.zipCode} onChange={handleInputChange} type="text" placeholder="110001" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">Country</label>
                                            <input name="country" value={address.country} onChange={handleInputChange} type="text" placeholder="India" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary ml-1">Mobile Number</label>
                                        <input name="mobile" value={address.mobile} onChange={handleInputChange} type="text" placeholder="+1 (555) 000-0000" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-black/5 transition-all font-medium" />
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!address.firstName || !address.streetAddress || !address.city || !address.state || !address.zipCode || !address.country || !address.mobile}
                                        className="w-full bg-black text-white py-5 rounded-2xl font-bold mt-6 flex items-center justify-center space-x-2 shadow-xl shadow-black/10 hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <span>Continue to Review</span>
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Payment Redirect */}
                        <div className={`p-8 md:p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm transition-all ${step !== 2 ? 'opacity-50 pointer-events-none' : 'scale-100'}`}>
                            <div className="flex items-center space-x-6 mb-10">
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">2</div>
                                <h2 className="text-2xl font-bold text-primary tracking-tight">Review & Pay</h2>
                            </div>

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="flex items-start space-x-6 p-6 rounded-3xl bg-gray-50/50 border border-gray-100">
                                        <MapPin className="text-accent flex-shrink-0 mt-1" size={24} />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Delivering to</p>
                                            <p className="font-bold text-primary">{address.firstName} {address.lastName}</p>
                                            <p className="text-sm text-secondary leading-relaxed">{address.streetAddress}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
                                            <button onClick={() => setStep(1)} className="text-xs font-bold text-accent mt-3 hover:underline underline-offset-4">Edit Address</button>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-blue-50/10 border-2 border-accent/20 flex items-center space-x-6">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                            <CreditCard className="text-accent" size={24} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-primary">Secure Payment via Razorpay</p>
                                            <p className="text-xs text-secondary">Credit Card, UPI, Net Banking, and Wallet.</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center shadow-sm shadow-accent/20">
                                            <div className="w-3 h-3 rounded-full bg-accent" />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full bg-black text-white py-6 rounded-3xl font-bold flex items-center justify-center space-x-3 shadow-2xl shadow-black/20 hover:bg-gray-900 active:scale-[0.98] transition-all"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={24} />
                                                <span>Processing Secure Gateway...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Pay ₹{cartTotal} Now</span>
                                                <ChevronRight size={20} strokeWidth={3} />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[11px] text-center text-secondary font-medium italic opacity-60">You will be redirected to Razorpay's secure payment environment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                        <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-8 tracking-tight">Summary</h3>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex gap-4 group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden">
                                            <img src={item.product?.imageUrl || (item.product?.imageUrls && item.product.imageUrls[0]) || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-sm truncate">{item.product?.title}</p>
                                            <p className="text-[11px] text-secondary font-medium mt-1 uppercase">{item.size} — {item.color}</p>
                                            <div className="flex justify-between items-end mt-1">
                                                <p className="text-[11px] font-bold text-secondary">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-primary">₹{item.discountedPrice * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 mt-8 pt-6 space-y-4">
                                <div className="flex justify-between text-sm text-secondary font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-primary font-bold">₹{cart?.totalPrice || cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-secondary font-medium">
                                    <span>Savings</span>
                                    <span className="text-accent font-bold">-₹{cart?.discounte || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm text-secondary font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-lg font-bold tracking-tight">Total</span>
                                    <span className="text-2xl font-bold tracking-tighter text-primary">₹{cartTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}


