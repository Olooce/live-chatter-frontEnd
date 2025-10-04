import api from './api';

export const chatService = {
    getRoomMessages: (roomId, params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.offset) queryParams.append('offset', params.offset);
        if (params.before) queryParams.append('before', params.before);

        return api.get(`/chat/rooms/${roomId}/messages?${queryParams}`)
            .then(res => res.data);
    },

    searchMessages: (query, roomId = null, limit = 20) => {
        const params = { q: query, limit };
        if (roomId) params.room_id = roomId;

        return api.get('/chat/search', { params })
            .then(res => res.data);
    },

    getOnlineUsers: () =>
        api.get('/chat/users/online').then(res => res.data),

    sendTypingIndicator: (roomId, isTyping) =>
        api.post('/chat/typing', { room_id: roomId, typing: isTyping }),

    addReaction: (messageId, emoji) =>
        api.post(`/chat/messages/${messageId}/reactions`, { emoji }),

    removeReaction: (messageId, emoji) =>
        api.delete(`/chat/messages/${messageId}/reactions`, { data: { emoji } }),
};

export default chatService;