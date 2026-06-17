import axios from 'axios';

const BASE_URL = 'https://hrw.pythonanywhere.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token in the future
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token'); // or from cookies
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
})
