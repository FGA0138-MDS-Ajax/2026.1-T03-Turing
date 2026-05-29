import api from './api';

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getRecentActivity() {
    const response = await api.get('/admin/activity/recent');
    return response.data;
  },

  async createAdmin(data) {
    const response = await api.post('/admin/create', data);
    return response.data;
  },

  async getAdmins() {
    const response = await api.get('/admin/list');
    return response.data;
  },
};