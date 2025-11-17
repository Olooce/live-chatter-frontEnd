import {useCallback, useEffect, useState} from 'react';
import {roomService} from '../services/roomService';

export const useRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await roomService.getRooms();
            setRooms(response.rooms || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadUserRooms = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await roomService.getUserRooms();
            setUserRooms(response.rooms || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load user rooms');
        } finally {
            setLoading(false);
        }
    }, []);

    const createRoom = useCallback(async (roomData) => {
        setLoading(true);
        setError(null);
        try {
            const newRoom = await roomService.createRoom(roomData);
            setRooms(prev => [...prev, newRoom.room]);
            setUserRooms(prev => [...prev, newRoom.room]);
            return newRoom.room;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create room');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const joinRoom = useCallback(async (roomId) => {
        setLoading(true);
        setError(null);
        try {
            await roomService.joinRoom(roomId);
            const room = rooms.find(r => r.id === roomId) || await roomService.getRoom(roomId);
            setUserRooms(prev => [...prev, room]);
            setCurrentRoom(room);
            return room;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to join room');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [rooms]);

    const leaveRoom = useCallback(async (roomId) => {
        setLoading(true);
        setError(null);
        try {
            await roomService.leaveRoom(roomId);
            setUserRooms(prev => prev.filter(room => room.id !== roomId));
            if (currentRoom?.id === roomId) {
                setCurrentRoom(null);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to leave room');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currentRoom]);

    const selectRoom = useCallback((room) => {
        setCurrentRoom(room);
    }, []);

    useEffect(() => {
        loadRooms();
        loadUserRooms();
    }, [loadRooms, loadUserRooms]);

    return {
        rooms,
        userRooms,
        currentRoom,
        loading,
        error,
        createRoom,
        joinRoom,
        leaveRoom,
        selectRoom,
        refreshRooms: loadRooms,
        refreshUserRooms: loadUserRooms,
    };
};

export default useRooms;