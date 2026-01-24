import { useCallback, useMemo } from 'react';
import useStore from '../store/useStore';

const API_BASE = process.env.REACT_APP_API_URL || 'https://next-blog-88ch.onrender.com';

const useApi = () => {
  const { setLoading, setError } = useStore();

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE}/api${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.message || 'Request failed');
        throw new Error(data.message || 'Request failed');
      }

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error.message);
      throw error;
    }
  }, [setLoading, setError]);

  const get = useCallback((endpoint) => request(endpoint, { method: 'GET' }), [request]);
  const post = useCallback((endpoint, body) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }), [request]);
  const put = useCallback((endpoint, body) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  }), [request]);
  const del = useCallback((endpoint) => request(endpoint, { method: 'DELETE' }), [request]);

  return useMemo(() => ({ get, post, put, delete: del }), [get, post, put, del]);
};

export default useApi;