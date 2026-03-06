import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrderHistory } from '../api/orderService';
import { Package, Truck, CheckCircle, Clock, ChevronRight, User, Mail, Phone, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const StatusStep = ({ status, currentStatus, date, label }) => {
    const statuses = ['PENDING', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(status);
    const isCompleted = stepIndex <= currentIndex;
    const isLast = status === 'DELIVERED';

    return (
        <div className="flex-1 flex flex-col items-center relative group">
            {/* Line connecting steps */}
            {!isLast && (
                <div className={`absolute top-4 left-1/2 w-full h-[2px] z-0 ${isCompleted ? 'bg-black' : 'bg-gray-200'}`} />
            )}

            {/* Step Circle */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                {isCompleted ? <CheckCircle size={18} /> : stepIndex + 1}
            </div>

            <p className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                {label}
            </p>
            {isCompleted && date && (
                <p className="text-[9px] text-gray-400 mt-1 font-medium">{new Date(date).toLocaleDateString()}</p>
            )}
        </div>
    );
};

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrderHistory();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch order history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-10 mb-20">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Hello, {user.firstName}.</h1>
                    <p className="text-secondary font-medium">Manage your Aura ID, orders, and preferences.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'orders', label: 'Order History', icon: Package },
                            { id: 'details', label: 'Account Details', icon: User },
                            { id: 'address', label: 'Saved Addresses', icon: Truck },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-premium text-black' : 'text-secondary hover:bg-white/50'}`}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div
                                    key="orders-tab"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {loading ? (
                                        <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                                            <Loader2 className="animate-spin text-accent mb-4" size={32} />
                                            <p className="text-secondary font-medium">Fetching your history...</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm">
                                            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
                                            <h2 className="text-2xl font-bold mb-4">No orders yet.</h2>
                                            <p className="text-secondary mb-8">When you place an order, it will appear here.</p>
                                            <button className="bg-black text-white px-10 py-4 rounded-2xl font-bold">Start Shopping</button>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order._id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-premium transition-shadow">
                                                <div className="p-8 md:p-10">
                                                    <div className="flex flex-wrap justify-between items-start gap-6 mb-10 pb-8 border-b border-gray-50">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Order Number</p>
                                                            <p className="text-xl font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Date Placed</p>
                                                            <p className="text-lg font-bold">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Total Amount</p>
                                                            <p className="text-lg font-bold">${order.totalDiscountedPrice}</p>
                                                        </div>
                                                        <div className="px-4 py-2 bg-gray-50 rounded-full">
                                                            <p className="text-[10px] uppercase tracking-widest font-bold text-black">{order.orderStatus}</p>
                                                        </div>
                                                    </div>

                                                    {/* Tracking Stepper */}
                                                    <div className="mb-12 px-2 md:px-10 flex justify-between items-center">
                                                        <StatusStep status="PLACED" currentStatus={order.orderStatus} date={order.orderDate} label="Placed" />
                                                        <StatusStep status="CONFIRMED" currentStatus={order.orderStatus} label="Confirmed" />
                                                        <StatusStep status="SHIPPED" currentStatus={order.orderStatus} label="Shipped" />
                                                        <StatusStep status="DELIVERED" currentStatus={order.orderStatus} date={order.deliveryDate} label="Delivered" />
                                                    </div>

                                                    {/* Order Items */}
                                                    <div className="space-y-6">
                                                        {order.orderItems?.map((item) => (
                                                            <div key={item._id} className="flex items-center space-x-6">
                                                                <div className="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                                    <img src={item.product?.imageUrl} alt={item.product?.title} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <h4 className="font-bold text-lg">{item.product?.title}</h4>
                                                                    <p className="text-sm text-secondary font-medium uppercase tracking-tight">Size: {item.size} • Qty: {item.quantity}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-bold text-lg">${item.discountedPrice}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-6 flex justify-between items-center group-hover:bg-gray-100 transition-colors">
                                                    <span className="text-sm font-bold text-secondary">Manage this order</span>
                                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'details' && (
                                <motion.div
                                    key="details-tab"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 md:p-16"
                                >
                                    <h2 className="text-3xl font-bold mb-12 tracking-tight">Profile Information</h2>
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center">
                                                    <User size={12} className="mr-2" /> First Name
                                                </label>
                                                <p className="text-xl font-bold py-2 border-b border-gray-100">{user.firstName}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center">
                                                    <User size={12} className="mr-2" /> Last Name
                                                </label>
                                                <p className="text-xl font-bold py-2 border-b border-gray-100">{user.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center">
                                                <Mail size={12} className="mr-2" /> Email Address
                                            </label>
                                            <p className="text-xl font-bold py-2 border-b border-gray-100">{user.email}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center">
                                                <Phone size={12} className="mr-2" /> Mobile Number
                                            </label>
                                            <p className="text-xl font-bold py-2 border-b border-gray-100">{user.mobile || 'Not linked'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold flex items-center">
                                                <Calendar size={12} className="mr-2" /> Member Since
                                            </label>
                                            <p className="text-xl font-bold py-2 border-b border-gray-100">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-16 bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                        <p className="text-sm font-medium text-secondary mb-6">Security & Password</p>
                                        <button className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm">Update Password</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
