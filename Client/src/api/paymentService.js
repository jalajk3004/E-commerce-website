import api from './axios';

export const createPayment = async (orderId) => {
    try {
        const response = await api.post(`/api/payments/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePayment = async (reqData) => {
    try {
        const response = await api.get(`/api/payments/update?payment_id=${reqData.paymentId}&order_id=${reqData.orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
