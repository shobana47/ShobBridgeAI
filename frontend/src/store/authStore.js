import { create } from 'zustand';
import axios from 'axios';

// Demo accounts for offline/no-MongoDB mode
const DEMO_USERS = [
  { _id: 'd1', name: 'Student Demo', email: 'student@demo.com', password: 'demo123', role: 'Student',          token: 'demo-student-token' },
  { _id: 'd2', name: 'Admin Demo',   email: 'admin@demo.com',   password: 'demo123', role: 'Admin',            token: 'demo-admin-token' },
  { _id: 'd3', name: 'Staff Demo',   email: 'staff@demo.com',   password: 'demo123', role: 'Placement Staff',  token: 'demo-staff-token' },
];

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // Try demo accounts first
    const demo = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demo) {
      const { password: _, ...user } = demo;
      localStorage.setItem('userInfo', JSON.stringify(user));
      set({ user, isLoading: false });
      return;
    }

    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed. Try demo: student@demo.com / demo123',
        isLoading: false,
      });
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, isLoading: false });
    } catch {
      // Fallback: create a local demo account
      const user = {
        _id: 'local-' + Date.now(),
        name,
        email,
        role: role || 'Student',
        token: 'local-token-' + Date.now(),
      };
      localStorage.setItem('userInfo', JSON.stringify(user));
      set({ user, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },
}));

export default useAuthStore;
