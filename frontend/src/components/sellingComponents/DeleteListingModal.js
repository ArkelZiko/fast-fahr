/**
 * File:         DeleteListingModal.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 19th, 2025
 * Description:  A reusable modal component specifically for confirming the deletion
 *               of a user's listing. Displays the listing title and requires
 *               confirmation before triggering the delete action.
*/

import React from 'react';
import '../css/messageCSS/modalStyles.css';


/**
 * Renders a confirmation modal for deleting a listing.
 * @param {object} props - Component properties.
 * @param {string} props.listingTitle - The title of the listing to confirm deletion for.
 * @param {function} props.onClose - Function to call when closing the modal (via overlay click or Cancel button).
 * @param {function} props.onConfirmDelete - Function to call when the Delete button is clicked.
 * @param {boolean} props.isLoading - Flag to indicate if the delete operation is in progress (disables buttons).
 * @returns {JSX.Element} The DeleteListingModal component.
*/
function DeleteListingModal({ listingTitle, onClose, onConfirmDelete, isLoading }) {
   return (
       <div className="modal-overlay" onClick={onClose}>
           <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
               <div className="modal-header">
                   <h2>Delete Listing</h2>
                    <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close" disabled={isLoading}>
                       ×
                   </button>
               </div>
               <div className="modal-body">
                   <p>Are you sure you want to permanently delete this listing?</p>
                   <p className="warning-text">This action cannot be undone.</p>
               </div>
               <div className="modal-actions">
                   <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isLoading}>
                        <i className="fas fa-arrow-left"></i> Cancel
                   </button>
                   <button type="button" className="modal-confirm-btn delete-btn" onClick={onConfirmDelete} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : <><i className="fas fa-trash-alt"></i> Delete</>}
                   </button>
               </div>
           </div>
       </div>
   );
}

export default DeleteListingModal;