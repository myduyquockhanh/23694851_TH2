import axios from 'axios';
import { MSSV } from '@constants/student';

const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

// ── Request interceptor: add X-Student-Id header ──────────────
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Student-Id'] = MSSV;
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
