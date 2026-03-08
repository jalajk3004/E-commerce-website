import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Package, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalEarnings: 0,
        totalProducts: 0,
        monthlyData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app, you'd pass the auth token here
                const jwt = localStorage.getItem('jwt');
                const response = await axios.get('http://localhost:3000/api/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Revenue', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    if (loading) {
        return <div className="flex h-full items-center justify-center text-gray-500">Loading Dashboard...</div>;
    }

    // Determine max sales for bar chart scaling
    const maxSales = Math.max(...stats.monthlyData.map(d => d.sales), 1);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
                        >
                            <div className={`p-4 rounded-full ${card.bg}`}>
                                <Icon size={24} className={card.color} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Monthly Analysis Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8"
            >
                <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue Analysis</h2>

                <div className="h-64 flex items-end justify-between space-x-2">
                    {stats.monthlyData.length > 0 ? stats.monthlyData.map((data, index) => {
                        const heightPercent = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
                        return (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="w-full flex justify-center items-end h-[200px] mb-2 relative">
                                    <div
                                        className="w-1/2 bg-yellow-400 rounded-t-sm group-hover:bg-yellow-500 transition-colors relative"
                                        style={{ height: `${heightPercent}%` }}
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                            ₹{data.sales.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">{data.name}</span>
                            </div>
                        );
                    }) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No data available
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
