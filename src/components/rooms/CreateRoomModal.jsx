import React, { useState } from 'react';
import '../../assets/styles/CreateRoomModal.css'

const CreateRoomModal = ({ onCreateRoom, onClose }) => {
    const [roomData, setRoomData] = useState({
        name: '',
        description: '',
        type: 'public'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onCreateRoom(roomData);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setRoomData({ ...roomData, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Room</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="create-room-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Room Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={roomData.name}
                            onChange={handleChange}
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={roomData.description}
                            onChange={handleChange}
                            maxLength={255}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Room Type</label>
                        <select
                            id="type"
                            name="type"
                            value={roomData.type}
                            onChange={handleChange}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="create-btn"
                            disabled={loading || !roomData.name.trim()}
                        >
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;