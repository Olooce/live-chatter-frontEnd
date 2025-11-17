import api from './api';

export const authService = {
    register: (userData) =>
        api.post('/auth/register', userData).then(res => res.data),

    login: (credentials) =>
        api.post('/auth/login', credentials).then(res => res.data),

    refresh: (refreshToken) =>
        api.post('/auth/refresh', {refreshToken}).then(res => res.data),

    logout: () =>
        api.post('/auth/logout').then(res => res.data),

    getProfile: () =>
        api.get('/auth/profile').then(res => res.data),

    updateProfile: (userData) =>
        api.put('/auth/profile', userData).then(res => res.data),

    changePassword: (currentPassword, newPassword) =>
        api.put('/auth/password', {currentPassword, newPassword}),
};

export default authService;