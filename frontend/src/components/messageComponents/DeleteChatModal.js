/**
 * File:         DeleteConfirmModal.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  A modal component used specifically for confirming the deletion
 *               of an entire chat conversation within the Messages page.
*/

import React from 'react';
import '../css/messageCSS/modalStyles.css';


/**
 * File:         DeleteConfirmModal.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 4th, 2025
 * Description:  A modal component used specifically for confirming the deletion
 *               of an entire chat conversation within the Messages page.
 */
import React from 'react';
// Assuming shared modal styles, adjust if specific to messages
import '../css/messageCSS/modalStyles.css';

/**
 * Renders a confirmation modal for deleting a chat conversation.
 * @param {object} props - Component properties.
 * @param {function} props.onClose - Function to call when closing the modal.
 * @param {function} props.onConfirmDelete - Function to call when the Delete button is clicked.
 * @param {string} props.userName - The username of the other participant in the chat.
 * @param {boolean} props.isLoading - Flag indicating if the deletion process is ongoing.
 * @returns {JSX.Element} The DeleteConfirmModal component.
*/
function DeleteConfirmModal({ onClose, onConfirmDelete, userName, isLoading }) {
   return (
       <div className="modal-overlay" onClick={onClose}>
           <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
               <div className="modal-header">
                   <h2>Delete Conversation</h2>
                    <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close" disabled={isLoading}>
                       ×
                   </button>
               </div>
               <div className="modal-body">
                   <p>Are you sure you want to permanently delete the entire chat history?</p>
                   <p className="warning-text">This action cannot be undone and will delete the chat for both users.</p>
               </div>
               <div className="modal-actions">
                   <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isLoading}>
                       <i className="fas fa-arrow-left"></i> Return
                   </button>
                   <button type="button" className="modal-confirm-btn delete-btn" onClick={onConfirmDelete} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : <><i className="fas fa-times"></i> Delete</>}
                   </button>
               </div>
           </div>
       </div>
   );
}

export default DeleteConfirmModal;