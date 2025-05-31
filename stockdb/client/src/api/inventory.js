import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getAllItems = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await axios.post(`${API_URL}/products`, itemData);
  return response.data;
};