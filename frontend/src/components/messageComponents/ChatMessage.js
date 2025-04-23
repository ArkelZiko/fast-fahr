/**
 * File:         ChatMessage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Component representing a single message bubble within the chat interface.
 *               Styles differently based on whether the message was sent or received
 *               by the current user. Displays sender avatar, name (for received),
 *               message text, and timestamp/status.
*/

import React from "react";
import "../css/messageCSS/chatMessage.css";

/**
 * Renders a single chat message bubble.
 * @param {object} props - Component properties.
 * @param {object} props.message - The message object containing details (senderName, senderAvatar, text, timestamp, isSending).
 * @param {boolean} props.isCurrentUser - Flag indicating if the message was sent by the currently logged-in user.
 * @returns {JSX.Element} The ChatMessage component.
*/
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