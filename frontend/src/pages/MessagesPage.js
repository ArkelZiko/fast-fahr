import React, { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ConversationList from "../components/messageComponents/ConversationList.js";
import ChatInterface from "../components/messageComponents/ChatInterface.js";
import "../components/css/messageCSS/messagesPage.css";
import { sampleMessages, sampleConversations } from "../components/data/conversations.js";



function MessagesPage() {
  const [conversations, setConversations] = useState(sampleConversations);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations.length > 0 ? conversations[0].id : null
  );

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
  };

  const handleAddMessage = (newMessageData) => {


    if (!selectedConversationId) return;

    const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: "currentUser",
        senderName: "You",
        senderAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        text: newMessageData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => {
        const updatedConvoMessages = [
            ...(prevMessages[selectedConversationId] || []),
            newMessage
        ];
        return {
            ...prevMessages,
            [selectedConversationId]: updatedConvoMessages
        };
    });

     setConversations(prevConversations =>
        prevConversations.map(convo =>
          convo.id === selectedConversationId
            ? {
                ...convo,
                lastMessage: newMessage.text,
                lastMessageTimestamp: newMessage.timestamp,
              }
            : convo
        )
      );
  };

  const handleDeleteChat = (conversationId) => {
      console.log("Deleting chat:", conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      setMessages(prev => {
          const newMessages = {...prev};
          delete newMessages[conversationId];
          return newMessages;
      });
      setSelectedConversationId(prevId => {
          if (prevId === conversationId) {
              const remainingConversations = conversations.filter(c => c.id !== conversationId);
              return remainingConversations.length > 0 ? remainingConversations[0].id : null;
          }
          return prevId;
      });
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

  return (
    <div>
      <Header />
      <NavBar />

      <div className="messages-page">
        <div className="conversation-list-area">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div className="chat-interface-area">
          {selectedConversation ? (
            <ChatInterface
              conversation={selectedConversation}
              messages={currentMessages}
              onSendMessage={handleAddMessage}
              onDeleteChat={handleDeleteChat}
            />
          ) : (
            <div className="no-chat-selected">
              <h2>Select a conversation</h2>
              <p>Choose a chat from the list on the left or add a new contact.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;