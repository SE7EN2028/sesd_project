import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

export const todoApi = {
    getAll: (params?: Record<string, string>) => api.get('/todos', { params }),
    getOne: (id: number) => api.get(`/todos/${id}`),
    getDetailed: (id: number) => api.get(`/todos/${id}/detailed`),
    create: (data: any) => api.post('/todos', data),
    update: (id: number, data: any) => api.patch(`/todos/${id}`, data),
    toggle: (id: number) => api.patch(`/todos/${id}/toggle`),
    delete: (id: number) => api.delete(`/todos/${id}`),
    getStats: () => api.get('/todos/stats'),
    exportTodos: (format: string) => api.get(`/todos/export?format=${format}`, { responseType: 'blob' }),
};

export const subtaskApi = {
    getByTodo: (todoId: number) => api.get(`/subtasks/todo/${todoId}`),
    create: (todoId: number, title: string) => api.post(`/subtasks/todo/${todoId}`, { title }),
    toggle: (id: number) => api.patch(`/subtasks/${id}/toggle`),
    update: (id: number, title: string) => api.patch(`/subtasks/${id}`, { title }),
    delete: (id: number) => api.delete(`/subtasks/${id}`),
    getProgress: (todoId: number) => api.get(`/subtasks/todo/${todoId}/progress`),
};

export const categoryApi = {
    getAll: () => api.get('/categories'),
    create: (data: any) => api.post('/categories', data),
    update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
    delete: (id: number) => api.delete(`/categories/${id}`),
};

export const dashboardApi = {
    getOverview: () => api.get('/dashboard/overview'),
};

export default api;
