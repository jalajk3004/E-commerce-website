import api from './axios';

export const findProducts = async (filters) => {
    try {
        const response = await api.get('/api/products', { params: filters });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const findProductById = async (productId) => {
    try {
        const response = await api.get(`/api/products/id/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
