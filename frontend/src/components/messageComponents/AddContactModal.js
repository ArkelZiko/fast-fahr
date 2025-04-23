/**
 * File:         AddContactModal.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  A modal component allowing users to search for another user by
 *               username to start a new chat conversation. Handles input, displays
 *               loading state, shows errors, and calls the parent's add contact handler.
*/

import React, { useState, useEffect } from 'react';
import '../css/messageCSS/modalStyles.css';

/**
 * Renders a modal for finding and adding a new chat contact.
 * @param {object} props - Component properties.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {function} props.onAddContact - Async function (passed from parent) to call when finding/adding a user. Should return true on success, false on failure.
 * @param {string} [props.initialUsername=''] - Optional username to pre-fill the input field.
 * @returns {JSX.Element} The AddContactModal component.
*/
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