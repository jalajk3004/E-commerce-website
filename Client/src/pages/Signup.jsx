import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { register as registerApi } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '' // Backend requires mobile
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { refreshCart } = useCart();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await registerApi(formData);
            if (data.jwt) {
                login(data);
                await refreshCart();
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Create Your Aura ID.</h1>
                    <p className="text-secondary">Join us for a personalized experience.</p>
                </div>

                {error && (
                    <div className="max-w-[440px] mx-auto mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-[440px] mx-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        required
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />

                    <div className="text-[11px] text-secondary leading-relaxed pt-2">
                        Your Aura ID is the account you use to access Aura services like the AuraStore, and many more. It includes the email address and password you use to sign in, as well as all the contact, payment, and security details that you'll use across Aura services.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Continue'}
                    </button>
                </form>

                <div className="mt-8 text-center text-primary">
                    <p className="text-sm text-secondary">
                        Already have an ID? <Link to="/login" className="text-accent hover:underline">Sign in.</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}


