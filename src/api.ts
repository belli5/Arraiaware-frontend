import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // já com /api
});

// injeta Authorization automaticamente se tiver token
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}