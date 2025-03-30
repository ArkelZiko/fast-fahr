import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage.js";
import "../css/messageCSS/chatInterface.css"; // Ensure this path is correct

// Assuming you have Font Awesome CSS linked in your project (e.g., in public/index.html)
// If you are using the react-fontawesome library, you'd need imports like:
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaperPlane, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function ChatInterface({ conversation, messages, onSendMessage, onDeleteChat }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  // Ensure conversation is defined before destructuring
  const conversationId = conversation?.id;
  const userName = conversation?.userName;
  const userAvatar = conversation?.userAvatar;

  // Scroll to bottom when messages change or conversation loads
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage({ text: newMessage });
      setNewMessage(""); // Clear input after sending
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
        event.preventDefault(); // Prevent default newline on Enter
        handleSend();
    }
  }

  const handleDeleteClick = () => {
    // Add a check for userName in case conversation is briefly undefined during state changes
    const confirmMessage = userName
      ? `Are you sure you want to delete the chat with ${userName}? This cannot be undone.`
      : `Are you sure you want to delete this chat? This cannot be undone.`;

    if (window.confirm(confirmMessage)) {
        if (conversationId) { // Ensure we have an ID to delete
          onDeleteChat(conversationId);
        } else {
          console.error("Cannot delete chat: conversationId is missing.");
        }
    }
  };

  // Handle cases where conversation might not be loaded yet
  if (!conversation) {
      return <div className="chat-interface">Loading chat...</div>; // Or some placeholder
  }

  return (
    <div className="chat-interface">
      <header className="chat-header">
        <div className="chat-header-info">
          <img
            src={userAvatar}
            alt={`${userName}'s avatar`}
            className="chat-header-avatar"
          />
          <h2 className="chat-header-username">{userName}</h2>
        </div>
        <button
          className="delete-chat-btn"
          onClick={handleDeleteClick}
          title="Delete Chat History"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </header>

      <div className="message-list">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderId === "currentUser"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-input-area">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className="send-button" onClick={handleSend} title="Send Message">
           <i className="fas fa-paper-plane"></i>
        </button>
      </footer>
    </div>
  );
}

export default ChatInterface;