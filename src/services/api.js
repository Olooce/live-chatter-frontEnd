import axios from 'axios';

export const API_BASE_URL = (import.meta.env.MODE === "development" &&
        import.meta.env.VITE_API_DEV_BASE_URL) ||
    (typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}/api`
        : "/api");

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        'ngrok-skip-browser-warning': 'true'
    },
    // withCredentials: true,
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token refresh on 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export const authAPI = {
    register: (userData) => api.post('/auth/register', userData).then(res => res.data),
    login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }).then(res => res.data),
};

export const chatAPI = {
    getRooms: () => api.get('/chat/rooms').then(res => res.data),
    createRoom: (roomData) => api.post('/chat/rooms', roomData).then(res => res.data),
    getRoomMessages: (roomId) => api.get(`/chat/rooms/${roomId}/messages`).then(res => res.data),
    joinRoom: (roomId) => api.post(`/chat/rooms/${roomId}/join`).then(res => res.data),
    leaveRoom: (roomId) => api.post(`/chat/rooms/${roomId}/leave`).then(res => res.data),
    getOnlineUsers: () => api.get('/chat/users/online').then(res => res.data),
};

export default api;