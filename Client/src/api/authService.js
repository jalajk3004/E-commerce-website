import api from './axios';

export const login = async (userData) => {
    try {
        const response = await api.post('/auth/signin', userData);
        if (response.data.jwt) {
            localStorage.setItem('jwt', response.data.jwt);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        if (response.data.jwt) {
            localStorage.setItem('jwt', response.data.jwt);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await api.get('/api/users/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = () => {
    localStorage.removeItem('jwt');
};
