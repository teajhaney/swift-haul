import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// One in-flight refresh at a time — prevents duplicate refresh calls
// when multiple requests fail with 401 simultaneously.
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'error' in responseData &&
        typeof (responseData as Record<string, unknown>).error === 'object' &&
        (responseData as Record<string, unknown>).error !== null &&
        typeof (responseData as { error: { message?: unknown } }).error
          .message === 'string'
      ) {
        error.message = (
          responseData as { error: { message: string } }
        ).error.message;
      }
    }

    // Only attempt refresh once per request; skip non-401s
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post('/api/auth/refresh', {}, { withCredentials: true })
        .then(() => {
          refreshPromise = null;
        })
        .catch((err: unknown) => {
          refreshPromise = null;
          throw err;
        });
    }

    try {
      await refreshPromise;
      return api(original);
    } catch {
      // Refresh failed — session is dead, send to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  }
);

export default api;
