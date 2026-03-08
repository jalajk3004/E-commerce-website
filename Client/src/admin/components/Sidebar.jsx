import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingBag,
    PlusCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle
} from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('jwt'); // Assuming admin wants to sever all auth
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Products', icon: Package, path: '/admin/products' },
        { name: 'Customers', icon: Users, path: '/admin/customers' },
        { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
        { name: 'Add Product', icon: PlusCircle, path: '/admin/product/create' },
    ];

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 256 }}
            className="h-screen bg-white border-r border-gray-200 flex flex-col justify-between sticky top-0 transition-all duration-300"
        >
            <div>
                {/* Logo & Toggle */}
                <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-100 h-16`}>
                    {!isCollapsed && (
                        <span className="font-bold text-xl text-yellow-600 truncate">
                            Admin Panel
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center p-3 rounded-lg transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-yellow-50 text-yellow-600 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                    ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                                `}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon size={22} className={isActive ? 'text-yellow-600' : 'text-gray-500 group-hover:text-gray-900'} />
                                {!isCollapsed && <span>{item.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Profile Section */}
            <div className="p-4 border-t border-gray-100">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4`}>
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center text-yellow-600 justify-center shrink-0">
                            <UserCircle size={24} />
                        </div>
                        {!isCollapsed && (
                            <div className="truncate">
                                <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">admin@store.com</p>
                            </div>
                        )}
                    </div>
                </div>
                {!isCollapsed ? (
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout to Store</span>
                    </button>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Logout to Store"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default Sidebar;
