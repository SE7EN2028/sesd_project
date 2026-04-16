import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

export const todoApi = {
    getAll: (params?: Record<string, string>) => api.get('/todos', { params }),
    getOne: (id: number) => api.get(`/todos/${id}`),
    create: (data: any) => api.post('/todos', data),
    update: (id: number, data: any) => api.patch(`/todos/${id}`, data),
    toggle: (id: number) => api.patch(`/todos/${id}/toggle`),
    delete: (id: number) => api.delete(`/todos/${id}`),
    getStats: () => api.get('/todos/stats'),
};

export const categoryApi = {
    getAll: () => api.get('/categories'),
    create: (data: any) => api.post('/categories', data),
    update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`),
};

export default api;
