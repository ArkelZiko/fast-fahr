import React from 'react';
import '../css/messageCSS/modalStyles.css'; // Use a shared modal CSS

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
                   <p>Are you sure you want to permanently delete the entire chat history with <strong>{userName || 'this user'}</strong>?</p>
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