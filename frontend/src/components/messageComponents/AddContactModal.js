import React, { useState, useEffect } from 'react';
import '../css/messageCSS/modalStyles.css';

function AddContactModal({ onClose, onAddContact, initialUsername = '' }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
        setError('');
    }, [initialUsername]);

    const handleInputChange = (e) => {
        setUsername(e.target.value);
        if (error) {
            setError('');
        }
    };

    const handleAdd = async () => {
        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }

        setError('');
        setIsLoading(true);
        let success = false;

        try {
            success = await onAddContact(username.trim());

            if (!success) {
                setError(`Could not find or add user "${username.trim()}". Please check the username or try again.`);
            }

        } catch (err) {
             setError('An unexpected error occurred. Please try again.');
             success = false;
        } finally {
             setIsLoading(false);
             if (success) {
                 onClose();
             }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-contact-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Start a New Chat</h2>
                    <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close" disabled={isLoading}>
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <p>Enter the username of the person you want to message.</p>
                    <input
                        type="text"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className={`username-input ${error ? 'input-error' : ''}`}
                        disabled={isLoading}
                        aria-invalid={!!error}
                        aria-describedby={error ? "add-contact-error-msg" : undefined}
                    />
                    {error && <p id="add-contact-error-msg" className="modal-error">{error}</p>}
                </div>
                <div className="modal-actions">
                    <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </button>
                    <button type="button" className="modal-confirm-btn add-btn" onClick={handleAdd} disabled={isLoading || !username.trim()}>
                        {isLoading ? 'Searching...' : <><i className="fas fa-search"></i> Find User</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddContactModal;