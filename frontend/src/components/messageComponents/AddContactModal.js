import React, { useState } from 'react';
import '../css/messageCSS/modalStyles.css';

function AddContactModal({ onClose, onAddContact }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAdd = async () => {
        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // Call the backend API passed down via onAddContact prop
            const success = await onAddContact(username);
            if (success) {
                onClose(); // Close modal on successful add/find
            } else {
                // Error message should be set by the parent handler calling this
            }
        } catch (err) {
             // Error handling if the promise rejects unexpectedly
             console.error("Error in handleAdd:", err);
             setError('An unexpected error occurred.');
        } finally {
             setIsLoading(false);
        }
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-contact-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Start a New Chat</h2>
                    <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <p>Enter the username of the person you want to message.</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="username-input"
                        disabled={isLoading}
                    />
                    {error && <p className="modal-error">{error}</p>}
                </div>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="button" className="modal-confirm-btn add-btn" onClick={handleAdd} disabled={isLoading}>
                        {isLoading ? 'Searching...' : <><i className="fas fa-plus"></i> Find User</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddContactModal;