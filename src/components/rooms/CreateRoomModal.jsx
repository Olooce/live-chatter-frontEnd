import React, {useState} from 'react';
import '../../assets/styles/CreateRoomModal.css';

const CreateRoomModal = ({onCreateRoom, onClose}) => {
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
        setRoomData({...roomData, [e.target.name]: e.target.value});
    };

    const isFormValid = roomData.name.trim().length >= 2;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2>Create New Room</h2>
                        <p>Start a new conversation space</p>
                    </div>
                    <button
                        className="close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="create-room-form">
                    {error && (
                        <div className="error-message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v4M12 16h.01"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Room Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={roomData.name}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            placeholder="Enter room name..."
                            className="form-input"
                            disabled={loading}
                        />
                        <div className="form-hint">
                            {roomData.name.length}/50 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={roomData.description}
                            onChange={handleChange}
                            maxLength={255}
                            rows={3}
                            placeholder="What's this room about?..."
                            className="form-textarea"
                            disabled={loading}
                        />
                        <div className="form-hint">
                            {roomData.description.length}/255 characters
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="type" className="form-label">
                            Room Type
                        </label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="public"
                                    checked={roomData.type === 'public'}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span className="radio-custom"></span>
                                <div className="radio-content">
                                    <span className="radio-label">Public Room</span>
                                    <span className="radio-description">Anyone can join</span>
                                </div>
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="private"
                                    checked={roomData.type === 'private'}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <span className="radio-custom"></span>
                                <div className="radio-content">
                                    <span className="radio-label">Private Room</span>
                                    <span className="radio-description">Invite only</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="create-btn"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <>
                                    <div className="button-spinner"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Room'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;