// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://back-office-kidora.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;