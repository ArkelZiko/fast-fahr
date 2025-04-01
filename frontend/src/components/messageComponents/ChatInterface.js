import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage.js";
import "../css/messageCSS/chatInterface.css";

function ChatInterface({
    conversation,
    messages,
    isLoading, // Receive loading state
    onSendMessage,
    onDeleteChat, // Renamed to match MessagesPage prop
    currentUser // Receive current user info
 }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Use conversation object directly
  const otherUserId = conversation?.other_user_id; // ID of the person you're talking TO
  const userName = conversation?.userName;
  const userAvatar = conversation?.userAvatar;
  const defaultAvatar = 'https://i.pravatar.cc/150?img=10';

  // Scroll to bottom effect remains the same
  useEffect(() => {
    // Scroll immediately if not loading, otherwise wait a tiny bit after loading finishes
    const timer = setTimeout(() => {
         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, isLoading ? 100 : 0); // Delay slightly if was loading
    return () => clearTimeout(timer);
  }, [messages, isLoading]); // Trigger on messages change AND loading state change


  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSend = () => {
    if (newMessage.trim() && currentUser) { // Check if logged in
      onSendMessage({ text: newMessage });
      setNewMessage("");
    } else if (!currentUser) {
        alert("Please log in to send messages."); // Or redirect via requireAuth
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  }

  // Delete button click now calls the passed onDeleteChat prop
  // which will trigger the modal in MessagesPage
  const handleDeleteClick = () => {
      if (currentUser) { // Check if logged in
        onDeleteChat(); // Call the prop passed from MessagesPage
      } else {
         alert("Please log in to delete chats."); // Or redirect
      }
  };

  // Render loading state
  if (isLoading) {
      return (
           <div className="chat-interface">
              <header className="chat-header loading-header">
                  {/* Placeholder header while loading */}
                  <div className="chat-header-info">
                       <div className="chat-header-avatar placeholder-avatar"></div>
                       <h2 className="chat-header-username placeholder-username">Loading Chat...</h2>
                  </div>
              </header>
              <div className="message-list loading-messages">
                  <div className="spinner"></div> {/* Add a CSS spinner */}
                  <p>Loading messages...</p>
              </div>
               <footer className="chat-input-area disabled-input">
                   <input type="text" className="message-input" placeholder="Loading..." disabled />
                   <button className="send-button" disabled><i className="fas fa-spinner fa-spin"></i></button>
               </footer>
           </div>
      );
  }

  // Handle cases where conversation might be null/undefined after loading
  if (!conversation || !currentUser) {
      // This case should ideally be handled by the parent component (MessagesPage)
      // showing the "Select a conversation" message.
       return <div className="chat-interface">Error: Chat data missing or not logged in.</div>;
  }


  return (
    <div className="chat-interface">
      <header className="chat-header">
        <div className="chat-header-info">
          <img
            src={userAvatar || defaultAvatar}
            alt={`${userName || 'User'}'s avatar`}
            className="chat-header-avatar"
             onError={(e) => e.target.src = defaultAvatar}
          />
          <h2 className="chat-header-username">{userName || 'Unknown User'}</h2>
        </div>
        <button
          className="delete-chat-btn"
          onClick={handleDeleteClick} // Use the updated handler
          title="Delete Chat History"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </header>

      <div className="message-list">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id} // Use the actual message ID from backend
            message={msg}
            // Compare sender_id with the logged-in user's ID
            isCurrentUser={msg.senderId === currentUser.id}
          />
        ))}
        {/* Dummy div for scrolling */}
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