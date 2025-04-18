import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ConversationList from "../components/messageComponents/ConversationList.js";
import ChatInterface from "../components/messageComponents/ChatInterface.js";
import AddContactModal from "../components/messageComponents/AddContactModal.js";
import DeleteConfirmModal from "../components/messageComponents/DeleteConfirmModal.js";

import "../components/css/messageCSS/messagesPage.css";

function MessagesPage() {
    const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [selectedOtherUserId, setSelectedOtherUserId] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState('');
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [addContactError, setAddContactError] = useState('');

    const pollingIntervalRef = useRef(null);
    const POLLING_RATE_MS = 15000; // poll every 15 seconds

    const fetchConversations = useCallback(async (isInitialLoad = false) => {
        if (!currentUser) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/get_conversations.php`, { credentials: 'include' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
            }
            const serverConversations = await response.json();

            if (!Array.isArray(serverConversations)) {
                 if (serverConversations.error) {
                     throw new Error(serverConversations.error);
                 } else {
                    console.warn("Received unexpected data format for conversations:", serverConversations);
                    if (isInitialLoad) setConversations([]);
                    return;
                 }
            }

            setConversations(currentConversations => {
                const serverConvoMap = new Map(serverConversations.map(convo => [convo.other_user_id, convo]));
                const combinedConversations = [];

                serverConversations.forEach(serverConvo => {
                    combinedConversations.push({ ...serverConvo, isPlaceholder: false });
                });

                currentConversations.forEach(currentConvo => {
                    if (currentConvo.isPlaceholder && !serverConvoMap.has(currentConvo.other_user_id)) {
                        combinedConversations.push(currentConvo);
                    }
                });

                combinedConversations.sort((a, b) => {
                    const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : Date.now();
                    const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : Date.now();
                    return timeB - timeA;
                });

                return combinedConversations;
            });

        } catch (err) {
            console.error("Failed to fetch/process conversations:", err);
            if (isInitialLoad) {
                setError(`Failed to load conversations: ${err.message}. Please refresh.`);
                setConversations([]);
            } else {
                console.error("Polling error fetching conversations:", err);
            }
        }
    }, [currentUser]);

    const fetchMessages = useCallback(async (otherUserId) => {
        if (!currentUser || !otherUserId) return;

        setIsLoadingMessages(true);
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/get_messages.php?other_user_id=${otherUserId}`, { credentials: 'include' });
             if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
             }
             const data = await response.json();
            if (Array.isArray(data)) {
                setMessages(prev => ({ ...prev, [otherUserId]: data }));
            } else if (data.error) {
                 throw new Error(data.error);
            } else {
                 console.warn(`Received unexpected data format for messages with user ${otherUserId}:`, data);
                 setMessages(prev => ({ ...prev, [otherUserId]: [] }));
            }
        } catch (err) {
             console.error(`Failed to fetch messages for user ${otherUserId}:`, err);
             setError(`Failed to load messages for this chat: ${err.message}`);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [currentUser]);

    useEffect(() => {
        let isMounted = true;
        if (!authLoading) {
            if (!requireAuth()) {
                return;
            }
            setIsLoadingConversations(true);
            fetchConversations(true)
                .catch((err) => {
                    console.error("Initial conversation fetch trigger failed:", err);
                })
                .finally(() => {
                    if (isMounted) {
                        setIsLoadingConversations(false);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [authLoading, requireAuth, fetchConversations]);

     useEffect(() => {
         let intervalId = null;

         if (!currentUser || authLoading || isLoadingConversations) {
             if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
              }
             return;
         }

         if (!pollingIntervalRef.current) {
             intervalId = setInterval(() => {
                 fetchConversations(false);
                 if (selectedOtherUserId) {
                     fetchMessages(selectedOtherUserId);
                 }
             }, POLLING_RATE_MS);
             pollingIntervalRef.current = intervalId;
         }

         return () => {
              if (intervalId) {
                 clearInterval(intervalId);
              }
              if (pollingIntervalRef.current === intervalId) {
                  pollingIntervalRef.current = null;
              }
         };
     }, [currentUser, authLoading, isLoadingConversations, selectedOtherUserId, fetchConversations, fetchMessages]);

    const handleSelectConversation = useCallback((otherUserId) => {
        if (!requireAuth()) return;
        if (otherUserId === selectedOtherUserId) return;

        setSelectedOtherUserId(otherUserId);
        if (!isLoadingMessages) {
             fetchMessages(otherUserId);
        }

        const selectedConvo = conversations.find(c => c.other_user_id === otherUserId);

        if (selectedConvo && selectedConvo.unread) {
             fetch(`${process.env.REACT_APP_API_BASE}/messages/mark_read.php`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ sender_id: otherUserId }),
                 credentials: 'include'
             }).then(response => {
                 if (!response.ok) console.error("Mark read API call failed:", response.status);
             }).catch(err => console.error("Failed mark read API call:", err));

             setConversations(prev =>
                 prev.map(convo =>
                     convo.other_user_id === otherUserId ? { ...convo, unread: false } : convo
                 )
             );
        }

    }, [requireAuth, selectedOtherUserId, fetchMessages, conversations, isLoadingMessages]);

    const handleAddMessage = useCallback(async (newMessageData) => {
        if (!requireAuth() || !selectedOtherUserId) return;

        const tempId = `temp_${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            senderId: currentUser.id,
            receiverId: selectedOtherUserId,
            senderName: currentUser.username || "You",
            senderAvatar: currentUser.profile_picture || 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            text: newMessageData.text,
            timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
            isRead: false,
            isSending: true
        };

        setMessages(prev => ({
             ...prev,
             [selectedOtherUserId]: [...(prev[selectedOtherUserId] || []), optimisticMessage]
        }));

        setConversations(prev => {
            const nowISO = new Date().toISOString();
            return prev.map(convo =>
                convo.other_user_id === selectedOtherUserId
                    ? { ...convo, lastMessage: optimisticMessage.text, lastMessageTimestamp: nowISO, isPlaceholder: false }
                    : convo
            ).sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
        });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/send_message.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver_id: selectedOtherUserId, content: newMessageData.text }),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || `Failed to send message (HTTP ${response.status})`);
            }

            const realMessage = result.newMessage;
            setMessages(prev => {
                const currentChatMessages = prev[selectedOtherUserId] || [];
                const finalMessages = currentChatMessages
                    .filter(msg => msg.id !== tempId)
                    .filter(msg => msg.id !== realMessage.id);

                finalMessages.push({ ...realMessage, isSending: false });

                return { ...prev, [selectedOtherUserId]: finalMessages };
            });

             setConversations(prev => {
                  return prev.map(convo =>
                      convo.other_user_id === selectedOtherUserId
                          ? { ...convo,
                              lastMessage: realMessage.text,
                              lastMessageTimestamp: new Date(realMessage.sent_at || Date.now()).toISOString(),
                              isPlaceholder: false
                            }
                          : convo
                  ).sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));
             });

        } catch (err) {
            console.error("Failed to send message:", err);
            setError(`Failed to send message: ${err.message}. Please try again.`);
            setMessages(prev => ({
                ...prev,
                [selectedOtherUserId]: (prev[selectedOtherUserId] || []).filter(msg => msg.id !== tempId)
            }));
            setMessages(prev => {
                 const currentMsgs = prev[selectedOtherUserId] || [];
                 return {
                     ...prev,
                     [selectedOtherUserId]: currentMsgs.map(msg =>
                         msg.id === tempId ? { ...msg, isSending: false, error: 'Failed to send' } : msg
                     )
                 };
             });
        }
    }, [currentUser, requireAuth, selectedOtherUserId]);

    const openDeleteModal = useCallback((otherUserId, userName) => {
        if (!requireAuth()) return;
        setUserToDelete({ id: otherUserId, name: userName });
        setIsDeleteConfirmModalOpen(true);
    }, [requireAuth]);

    const closeDeleteModal = useCallback(() => {
        if (isDeleting) return;
        setIsDeleteConfirmModalOpen(false);
        setUserToDelete(null);
    }, [isDeleting]);

    const handleConfirmDeleteChat = useCallback(async () => {
        if (!userToDelete || !requireAuth()) return;
        setIsDeleting(true);
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/delete_conversation.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ other_user_id: userToDelete.id }),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || (result.success !== undefined && !result.success)) {
                 throw new Error(result.error || `HTTP error ${response.status}`);
             }

            setConversations(prev => prev.filter(c => c.other_user_id !== userToDelete.id));
            setMessages(prev => {
                const next = {...prev};
                delete next[userToDelete.id];
                return next;
            });
            if (selectedOtherUserId === userToDelete.id) {
                setSelectedOtherUserId(null);
            }
            closeDeleteModal();

        } catch (err) {
            console.error("Failed to delete conversation:", err);
            setError(`Failed to delete conversation: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    }, [userToDelete, requireAuth, selectedOtherUserId, closeDeleteModal]);

    const openAddContactModal = useCallback(() => {
        if (!requireAuth()) return;
        setAddContactError('');
        setIsAddContactModalOpen(true);
    }, [requireAuth]);

    const closeAddContactModal = useCallback(() => setIsAddContactModalOpen(false), []);

    const handleFindAndAddContact = useCallback(async (usernameToAdd) => {
        if (!requireAuth()) return false;
        setAddContactError('');
        let success = false;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/find_user.php?username=${encodeURIComponent(usernameToAdd)}`, { credentials: 'include' });
            const result = await response.json();

            if (!response.ok || !result.success) {
                setAddContactError(result.message || result.error || `Could not find user "${usernameToAdd}".`);
            } else {
                const foundUser = result.user;
                const existingConvo = conversations.find(c => c.other_user_id === foundUser.id);

                if (existingConvo) {
                    handleSelectConversation(foundUser.id);
                } else {
                    const newPlaceholderConvo = {
                        other_user_id: foundUser.id,
                        userName: foundUser.username,
                        userAvatar: foundUser.avatar || 'https://i.pravatar.cc/150?img=10',
                        lastMessage: 'Chat started',
                        lastMessageTimestamp: new Date().toISOString(),
                        unread: false,
                        isPlaceholder: true
                    };

                    setConversations(prev =>
                         [...prev, newPlaceholderConvo]
                         .sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp))
                     );

                    setMessages(prev => ({ ...prev, [foundUser.id]: [] }));
                    handleSelectConversation(foundUser.id);
                }
                closeAddContactModal();
                success = true;
            }
        } catch (err) {
            console.error("Failed to find/add user:", err);
            setAddContactError('An error occurred while searching for the user. Please try again.');
        }
        return success;
    }, [requireAuth, conversations, handleSelectConversation, closeAddContactModal]);

    const selectedConversation = conversations.find(c => c.other_user_id === selectedOtherUserId);
    const currentMessages = selectedOtherUserId ? (messages[selectedOtherUserId] || []) : [];

    if (authLoading) {
        return ( <div> <Header /> <NavBar /> <div className="loading-page">Checking authentication...</div> </div> );
    }
    if (!currentUser) {
        return ( <div> <Header /> <NavBar /> <div className="loading-page">Please log in to view messages.</div> </div> );
    }

    return (
        <div>
            <Header />
            <NavBar />
            <div className="messages-page">
                <div className="conversation-list-area">
                    {isLoadingConversations ? (
                        <div className="loading-conversations">Loading Chats...</div>
                    ) : (
                        <ConversationList
                            conversations={conversations}
                            selectedConversationId={selectedOtherUserId}
                            onSelectConversation={handleSelectConversation}
                            onAddContact={openAddContactModal}
                            currentUser={currentUser}
                        />
                    )}
                </div>
                <div className="chat-interface-area">
                    {error && <div className="error-banner">{error}</div>}

                    {selectedConversation ? (
                        <ChatInterface
                            key={selectedOtherUserId}
                            conversation={selectedConversation}
                            messages={currentMessages}
                            isLoading={isLoadingMessages && selectedOtherUserId === selectedConversation.other_user_id}
                            onSendMessage={handleAddMessage}
                            onDeleteChat={() => openDeleteModal(selectedConversation.other_user_id, selectedConversation.userName)}
                            currentUser={currentUser}
                        />
                    ) : (
                        !isLoadingConversations && conversations.length === 0 ? (
                            <div className="no-chat-selected">
                                <h2>No conversations yet</h2>
                                <p>Click the '+' button in the Chats list to find someone to message.</p>
                            </div>
                        ) : !isLoadingConversations ? (
                             <div className="no-chat-selected">
                                <h2>Select a conversation</h2>
                                <p>Choose a chat from the list on the left to view messages.</p>
                            </div>
                        ) : null
                    )}
                </div>
            </div>

            {isAddContactModalOpen && (
                <AddContactModal
                    onClose={closeAddContactModal}
                    onAddContact={handleFindAndAddContact}
                    initialError={addContactError}
                />
            )}
            {isDeleteConfirmModalOpen && userToDelete && (
                <DeleteConfirmModal
                    onClose={closeDeleteModal}
                    onConfirmDelete={handleConfirmDeleteChat}
                    userName={userToDelete.name}
                    isLoading={isDeleting}
                    error={isDeleting ? '' : error}
                />
            )}
        </div>
    );
}

export default MessagesPage;