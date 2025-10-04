import api from './api';

export const roomService = {
    getRooms: () =>
        api.get('/chat/rooms').then(res => res.data),

    getRoom: (roomId) =>
        api.get(`/chat/rooms/${roomId}`).then(res => res.data),

    createRoom: (roomData) =>
        api.post('/chat/rooms', roomData).then(res => res.data),

    updateRoom: (roomId, roomData) =>
        api.put(`/chat/rooms/${roomId}`, roomData).then(res => res.data),

    deleteRoom: (roomId) =>
        api.delete(`/chat/rooms/${roomId}`).then(res => res.data),

    joinRoom: (roomId) =>
        api.post(`/chat/rooms/${roomId}/join`).then(res => res.data),

    leaveRoom: (roomId) =>
        api.post(`/chat/rooms/${roomId}/leave`).then(res => res.data),

    getUserRooms: () =>
        api.get('/chat/rooms/user').then(res => res.data),

    getRoomMembers: (roomId) =>
        api.get(`/chat/rooms/${roomId}/members`).then(res => res.data),

    updateMemberRole: (roomId, userId, role) =>
        api.put(`/chat/rooms/${roomId}/members/${userId}`, { role }),

    removeMember: (roomId, userId) =>
        api.delete(`/chat/rooms/${roomId}/members/${userId}`),
};

export default roomService;