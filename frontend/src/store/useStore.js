import { create } from 'zustand';

const useStore = create((set) => ({
  // State
  user: null,
  blogs: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  // Actions
  setUser: (user) => set({ user }),
  setBlogs: (blogs) => set({ blogs }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: (totalPages, currentPage) => set((state) => {
    if (state.totalPages === totalPages && state.currentPage === currentPage) return state;
    return { totalPages, currentPage };
  }),
  logout: () => set({ user: null, blogs: [] }),
  clearError: () => set({ error: null }),
}));

export default useStore;