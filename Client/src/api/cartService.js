import api from './axios';

export const getCart = async () => {
    try {
        const response = await api.get('/api/cart');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addItemToCart = async (reqData) => {
    try {
        const response = await api.put('/api/cart/add', reqData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const removeCartItem = async (cartItemId) => {
    try {
        const response = await api.delete(`/api/cart_items/${cartItemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateCartItem = async (reqData) => {
    try {
        const response = await api.put(`/api/cart_items/${reqData.cartItemId}`, reqData.data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
