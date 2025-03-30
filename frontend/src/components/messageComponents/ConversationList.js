import React from "react";
import ConversationPreview from "./ConversationPreview";
import "../css/messageCSS/conversationList.css"; // We'll create this

function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) {
  const handleAddContactClick = () => {
    const contactInfo = prompt("Enter username or email to add contact:");
    if (contactInfo) {
      alert(`Adding contact: ${contactInfo} (Feature not implemented)`);
    }
  };

  return (
    <div className="conversation-list-container">
      <div className="conversation-list-header">
        <h2>Chats</h2>
        <button
          className="add-contact-btn"
          onClick={handleAddContactClick}
          title="Add Contact"
        >

          + 
        </button>
      </div>
      <div className="conversation-list">
        {conversations.length > 0 ? (
          conversations.map((convo) => (
            <ConversationPreview
              key={convo.id}
              conversation={convo}
              isSelected={convo.id === selectedConversationId}
              onSelect={() => onSelectConversation(convo.id)}
            />
          ))
        ) : (
          <p className="no-conversations">No conversations yet.</p>
        )}
      </div>
    </div>
  );
}

export default ConversationList;