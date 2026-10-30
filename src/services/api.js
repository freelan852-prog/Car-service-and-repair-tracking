/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

export const TOKEN_KEY = 'autotrust_token';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 to force re-authentication
      localStorage.removeItem(TOKEN_KEY);
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('autotrust:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  async login(data) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const vehicleAPI = {
  async getVehicles() {
    const res = await apiClient.get('/vehicles');
    return res.data;
  },
  async createVehicle(data) {
    const res = await apiClient.post('/vehicles', data);
    return res.data;
  },
  async updateVehicle(id, data) {
    const res = await apiClient.put(`/vehicles/${id}`, data);
    return res.data;
  },
  async deleteVehicle(id) {
    const res = await apiClient.delete(`/vehicles/${id}`);
    return res.data;
  },
};

export const serviceAPI = {
  async getServices(vehicleId) {
    const res = await apiClient.get(`/services?vehicleId=${encodeURIComponent(vehicleId)}`);
    return res.data;
  },
};

export const orderAPI = {
  async createOrder(data) {
    const res = await apiClient.post('/orders', data);
    return res.data;
  },
  async getOrders() {
    const res = await apiClient.get('/orders');
    return res.data;
  },
  async getOrder(id) {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },
  async decideExtra(orderId, extraId, action) {
    const res = await apiClient.patch(`/orders/${orderId}/extras/${extraId}`, { action });
    return res.data;
  },
};

export default apiClient;
