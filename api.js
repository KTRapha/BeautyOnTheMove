import axios from 'axios';

const api = axios.create({
  baseURL: 'http://YOUR_BACKEND_URL:PORT', // Replace with your backend URL
  timeout: 5000,
});

export default api; 