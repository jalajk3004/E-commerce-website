import api from './axios';

export const createOrder = async (reqData) => {
    try {
        const response = await api.post('/api/orders', reqData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getOrderHistory = async () => {
    try {
        const response = await api.get('/api/orders/user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
