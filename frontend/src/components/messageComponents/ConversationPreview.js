import React from "react";
import "../css/messageCSS/conversationPreview.css";

function ConversationPreview({ conversation, isSelected, onSelect }) {
  const { userName, userAvatar, lastMessage, lastMessageTimestamp, unread } = conversation;
  const defaultAvatar = 'https://i.pravatar.cc/150?img=10';

  return (
    <div
      className={`conversation-preview ${isSelected ? "active" : ""} ${
        unread ? "unread" : ""
      }`}
      onClick={onSelect}
    >
      <img
        src={userAvatar || defaultAvatar}
        alt={`${userName}'s avatar`}
        className="preview-avatar"
        onError={(e) => e.target.src = defaultAvatar}
      />
      <div className="preview-details">
        <h3 className="preview-username">{userName || 'Unknown User'}</h3>
        <p className="preview-message">{lastMessage || '...'}</p>
      </div>
      <div className="preview-meta">
        <span className="preview-timestamp">{lastMessageTimestamp || ''}</span>
        {unread && <span className="unread-indicator">!</span>}
      </div>
    </div>
  );
}

export default ConversationPreview;