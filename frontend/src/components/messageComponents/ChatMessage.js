import React from "react";
import "../css/messageCSS/chatMessage.css";

function ChatMessage({ message, isCurrentUser }) {
  const { senderName, senderAvatar, text, timestamp, isSending } = message;
  const defaultAvatar = 'https://i.pravatar.cc/150?img=10';

  const messageClasses = `chat-message ${isCurrentUser ? "sent" : "received"} ${isSending ? "sending" : ""}`;

  return (
    <div className={messageClasses}>
      {!isCurrentUser && (
           <img
             src={senderAvatar || defaultAvatar}
             alt={`${senderName || 'User'}'s avatar`}
             className="message-avatar"
             onError={(e) => e.target.src = defaultAvatar}
           />
      )}
      <div className="message-content">
        {/* Only show sender name for received messages */}
        {!isCurrentUser && <span className="message-sender-name">{senderName || 'Unknown User'}</span>}
        <div className="message-bubble">
          <p className="message-text">{text}</p>
        </div>
         {isSending ? (
             <span className="message-timestamp sending-status">Sending...</span>
         ) : (
             <span className="message-timestamp">{timestamp || ''}</span>
         )}
      </div>
       {isCurrentUser && (
           <img
             src={senderAvatar || defaultAvatar}
             alt={`${senderName || 'Your'}'s avatar`}
             className="message-avatar"
             onError={(e) => e.target.src = defaultAvatar}
           />
       )}
    </div>
  );
}

export default ChatMessage;