import React from "react";
import ConversationPreview from "./ConversationPreview";
import "../css/messageCSS/conversationList.css";

// Receive onAddContact prop
function ConversationList({
  conversations,
  selectedConversationId, // This is actually selectedOtherUserId
  onSelectConversation,
  onAddContact, // Prop to trigger modal opening
  currentUser
}) {

  // No longer need the prompt handler here
  // const handleAddContactClick = () => { ... };

  return (
    <div className="conversation-list-container">
      <div className="conversation-list-header">
        <h2>Chats</h2>
        {/* Call the passed onAddContact handler */}
        <button
          className="add-contact-btn"
          onClick={onAddContact}
          title="Start New Chat"
        >
          <i className="fas fa-plus"></i> {/* Use Font Awesome icon */}
        </button>
      </div>
      <div className="conversation-list">
        {conversations.length > 0 ? (
          conversations.map((convo) => (
            <ConversationPreview
              key={convo.other_user_id} // Use a stable unique key
              conversation={convo} // Pass the whole convo object
              // Compare other_user_id for selection state
              isSelected={convo.other_user_id === selectedConversationId}
              // Pass other_user_id to the select handler
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