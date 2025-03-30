import React from "react";
import "../css/messageCSS/chatMessage.css"; 

function ChatMessage({ message, isCurrentUser }) {
  const { senderName, senderAvatar, text, timestamp } = message;

  return (
    <div className={`chat-message ${isCurrentUser ? "sent" : "received"}`}>
      <img
        src={senderAvatar}
        alt={`${senderName}'s avatar`}
        className="message-avatar"
      />
      <div className="message-content">
        <span className="message-sender-name">{senderName}</span>
        <div className="message-bubble">
          <p className="message-text">{text}</p>
        </div>
        <span className="message-timestamp">{timestamp}</span>
      </div>
    </div>
  );
}

export default ChatMessage;