import { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, logout as logoutApi } from '../api/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const profile = await getUserProfile();
            setUser(profile);
        } catch (err) {
            console.error("Auth: Failed to fetch profile", err);
            localStorage.removeItem('jwt');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const login = (userData) => {
        // Token is already set by authService.login
        fetchUserProfile();
    };

    const logout = () => {
        logoutApi();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            refreshUser: fetchUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
