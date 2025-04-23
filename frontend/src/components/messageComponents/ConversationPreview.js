/**
 * File:         ConversationPreview.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Component representing a single conversation item in the conversation list.
 *               Displays the other user's avatar and name, the last message snippet,
 *               and indicates if there are unread messages. Handles selection clicks.
*/

import React from "react";
import "../css/messageCSS/conversationPreview.css";

/**
 * Renders a preview card for a single conversation.
 * @param {object} props - Component properties.
 * @param {object} props.conversation - Object containing conversation details (userName, userAvatar, lastMessage, unread, other_user_id).
 * @param {boolean} props.isSelected - Flag indicating if this conversation is currently selected.
 * @param {function} props.onSelect - Callback function triggered when the preview card is clicked.
 * @returns {JSX.Element} The ConversationPreview component.
*/
function ConversationPreview({ conversation, isSelected, onSelect }) {
  const { userName, userAvatar, lastMessage, unread } = conversation;
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
        {unread && <span className="unread-indicator">!</span>}
      </div>
    </div>
  );
}

export default ConversationPreview;