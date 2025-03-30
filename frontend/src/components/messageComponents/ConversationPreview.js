import React from "react";
import "../css/messageCSS/conversationPreview.css"

function ConversationPreview({ conversation, isSelected, onSelect }) {
  const { userName, userAvatar, lastMessage, lastMessageTimestamp, unread } =
    conversation;

  return (
    <div
      className={`conversation-preview ${isSelected ? "active" : ""} ${
        unread ? "unread" : ""
      }`}
      onClick={onSelect}
    >
      <img
        src={userAvatar}
        alt={`${userName}'s avatar`}
        className="preview-avatar"
      />
      <div className="preview-details">
        <h3 className="preview-username">{userName}</h3>
        <p className="preview-message">{lastMessage}</p>
      </div>
      <div className="preview-meta">
        <span className="preview-timestamp">{lastMessageTimestamp}</span>
        {unread && <span className="unread-indicator">!</span>}
      </div>
    </div>
  );
}

export default ConversationPreview;