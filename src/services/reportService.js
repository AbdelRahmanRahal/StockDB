import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const reportService = {
    getStats: async () => {
        const response = await axios.get(`${API_URL}/reports/stats`);
        return response.data;
    },

    getSalesData: async () => {
        const response = await axios.get(`${API_URL}/reports/sales`);
        return response.data;
    },

    getInventoryStatus: async () => {
        const response = await axios.get(`${API_URL}/reports/inventory`);
        return response.data;
    }
};