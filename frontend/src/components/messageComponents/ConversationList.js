/**
 * File:         ConversationList.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Component responsible for displaying the list of user conversations.
 *               Renders a header with an "Add Contact" button and maps over the
 *               conversations array to render ConversationPreview components.
*/

import React from "react";
import ConversationPreview from "./ConversationPreview";
import "../css/messageCSS/conversationList.css";

/**
 * Renders the list of conversations on the left side of the Messages page.
 * @param {object} props - Component properties.
 * @param {Array<object>} props.conversations - Array of conversation objects to display.
 * @param {number|string|null} props.selectedConversationId - The ID of the currently selected conversation.
 * @param {function} props.onSelectConversation - Callback function when a conversation is selected.
 * @param {function} props.onAddContact - Callback function to trigger opening the Add Contact modal.
 * @returns {JSX.Element} The ConversationList component.
*/
function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onAddContact,
}) {

  return (
    <div className="conversation-list-container">
      <div className="conversation-list-header">
        <h2>Chats</h2>
        <button
          className="add-contact-btn"
          onClick={onAddContact}
          title="Start New Chat"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="conversation-list">
        {conversations.length > 0 ? (
          conversations.map((convo) => (
            <ConversationPreview
              key={convo.other_user_id}
              conversation={convo}
              isSelected={convo.other_user_id === selectedConversationId}
              onSelect={() => onSelectConversation(convo.other_user_id)}
            />
          ))
        ) : (
          <p className="no-conversations">No conversations yet. Click '+' to start.</p>
        )}
      </div>
    </div>
  );
}

export default ConversationList;