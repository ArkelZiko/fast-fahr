import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ConversationList from "../components/messageComponents/ConversationList.js";
import ChatInterface from "../components/messageComponents/ChatInterface.js";
import AddContactModal from "../components/messageComponents/AddContactModal.js";
import DeleteConfirmModal from "../components/messageComponents/DeleteChatModal.js";

import "../components/css/messageCSS/messagesPage.css";

function MessagesPage() {
    const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [selectedOtherUserId, setSelectedOtherUserId] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState('');
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [prefillUsername, setPrefillUsername] = useState('');
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [addContactError, setAddContactError] = useState('');

    const pollingIntervalRef = useRef(null);
    const POLLING_RATE_MS = 7000;

    const fetchConversations = useCallback(async (isInitialLoad = false) => {
        if (!currentUser) return [];

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/get_conversations.php`, { credentials: 'include' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
            }
            const serverConversationsData = await response.json();

            if (!Array.isArray(serverConversationsData)) {
                 if (serverConversationsData.error) {
                     throw new Error(serverConversationsData.error);
                 } else {
                     if (isInitialLoad) setConversations([]);
                    return [];
                 }
            }

            const serverConversations = serverConversationsData.map(convo => ({
                ...convo,
                isPlaceholder: false,
                lastMessageTimestamp: convo.lastMessageTimestamp ? new Date(convo.lastMessageTimestamp).toISOString() : null
            }));

            setConversations(currentConversations => {
                const serverConvoMap = new Map(serverConversations.map(convo => [convo.other_user_id, convo]));
                const nextStateConversations = [...serverConversations];

                currentConversations.forEach(currentConvo => {
                    if (currentConvo.isPlaceholder && !serverConvoMap.has(currentConvo.other_user_id)) {
                        nextStateConversations.push(currentConvo);
                    }
                });

                 const uniqueConversationsMap = new Map(nextStateConversations.map(convo => [convo.other_user_id, convo]));
                 const uniqueConversations = Array.from(uniqueConversationsMap.values());

                uniqueConversations.sort((a, b) => {
                    const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
                    const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
                    return timeB - timeA;
                });

                return uniqueConversations;
            });

            return serverConversations;

        } catch (err) {
            if (isInitialLoad) {
                setError(`Failed to load conversations: ${err.message}. Please refresh.`);
                setConversations([]);
            }
             return [];
        }
    }, [currentUser]);


    const fetchMessages = useCallback(async (otherUserId) => {
        if (!currentUser || !otherUserId) return;
        setIsLoadingMessages(true);
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
                 setMessages(prev => ({ ...prev, [otherUserId]: [] }));
            }
        } catch (err) {
             setError(`Failed to load messages for this chat: ${err.message}`);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [currentUser]);

     const handleSelectConversation = useCallback((otherUserId) => {
        if (!requireAuth()) return;
        if (otherUserId === selectedOtherUserId) return;
        setSelectedOtherUserId(otherUserId);
        setError('');
        if (!isLoadingMessages) {
             fetchMessages(otherUserId);
        }
        setConversations(prevConversations => {
            const selectedConvo = prevConversations.find(c => c.other_user_id === otherUserId);

            if (selectedConvo && selectedConvo.unread) {
                fetch(`${process.env.REACT_APP_API_BASE}/messages/mark_read.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sender_id: otherUserId }),
                    credentials: 'include'
                }).then(response => {
                    if (!response.ok) {} // No action on error, just log silently if needed
                }).catch(err => {}); // No action on error

                 return prevConversations.map(convo =>
                        convo.other_user_id === otherUserId ? { ...convo, unread: false } : convo
                 );
            }
            return prevConversations;
        });

    }, [requireAuth, selectedOtherUserId, fetchMessages, isLoadingMessages]);

    useEffect(() => {
        let isMounted = true;
        if (!authLoading) {
            if (!requireAuth()) {
                return;
            }
            const shouldOpenModal = location.state?.openAddContactModal;
            const usernameToPrefill = location.state?.prefillUsername;
            if (shouldOpenModal && usernameToPrefill) {
                setPrefillUsername(usernameToPrefill);
                setIsAddContactModalOpen(true);
                navigate(location.pathname, { replace: true, state: {} });
            }
            setIsLoadingConversations(true);
            fetchConversations(true)
                .catch((err) => {
                    if(isMounted) setError("Failed to load chats initially.");
                })
                .finally(() => {
                    if (isMounted) setIsLoadingConversations(false);
                });
        }
        return () => { isMounted = false; };
    }, [authLoading, requireAuth, fetchConversations, location.state, navigate]);

     useEffect(() => {
         let intervalId = null;
         if (!isLoadingConversations && currentUser && !authLoading) {
             if (!pollingIntervalRef.current) {
                 intervalId = setInterval(() => {
                     fetchConversations(false);
                     if (selectedOtherUserId) {
                         fetchMessages(selectedOtherUserId);
                     }
                 }, POLLING_RATE_MS);
                 pollingIntervalRef.current = intervalId;
             }
         } else {
             if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
             }
         }

         return () => {
              if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                  pollingIntervalRef.current = null;
              }
         };
     }, [currentUser, authLoading, isLoadingConversations, selectedOtherUserId, fetchConversations, fetchMessages]);

    const handleAddMessage = useCallback(async (newMessageData) => {
        if (!requireAuth() || !selectedOtherUserId) return;
        const tempId = `temp_${Date.now()}`;
        const now = new Date();
        const optimisticMessage = {
            id: tempId,
            senderId: currentUser.id,
            receiverId: selectedOtherUserId,
            senderName: currentUser.username || "You",
            senderAvatar: currentUser.profile_picture || 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            text: newMessageData.text,
            timestamp: now.toISOString(),
            isRead: false,
            isSending: true
        };
        setMessages(prev => ({
             ...prev,
             [selectedOtherUserId]: [...(prev[selectedOtherUserId] || []), optimisticMessage]
        }));
        setConversations(prev => {
            const optimisticTimestampISO = optimisticMessage.timestamp;
             const convoExists = prev.some(c => c.other_user_id === selectedOtherUserId);
             let updatedConvos;
             if (convoExists) {
                 updatedConvos = prev.map(convo =>
                     convo.other_user_id === selectedOtherUserId
                         ? { ...convo, lastMessage: optimisticMessage.text, lastMessageTimestamp: optimisticTimestampISO, isPlaceholder: false }
                         : convo
                 );
             } else {
                  const tempNewConvo = {
                       other_user_id: selectedOtherUserId,
                       userName: 'Unknown User',
                       userAvatar: 'https://i.pravatar.cc/150?img=10',
                       lastMessage: optimisticMessage.text,
                       lastMessageTimestamp: optimisticTimestampISO,
                       unread: false,
                       isPlaceholder: false
                   };
                  updatedConvos = [...prev, tempNewConvo];
             }
             return updatedConvos.sort((a, b) => {
                  const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
                  const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
                  return (timeB || 0) - (timeA || 0);
              });
        });

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/send_message.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver_id: selectedOtherUserId, content: newMessageData.text }),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || `Failed to send message (HTTP ${response.status})`);
            const realMessage = result.newMessage;

            setMessages(prev => {
                 const currentChatMessages = prev[selectedOtherUserId] || [];
                 const finalMessages = currentChatMessages.map(msg =>
                     msg.id === tempId ? { ...realMessage, isSending: false } : msg
                 );
                 if (!finalMessages.some(msg => msg.id === realMessage.id)) {
                     const filtered = currentChatMessages.filter(msg => msg.id !== tempId);
                     filtered.push({ ...realMessage, isSending: false });
                     return { ...prev, [selectedOtherUserId]: filtered };
                 }
                 return { ...prev, [selectedOtherUserId]: finalMessages };
            });
             setConversations(prev => {
                  return prev.map(convo =>
                      convo.other_user_id === selectedOtherUserId
                          ? { ...convo,
                              lastMessage: realMessage.text,
                              lastMessageTimestamp: realMessage.timestamp || new Date().toISOString(),
                              isPlaceholder: false
                            }
                          : convo
                  ).sort((a, b) => {
                         const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
                         const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
                         return (timeB || 0) - (timeA || 0);
                     });
             });
        } catch (err) {
            setError(`Failed to send message: ${err.message}. Please try again.`);
             setMessages(prev => {
                 const currentMsgs = prev[selectedOtherUserId] || [];
                 return { ...prev, [selectedOtherUserId]: currentMsgs.map(msg => msg.id === tempId ? { ...msg, isSending: false, error: 'Failed to send' } : msg ) };
             });
        }
    }, [currentUser, requireAuth, selectedOtherUserId]);

    const openAddContactModal = useCallback(() => {
        if (!requireAuth()) return;
        setPrefillUsername('');
        setAddContactError('');
        setIsAddContactModalOpen(true);
    }, [requireAuth]);

    const closeAddContactModal = useCallback(() => {
        setIsAddContactModalOpen(false);
        setPrefillUsername('');
        setAddContactError('');
    }, []);

    const handleFindAndAddContact = useCallback(async (usernameToAdd) => {
        if (!requireAuth()) return false;
        setAddContactError('');
        let success = false;
        if (!usernameToAdd || !usernameToAdd.trim()) {
             setAddContactError("Username cannot be empty.");
             return false;
         }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/find_user.php?username=${encodeURIComponent(usernameToAdd.trim())}`, { credentials: 'include' });
            const result = await response.json();
            if (!response.ok || !result.success) {
                 setAddContactError(result.message || result.error || `Could not find user "${usernameToAdd}".`);
            } else {
                 const foundUser = result.user;
                 if (foundUser.id === currentUser.id) {
                    setAddContactError("You cannot start a conversation with yourself.");
                    return false;
                 }
                 let alreadyExists = false;
                 setConversations(prev => {
                     alreadyExists = prev.some(c => c.other_user_id === foundUser.id);
                     if (alreadyExists) {
                          return prev;
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
                         return [...prev, newPlaceholderConvo].sort((a, b) => {
                               const timeA = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
                               const timeB = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
                               return (timeB || 0) - (timeA || 0);
                           });
                     }
                 });

                 if (alreadyExists) {
                      handleSelectConversation(foundUser.id);
                      success = true;
                 } else {
                      setMessages(prev => ({ ...prev, [foundUser.id]: [] }));
                      handleSelectConversation(foundUser.id);
                      success = true;
                 }

                 if (success) {
                    closeAddContactModal();
                 }
            }
        } catch (err) {
            setAddContactError('An error occurred while searching. Please try again.');
            success = false;
        }
        return success;
    }, [requireAuth, handleSelectConversation, closeAddContactModal, currentUser]);

    const openDeleteModal = useCallback((otherUserId, userName) => {
        if (!requireAuth()) return;
        setUserToDelete({ id: otherUserId, name: userName });
        setIsDeleteConfirmModalOpen(true);
    }, [requireAuth]);

    const closeDeleteModal = useCallback(() => {
        if (isDeleting) return;
        setIsDeleteConfirmModalOpen(false);
        setUserToDelete(null);
        setError('');
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
            setMessages(prev => { const next = {...prev}; delete next[userToDelete.id]; return next; });
            if (selectedOtherUserId === userToDelete.id) setSelectedOtherUserId(null);
            closeDeleteModal();
        } catch (err) {
            setError(`Failed to delete conversation: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    }, [userToDelete, requireAuth, selectedOtherUserId, closeDeleteModal]);

    const selectedConversation = conversations.find(c => c.other_user_id === selectedOtherUserId);
    const currentMessages = selectedOtherUserId ? (messages[selectedOtherUserId] || []) : [];

    if (authLoading) {
        return ( <div> <Header /> <NavBar /> <div className="loading-page">Checking authentication...</div> </div> );
    }
    if (!currentUser && !authLoading) {
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
                    {error && !isDeleteConfirmModalOpen && <div className="error-banner">{error}</div>}

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
                                <p>Click the '+' button in the Chats list to find someone to message, or contact a seller from a listing.</p>
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
                    initialUsername={prefillUsername}
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