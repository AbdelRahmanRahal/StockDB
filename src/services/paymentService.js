import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const paymentService = {
    getAllPayments: async () => {
        const response = await axios.get(`${API_URL}/payments`);
        return response.data;
    },

    getPaymentById: async (id) => {
        const response = await axios.get(`${API_URL}/payments/${id}`);
        return response.data;
    },

    createPayment: async (paymentData) => {
        const response = await axios.post(`${API_URL}/payments`, paymentData);
        return response.data;
    },

    updatePayment: async (id, paymentData) => {
        const response = await axios.put(`${API_URL}/payments/${id}`, paymentData);
        return response.data;
    },

    generateReceipt: async (id) => {
        const response = await axios.get(`${API_URL}/payments/${id}/receipt`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

