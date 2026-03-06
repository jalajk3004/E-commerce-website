import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, logout } = useAuth();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount } = useCart();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Handle background change
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Handle hide/show on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // user fetching is now handled by AuthContext

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const textColor = (isScrolled || !isHome) ? 'text-primary' : 'text-white';
    const iconColor = (isScrolled || !isHome) ? 'text-primary' : 'text-white';

    const navbarOuterClass = isScrolled
        ? 'backdrop-blur-xl bg-white/70 shadow-sm py-3'
        : 'backdrop-blur-xl bg-transparent py-5';

    const categories = [
        {
            name: 'Men',
            path: '/shop/men',
            items: ['New Arrivals', 'T-Shirts', 'Hoodies', 'Pants', 'Outerwear']
        },
        {
            name: 'Women',
            path: '/shop/women',
            items: ['New Arrivals', 'Dresses', 'Tops', 'Bottoms', 'Jackets']
        },
        {
            name: 'Kids',
            path: '/shop/kids',
            items: ['New Arrivals', 'Boys', 'Girls', 'Accessories']
        },
        { name: 'Collections', path: '/shop' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -120 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 w-full z-[80] transition-all duration-500 ${navbarOuterClass}`}
            >

                <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-3 items-center h-12 relative">

                    {/* Left Navigation (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className="relative group py-2"
                                onMouseEnter={() => category.items && setActiveDropdown(category.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    to={category.path}
                                    className={`text-[12px] font-bold uppercase tracking-widest hover:text-accent transition-colors ${textColor} flex items-center space-x-1.5`}
                                >

                                    <span>{category.name}</span>
                                    {category.items && (
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === category.name ? 'rotate-180' : ''}`} />
                                    )}
                                </Link>

                                <AnimatePresence>
                                    {activeDropdown === category.name && category.items && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 pt-4"
                                        >
                                            <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-6 min-w-[220px]">
                                                <div className="space-y-3">
                                                    {category.items.map((item) => (
                                                        <Link
                                                            key={item}
                                                            to={`${category.path}?sub=${item.toLowerCase()}`}
                                                            className="block text-[13px] text-gray-600 hover:text-black hover:translate-x-1 transition-all"
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-start lg:justify-center">
                        <Link to="/" className={`text-2xl font-bold tracking-tighter transition-colors ${textColor}`}>
                            AURA.
                        </Link>
                    </div>


                    {/* Right Utilities */}
                    <div className="flex items-center justify-end space-x-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`${iconColor} hover:opacity-60 transition-opacity`}
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </button>

                        <div className="relative group/user">
                            {user ? (
                                <div className="relative">
                                    <button className={`${iconColor} hover:opacity-60 transition-opacity flex items-center space-x-2`}>
                                        <User size={20} strokeWidth={1.5} />
                                        <span className="text-[12px] font-bold uppercase tracking-widest hidden xl:block">
                                            {user.firstName}
                                        </span>
                                    </button>
                                    <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200">
                                        <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-2 min-w-[180px]">
                                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                                <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Account</p>
                                                <p className="text-[13px] font-bold truncate">{user.email}</p>
                                            </div>
                                            <Link to="/profile" className="flex items-center px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-[13px] font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`${iconColor} hover:opacity-60 transition-opacity flex items-center`}
                                >
                                    <User size={20} strokeWidth={1.5} />
                                </Link>
                            )}
                        </div>

                        <Link to="/cart" className="relative group">
                            <ShoppingBag className={`${iconColor} group-hover:opacity-60 transition-opacity`} size={20} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className={`lg:hidden ${iconColor} hover:opacity-60 transition-opacity`}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

            </motion.nav>

            {/* Transition Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col items-center pt-20 px-6"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-10 right-10 text-primary hover:rotate-90 transition-transform duration-300"
                        >
                            <X size={32} strokeWidth={1.5} />
                        </button>
                        <div className="w-full max-w-3xl">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search aura.com"
                                className="w-full text-4xl md:text-6xl font-semibold tracking-tight outline-none border-b border-gray-200 pb-6 placeholder:text-gray-400"

                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        window.location.href = `/shop?search=${e.target.value}`;
                                        setIsSearchOpen(false);
                                    }
                                }}
                            />
                            <div className="mt-10">
                                <p className="text-[12px] uppercase tracking-widest text-secondary mb-6 font-medium">Quick Links</p>
                                <div className="space-y-4">
                                    {['Arrivals', 'Trending', 'Foundations'].map((link) => (
                                        <Link key={link} to={`/shop?search=${link}`} onClick={() => setIsSearchOpen(false)} className="block text-2xl hover:text-accent transition-colors">
                                            {link}
                                        </Link>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white z-[100] flex flex-col"
                    >
                        <div className="px-6 py-10 flex justify-between items-center border-b border-gray-50">
                            <span className="text-2xl font-bold tracking-tighter">AURA</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-10">
                            <div className="space-y-8">
                                {categories.map((cat) => (
                                    <div key={cat.name} className="space-y-4">
                                        <Link
                                            to={cat.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-4xl font-semibold tracking-tight flex items-center justify-between"
                                        >
                                            {cat.name}
                                            <ChevronDown size={20} className="-rotate-90 text-gray-300" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-10 border-t border-gray-50 bg-gray-50/50">
                            <div className="space-y-6">
                                <Link to="/support" className="text-sm text-secondary block">Support</Link>
                                {user ? (
                                    <button onClick={handleLogout} className="text-sm text-red-600 block">Logout</button>
                                ) : (
                                    <Link to="/login" className="text-sm text-primary block">Sign In</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}