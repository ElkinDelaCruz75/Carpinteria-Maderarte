// API URL configuration
const API_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

export default API_URL;
