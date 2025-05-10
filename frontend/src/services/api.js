import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Rooms
export const getRooms = async () => {
  try {
    console.log('Calling API: GET /rooms');
    const response = await api.get('/rooms');
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('API error in getRooms:', error.response || error);
    throw error;
  }
};

export const createRoom = async (roomData) => {
  try {
    console.log('Calling API: POST /rooms with data:', roomData);
    // Validate data before sending
    if (!roomData.room_number || !roomData.capacity || !roomData.room_type || !roomData.price_per_month) {
      throw new Error('Missing required fields in room data');
    }
    
    // Ensure numeric fields are numbers
    const processedData = {
      ...roomData,
      capacity: parseInt(roomData.capacity),
      price_per_month: parseFloat(roomData.price_per_month),
    };
    
    console.log('Processed room data for API call:', processedData);
    
    const response = await api.post('/rooms', processedData);
    console.log('API response from createRoom:', response);
    return response.data;
  } catch (error) {
    console.error('API error in createRoom:', error);
    
    // Detailed error logging
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check if the API is running on port 5001.');
    } else {
      console.error('Error message:', error.message);
      throw error;
    }
  }
};

// Members
export const getMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMember = async (memberData) => {
  try {
    const response = await api.post('/members', memberData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reports
export const getOccupancyReport = async () => {
  try {
    const response = await api.get('/reports/occupancy');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentsReport = async (startDate, endDate) => {
  try {
    const response = await api.get('/reports/payments', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Payments
export const getPayments = async () => {
  try {
    const response = await api.get('/payments');
    return response.data || []; // Return empty array if no data
  } catch (error) {
    console.error('Error fetching payments:', error);
    return []; // Return empty array on error
  }
};

export const createPayment = async (paymentData) => {
  try {
    console.log('Calling API: POST /payments with data:', paymentData);
    
    // Validate required fields
    if (!paymentData.member_id || !paymentData.amount || !paymentData.payment_type) {
      throw new Error('Missing required payment data fields');
    }
    
    // Ensure amount is a positive number
    if (isNaN(paymentData.amount) || paymentData.amount <= 0) {
      throw new Error('Payment amount must be a positive number');
    }
    
    // Process data to ensure proper types
    const processedData = {
      ...paymentData,
      member_id: parseInt(paymentData.member_id),
      amount: parseFloat(paymentData.amount),
    };
    
    console.log('Processed payment data for API call:', processedData);
    
    const response = await api.post('/payments', processedData);
    console.log('API response from createPayment:', response);
    return response.data;
  } catch (error) {
    console.error('API error in createPayment:', error);
    
    // Detailed error logging
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check if the API is running on port 5001.');
    } else {
      console.error('Error message:', error.message);
      throw error;
    }
  }
};

export default api; 