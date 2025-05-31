import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getAllSuppliers = async () => {
  const response = await axios.get(`${API_URL}/suppliers`);
  return response.data;
};

export const createSupplier = async (itemData) => {
  const response = await axios.post(`${API_URL}/suppliers`, itemData);
  return response.data;
};