import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Customers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const jwt = localStorage.getItem('jwt');
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            // Admin get all users
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers Directory</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 text-center">
                                <th className="p-4 text-left w-16">Avatar</th>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4">Registered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500">Loading customers...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500">No customers found.</td>
                                </tr>
                            ) : (
                                users.map((user, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={user._id}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors text-center"
                                    >
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-sm">
                                                {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                                            </div>
                                        </td>
                                        <td className="p-4 text-left">
                                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                                        </td>
                                        <td className="p-4 text-left text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(user.createdAt || Date.now()).toLocaleDateString()}
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

export default Customers;
