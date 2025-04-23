/**
 * File:         ChatInterface.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 3rd, 2025
 * Description:  Component representing the main chat window for a selected conversation.
 *               Displays the chat header (other user's info), the list of messages,
 *               and the input area for sending new messages. Handles scrolling to
 *               the bottom and message input/sending actions.
*/

import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage.js";
import "../css/messageCSS/chatInterface.css";


/**
 * Renders the main chat interface for a selected conversation.
 * @param {object} props - Component properties.
 * @param {object} props.conversation - The currently selected conversation object.
 * @param {Array<object>} props.messages - Array of message objects for the current conversation.
 * @param {boolean} props.isLoading - Flag indicating if messages are currently loading.
 * @param {function} props.onSendMessage - Callback function to send a new message.
 * @param {function} props.onDeleteChat - Callback function to initiate chat deletion.
 * @param {object} props.currentUser - The currently logged-in user object.
 * @returns {JSX.Element} The ChatInterface component.
*/
function ChatInterface({
    conversation,
    messages,
    isLoading,
    onSendMessage,
    onDeleteChat,
    currentUser
 }) {

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const userName = conversation?.userName;
  const userAvatar = conversation?.userAvatar;
  const defaultAvatar = 'https://i.pravatar.cc/150?img=10';

  useEffect(() => {
    const timer = setTimeout(() => {
         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, isLoading ? 100 : 0);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);


  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSend = () => {
    if (newMessage.trim() && currentUser) {
      onSendMessage({ text: newMessage });
      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
  }

  const handleDeleteClick = () => {
      if (currentUser) {
        onDeleteChat();
      }
  };

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
                  <div className="spinner"></div>
                  <p>Loading messages...</p>
              </div>
               <footer className="chat-input-area disabled-input">
                   <input type="text" className="message-input" placeholder="Loading..." disabled />
                   <button className="send-button" disabled><i className="fas fa-spinner fa-spin"></i></button>
               </footer>
           </div>
      );
  }

  if (!conversation || !currentUser) {
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