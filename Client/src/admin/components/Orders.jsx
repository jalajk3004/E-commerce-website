import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const jwt = localStorage.getItem('jwt');
            const response = await axios.get('http://localhost:3000/api/admin/orders', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            // Admin get all orders returns an array
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, statusEndpoint) => {
        try {
            const jwt = localStorage.getItem('jwt');
            await axios.put(`http://localhost:3000/api/admin/orders/${orderId}/${statusEndpoint}`, {}, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            fetchOrders();
        } catch (error) {
            console.error(`Failed to update order status to ${statusEndpoint}`, error);
            alert("Error updating order status.");
        }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            const jwt = localStorage.getItem('jwt');
            await axios.delete(`http://localhost:3000/api/admin/orders/${orderId}/delete`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            fetchOrders();
        } catch (error) {
            console.error("Failed to delete order", error);
            alert("Error deleting order.");
        }
    };

    const getStatusToken = (status) => {
        switch (status) {
            case 'PENDING': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">PENDING</span>;
            case 'CONFIRMED': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">CONFIRMED</span>;
            case 'SHIPPED': return <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-semibold">SHIPPED</span>;
            case 'DELIVERED': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">DELIVERED</span>;
            case 'CANCELLED': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">CANCELLED</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 text-center">
                                <th className="p-4 text-left">Order Details</th>
                                <th className="p-4 text-left">Customer</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Update Status</th>
                                <th className="p-4">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-8 text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={order._id}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <td className="p-4 text-left">
                                            <p className="font-semibold text-gray-900 text-sm">ID: {order._id.substring(18)}</p>
                                            <p className="text-xs text-gray-500 mt-1">{order.totalItem} items</p>
                                        </td>
                                        <td className="p-4 text-left">
                                            <p className="font-medium text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                                            <p className="text-xs text-gray-500 truncate">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">
                                            ₹{order.totalDiscountedPrice || order.totalPrice}
                                        </td>
                                        <td className="p-4">
                                            {getStatusToken(order.orderStatus)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                                                    <>
                                                        {order.orderStatus === 'PENDING' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                                                className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <CheckCircle size={14} /> <span>Confirm</span>
                                                            </button>
                                                        )}
                                                        {order.orderStatus === 'CONFIRMED' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'ship')}
                                                                className="flex items-center space-x-1 px-2 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <Truck size={14} /> <span>Ship</span>
                                                            </button>
                                                        )}
                                                        {order.orderStatus === 'SHIPPED' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'deliver')}
                                                                className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <Package size={14} /> <span>Deliver</span>
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== 'PENDING' && (
                                                            // Provide a cancel fallback generally available except if delivered/cancelled
                                                            <button
                                                                onClick={() => updateOrderStatus(order._id, 'cancel')}
                                                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                                                                title="Cancel Order"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                {(order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED') && (
                                                    <span className="text-xs text-gray-400">Locked</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Order"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
