import React from "react";
import "../css/messageCSS/conversationPreview.css";

// Expecting the conversation object structure from the backend
function ConversationPreview({ conversation, isSelected, onSelect }) {
  // Destructure fields based on backend response
  const { userName, userAvatar, lastMessage, lastMessageTimestamp, unread } = conversation;
  const defaultAvatar = 'https://i.pravatar.cc/150?img=10'; // Fallback avatar

  return (
    <div
      className={`conversation-preview ${isSelected ? "active" : ""} ${
        unread ? "unread" : "" // Use the boolean 'unread' flag
      }`}
      onClick={onSelect}
    >
      <img
        src={userAvatar || defaultAvatar} // Use default if null/empty
        alt={`${userName}'s avatar`}
        className="preview-avatar"
        onError={(e) => e.target.src = defaultAvatar} // Handle image load errors
      />
      <div className="preview-details">
        <h3 className="preview-username">{userName || 'Unknown User'}</h3>
        {/* Add check for empty/null last message */}
        <p className="preview-message">{lastMessage || '...'}</p>
      </div>
      <div className="preview-meta">
         {/* Add check for timestamp */}
        <span className="preview-timestamp">{lastMessageTimestamp || ''}</span>
         {/* Render indicator based on boolean */}
        {unread && <span className="unread-indicator">!</span>}
      </div>
    </div>
  );
}

export default ConversationPreview;