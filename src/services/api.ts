import ky from 'ky';
import { useAuthStore } from '@/stores/authStore';

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL || '/api',
  hooks: {
    beforeRequest: [
      (request) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = '/auth';
        }
      },
    ],
  },
});

export default api;
