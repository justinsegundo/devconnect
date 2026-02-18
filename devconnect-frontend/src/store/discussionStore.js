import { create } from 'zustand';
import api from '../api/axios';

const useDiscussionStore = create((set) => ({
  discussions: [],
  currentDiscussion: null,
  loading: false,
  error: null,
  pagination: null,

  fetchDiscussions: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/discussions', { params });
      set({ 
        discussions: response.data.data,
        pagination: {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        },
        loading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch discussions', loading: false });
    }
  },

  fetchDiscussion: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/discussions/${id}`);
      set({ currentDiscussion: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch discussion', loading: false });
    }
  },

  createDiscussion: async (data) => {
    try {
      const response = await api.post('/discussions', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create discussion' 
      };
    }
  },

  deleteDiscussion: async (id) => {
    try {
      await api.delete(`/discussions/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete discussion' };
    }
  },

  addComment: async (discussionId, body) => {
    try {
      const response = await api.post(`/discussions/${discussionId}/comments`, { body });
      set((state) => ({
        currentDiscussion: {
          ...state.currentDiscussion,
          comments: [...state.currentDiscussion.comments, response.data],
        },
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add comment' };
    }
  },

  vote: async (votable_type, votable_id, vote_type) => {
    try {
      await api.post('/vote', { votable_type, votable_id, vote_type });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  flag: async (flaggable_type, flaggable_id, reason) => {
    try {
      await api.post('/flags', { flaggable_type, flaggable_id, reason });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to flag content' };
    }
  },
}));

export default useDiscussionStore;