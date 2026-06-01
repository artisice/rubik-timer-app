import { create } from 'zustand';

export const useAuthStore = create((set) => {
  let savedUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      savedUser = JSON.parse(userStr);
    }
  } catch (e) {
    localStorage.removeItem('user');
  }

  const savedToken = localStorage.getItem('token');

  return {
    token: savedToken,
    user: savedUser,
    isAuthenticated: !!savedToken,

    login: (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null, isAuthenticated: false });
    },
  };
});