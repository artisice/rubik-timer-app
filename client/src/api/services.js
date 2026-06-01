import api from './index';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/users', userData),
};

export const recordService = {
  submitRecord: (data) => api.post('/records', data),
  getPending: () => api.get('/records/pending'),
  approve: (id) => api.put(`/records/${id}/approve`),
  reject: (id) => api.put(`/records/${id}/reject`),
};

export const leaderboardService = {
  getRecords: () => api.get('/leaderboard'),
};