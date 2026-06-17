import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://hrw.pythonanywhere.com';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(async (config) => {
  let token = null;

  if (typeof window !== 'undefined') {
    // Client-side execution
    token = Cookies.get('token');
  } else {
    // Server-side execution
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    } catch (err) {
      console.warn("Could not read cookies on server");
    }
  }

  if (token) {
    // Django REST Framework defaults to 'Token' not 'Bearer'
    config.headers.Authorization = `Token ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
