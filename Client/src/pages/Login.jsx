import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { login as loginApi } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const data = await loginApi(formData);
            if (data.jwt) {
                login(data);
                await refreshCart();
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen pt-24 text-primary">
            <div className="max-w-md mx-auto px-6 py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary">Sign in.</h1>
                    <p className="text-secondary">Manage your orders and preferences.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email or Aura ID"
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-secondary">
                        Don't have an ID? <Link to="/signup" className="text-accent hover:underline">Create yours now.</Link>
                    </p>
                    <Link to="#" className="text-sm text-accent hover:underline block">Forgot password?</Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}


