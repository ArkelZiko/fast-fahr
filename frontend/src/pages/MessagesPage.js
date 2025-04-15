// ARKEL CLEAN UP THIS CODE AND ADD WEBSOCKETS!!!!!
// REMOVE ALL CONSOLE.WARNS ALSO AND CONSOLE.LOGS

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
    const navigate = useNavigate(); // Hook for navigation

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
    const POLLING_RATE_MS = 7000; // Poll every 7 seconds

    // --- Fetch Conversations ---
    const fetchConversations = useCallback(async (isInitialLoad = false) => {
        if (!currentUser) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/get_conversations.php`, { credentials: 'include' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, Response: ${errorText}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setConversations(data);
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                 console.warn("Received unexpected data format for conversations:", data);
                 setConversations([]);
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
            if (isInitialLoad) {
                setError(`Failed to load conversations: ${err.message}. Please refresh.`);
                setConversations([]);
            } else {
                 console.error("Polling error fetching conversations:", err);
            }
        }
        // NOTE: setIsLoadingConversations is handled by the initial load useEffect
    }, [currentUser]);

    // --- Fetch Messages for Selected Conversation ---
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
                 console.warn(`Received unexpected data format for messages with user ${otherUserId}:`, data);
                 setMessages(prev => ({ ...prev, [otherUserId]: [] }));
            }
        } catch (err) {
             console.error(`Failed to fetch messages for user ${otherUserId}:`, err);
             setMessages(prev => ({ ...prev, [otherUserId]: [] }));
        } finally {
            setIsLoadingMessages(false);
        }
    }, [currentUser]);

    // --- Authentication Check and Initial Load ---
    useEffect(() => {
        let isMounted = true; // Prevent state updates after unmount
        if (!authLoading) { // Wait for auth check
            if (!requireAuth()) {
                return; // Redirecting
            }
            setIsLoadingConversations(true);
            fetchConversations(true)
                 .catch((err) => {
                      console.error("Initial conversation fetch failed:", err);
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
    // Dependencies: Run when auth loading finishes, or if requireAuth reference changes (stable)
    // fetchConversations is stable and doesn't need to be here as it only depends on currentUser
    }, [authLoading, requireAuth, fetchConversations]);


    // --- Polling Logic ---
    useEffect(() => {
        let intervalId = null;

        // Conditions to NOT start polling:
        if (!currentUser || authLoading || isLoadingConversations) {
            // If polling is running, clear it
            if (pollingIntervalRef.current) {
                 clearInterval(pollingIntervalRef.current);
                 pollingIntervalRef.current = null;
             }
            return; // Exit effect
        }

        // Conditions met: Start polling if not already running
        if (!pollingIntervalRef.current) {
            intervalId = setInterval(() => {
                fetchConversations(false);
                if (selectedOtherUserId) {
                    fetchMessages(selectedOtherUserId);
                }
            }, POLLING_RATE_MS);
            pollingIntervalRef.current = intervalId; // Store interval ID in ref
        }

        // Cleanup function for this effect
        return () => {
             // Use the intervalId captured in this effect's scope for cleanup
             if (intervalId) {
                clearInterval(intervalId);
             }
             // Check ref as a fallback (though clearing intervalId should be sufficient)
             if (pollingIntervalRef.current === intervalId) {
                 pollingIntervalRef.current = null;
             }
        };
    // Dependencies: Run when user logs in/out, auth finishes, initial load finishes,
    }, [currentUser, authLoading, isLoadingConversations, selectedOtherUserId, fetchConversations, fetchMessages]);

    // --- Event Handlers ---

    // Added useCallback and dependency arrays for stability and correctness
    const handleSelectConversation = useCallback((otherUserId) => {
        if (!requireAuth()) return;
        if (otherUserId === selectedOtherUserId) return;

        setSelectedOtherUserId(otherUserId);
        fetchMessages(otherUserId); // Fetch messages, handles its own loading state

        // Mark as Read API call
        fetch(`${process.env.REACT_APP_API_BASE}/messages/mark_read.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender_id: otherUserId }),
            credentials: 'include'
        }).catch(err => console.error("Failed mark read API call:", err));

        // Optimistic UI update
        setConversations(prev =>
            prev.map(convo =>
                convo.other_user_id === otherUserId ? { ...convo, unread: false } : convo
            )
        );
    }, [requireAuth, selectedOtherUserId, fetchMessages]); // Dependencies

    const handleAddMessage = useCallback(async (newMessageData) => {
        if (!requireAuth() || !selectedOtherUserId) return;

        const tempId = `temp_${Date.now()}`;
        const optimisticMessage = { /* ... same optimistic data ... */
            id: tempId, senderId: currentUser.id, receiverId: selectedOtherUserId,
            senderName: currentUser.username || "You",
            senderAvatar: currentUser.profile_picture || 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            text: newMessageData.text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false, isSending: true
        };

        // Update UI optimistically
        setMessages(prev => ({ ...prev, [selectedOtherUserId]: [...(prev[selectedOtherUserId] || []), optimisticMessage] }));
        setConversations(prev => prev.map(convo =>
            convo.other_user_id === selectedOtherUserId ? { ...convo, lastMessage: optimisticMessage.text, lastMessageTimestamp: optimisticMessage.timestamp } : convo
        ));

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/send_message.php`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver_id: selectedOtherUserId, content: newMessageData.text }),
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || `HTTP error ${response.status}`);

            // Replace optimistic with real message
            const realMessage = result.newMessage;
            setMessages(prev => {
                 const current = prev[selectedOtherUserId] || [];
                 const updated = current.map(msg => msg.id === tempId ? { ...realMessage, isSending: false } : msg);
                 // Ensure message isn't duplicated if polling added it already
                 if (!updated.some(m => m.id === realMessage.id) && current.some(m => m.id === tempId)) {
                     // Only push if the temp msg was actually replaced (or not found) AND real msg not already present
                     // This condition might be overly complex, usually map is enough
                 } else if (!updated.some(m => m.id === tempId) && !updated.some(m => m.id === realMessage.id)){
                     updated.push({ ...realMessage, isSending: false }); // Add if temp was missed and real isn't there
                 }
                 return { ...prev, [selectedOtherUserId]: updated };
            });
        } catch (err) {
            console.error("Failed to send message:", err);
            setError(`Failed to send message: ${err.message}.`);
            // Revert Optimistic Update
            setMessages(prev => ({ ...prev, [selectedOtherUserId]: (prev[selectedOtherUserId] || []).filter(msg => msg.id !== tempId) }));
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
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ other_user_id: userToDelete.id }), credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.error || `HTTP error ${response.status}`);

            // Update state after successful deletion
            setConversations(prev => prev.filter(c => c.other_user_id !== userToDelete.id));
            setMessages(prev => { const next = {...prev}; delete next[userToDelete.id]; return next; });
            if (selectedOtherUserId === userToDelete.id) setSelectedOtherUserId(null);
            closeDeleteModal();
        } catch (err) {
            console.error("Failed to delete conversation:", err);
            setError(`Failed to delete conversation: ${err.message}`);
        } finally {
            setIsDeleting(false);
        }
    }, [userToDelete, requireAuth, selectedOtherUserId, closeDeleteModal]); // Dependencies

    const openAddContactModal = useCallback(() => {
        if (!requireAuth()) return;
        setAddContactError(''); // Clear previous errors when opening
        setIsAddContactModalOpen(true);
    }, [requireAuth]);

    const closeAddContactModal = useCallback(() => setIsAddContactModalOpen(false), []); // Dependency

    const handleFindAndAddContact = useCallback(async (usernameToAdd) => {
        if (!requireAuth()) return false;
        setAddContactError('');
        let success = false;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE}/messages/find_user.php?username=${encodeURIComponent(usernameToAdd)}`, { credentials: 'include' });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setAddContactError(result.message || result.error || 'Could not find user.');
            } else {
                const foundUser = result.user;
                const existingConvo = conversations.find(c => c.other_user_id === foundUser.id);
                if (existingConvo) {
                    handleSelectConversation(foundUser.id);
                } else {
                    const newPlaceholderConvo = {
                        other_user_id: foundUser.id, userName: foundUser.username,
                        userAvatar: foundUser.avatar || 'https://i.pravatar.cc/150?img=10',
                        lastMessage: 'Start chatting!', lastMessageTimestamp: new Date().toISOString(), // Use ISO string for easier sorting
                        unread: false,
                    };

                    setConversations(prev => [...prev, newPlaceholderConvo]
                         .sort((a, b) => (new Date(b.lastMessageTimestamp)) - (new Date(a.lastMessageTimestamp))) // Keep sorted by date
                     );
                    setMessages(prev => ({ ...prev, [foundUser.id]: [] }));
                    handleSelectConversation(foundUser.id);
                }
                closeAddContactModal();
                success = true;
            }
        } catch (err) {
            console.error("Failed to find/add user:", err);
            setAddContactError('An error occurred. Please check the console.');
        }
        return success;
    }, [requireAuth, conversations, handleSelectConversation, closeAddContactModal]); // Dependencies

    const selectedConversation = conversations.find(c => c.other_user_id === selectedOtherUserId);
    const currentMessages = selectedOtherUserId ? (messages[selectedOtherUserId] || []) : [];

    if (authLoading) {
        return ( <div> <Header /> <NavBar /> <div className="loading-page">Checking authentication...</div> </div> );
    }
    if (!currentUser) { // Should be redirected by requireAuth
        return null;
    }

    return (
        <div>
            <Header />
            <NavBar />
            <div className="messages-page">
                <div className="conversation-list-area">
                    {/* Show loading indicator OR the list */}
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
                    {/* General Error Banner */}
                    {error && <div className="error-banner">{error}</div>}

                    {/* Chat Interface or Placeholder */}
                    {selectedConversation ? (
                        <ChatInterface
                            key={selectedOtherUserId} // Re-mount when conversation changes
                            conversation={selectedConversation}
                            messages={currentMessages}
                            isLoading={isLoadingMessages} // Pass message loading state
                            onSendMessage={handleAddMessage}
                            onDeleteChat={() => openDeleteModal(selectedConversation.other_user_id, selectedConversation.userName)}
                            currentUser={currentUser}
                        />
                    ) : (
                        // Show appropriate placeholder based on state
                        !isLoadingConversations && conversations.length === 0 ? (
                            <div className="no-chat-selected">
                                <h2>No conversations yet</h2>
                                <p>Click the '+' button in the Chats list to start one.</p>
                            </div>
                        ) : !isLoadingConversations ? ( // Don't show if initial load is happening
                            <div className="no-chat-selected">
                                <h2>Select a conversation</h2>
                                <p>Choose a chat from the list on the left.</p>
                            </div>
                        ) : null // Render nothing while initial conversations are loading
                    )}
                </div>
            </div>

            {/* Modals */}
            {isAddContactModalOpen && (
                <AddContactModal
                    onClose={closeAddContactModal}
                    onAddContact={handleFindAndAddContact}
                />
            )}
            {isDeleteConfirmModalOpen && userToDelete && (
                <DeleteConfirmModal
                    onClose={closeDeleteModal}
                    onConfirmDelete={handleConfirmDeleteChat}
                    userName={userToDelete.name}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
}

export default MessagesPage;