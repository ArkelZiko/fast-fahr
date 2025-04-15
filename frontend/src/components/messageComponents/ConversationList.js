import React from "react";
import ConversationPreview from "./ConversationPreview";
import "../css/messageCSS/conversationList.css";

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