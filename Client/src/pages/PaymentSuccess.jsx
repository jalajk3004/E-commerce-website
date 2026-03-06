import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, Loader2, ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react';
import { updatePayment } from '../api/paymentService';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { refreshCart } = useCart();

    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('razorpay_payment_id');
    const paymentStatus = searchParams.get('razorpay_payment_link_status');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!orderId || !paymentId) {
                setLoading(false);
                setError("Missing payment information. Please contact support.");
                return;
            }

            try {
                await updatePayment({ orderId, paymentId });
                setSuccess(true);
                await refreshCart(); // Clear cart after successful payment
            } catch (err) {
                console.error("Payment verification failed", err);
                setError("Payment was successful, but we couldn't update your order status. Please contact support with your Payment ID: " + paymentId);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [orderId, paymentId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center space-y-6"
                >
                    <div className="relative">
                        <Loader2 className="animate-spin text-accent mx-auto" size={64} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-full" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Verifying Payment...</h1>
                    <p className="text-secondary font-medium">Please do not close or refresh this page.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-3xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-100 rounded-[40px] p-12 text-center shadow-premium"
                >
                    {success ? (
                        <>
                            <div className="w-20 h-20 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">Payment Successful.</h1>
                            <p className="text-secondary mb-12 text-lg font-medium leading-relaxed">
                                Thank you for choosing Aura. Your order <span className="text-black font-bold">#{orderId?.slice(-6).toUpperCase()}</span> is now being processed and will be shipped shortly.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/shop"
                                    className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-gray-900 transition-all shadow-xl shadow-black/10"
                                >
                                    <span>Continue Shopping</span>
                                    <ChevronRight size={18} strokeWidth={3} />
                                </Link>
                                <Link
                                    to="/"
                                    className="w-full sm:w-auto bg-white border border-gray-100 text-black px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    Review Status
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <AlertCircle size={40} strokeWidth={3} />
                            </div>
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">Action Required.</h1>
                            <p className="text-secondary mb-12 text-lg font-medium leading-relaxed">
                                {error || "Something went wrong with your order confirmation."}
                            </p>
                            <Link
                                to="/checkout"
                                className="inline-block bg-black text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-black/10 hover:bg-gray-900 transition-all"
                            >
                                Return to Checkout
                            </Link>
                        </>
                    )}
                </motion.div>

                <div className="mt-12 text-center text-[11px] text-secondary font-medium uppercase tracking-[0.2em]">
                    Order Transmitted via Secure Gateway
                </div>
            </div>
            <Footer />
        </div>
    );
}
