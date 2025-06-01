import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const orderService = {
    getAllOrders: async () => {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await axios.get(`${API_URL}/orders/${id}`);
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await axios.post(`${API_URL}/orders`, orderData);
        return response.data;
    },

    updateOrder: async (id, orderData) => {
        const response = await axios.put(`${API_URL}/orders/${id}`, orderData);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await axios.delete(`${API_URL}/orders/${id}`);
        return response.data;
    }
};