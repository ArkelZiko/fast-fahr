// --- Sample Data (Replace with actual data fetching later) ---
export const sampleConversations = [
  {
    id: "convo1",
    userName: "Alice Wonderland",
    userAvatar: "https://i.pravatar.cc/150?img=1", // Placeholder avatar
    lastMessage: "Okay, sounds good! See you then.",
    lastMessageTimestamp: "10:30 AM",
    unread: true,
  },
  {
    id: "convo2",
    userName: "Bob The Builder",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Can we build it? Yes, we can!",
    lastMessageTimestamp: "Yesterday",
    unread: false,
  },
  {
    id: "convo3",
    userName: "Charlie Chaplin",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "...", // Example of potentially empty or image message later
    lastMessageTimestamp: "Mon",
    unread: false,
  },
  {
    id: "convo4",
    userName: "Diana Prince",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "I'll be there in a flash.",
    lastMessageTimestamp: "Sun",
    unread: true,
  },
];

export const sampleMessages = {
  convo1: [
    { id: "msg1", senderId: "user1", senderName: "Alice Wonderland", senderAvatar: "https://i.pravatar.cc/150?img=1", text: "Hey! Are you still interested in the car?", timestamp: "10:25 AM" },
    { id: "msg2", senderId: "currentUser", senderName: "You", senderAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", text: "Hi Alice, yes I am!", timestamp: "10:26 AM" },
    { id: "msg3", senderId: "user1", senderName: "Alice Wonderland", senderAvatar: "https://i.pravatar.cc/150?img=1", text: "Great! Can you meet tomorrow at 2 PM?", timestamp: "10:28 AM" },
    { id: "msg4", senderId: "currentUser", senderName: "You", senderAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", text: "Sure, that works for me.", timestamp: "10:29 AM" },
    { id: "msg5", senderId: "user1", senderName: "Alice Wonderland", senderAvatar: "https://i.pravatar.cc/150?img=1", text: "Okay, sounds good! See you then.", timestamp: "10:30 AM" },
    // Add more messages here to test scrolling...
    { id: "msg6", senderId: "user1", senderName: "Alice Wonderland", senderAvatar: "https://i.pravatar.cc/150?img=1", text: "Earlier message...", timestamp: "10:00 AM" },
    { id: "msg7", senderId: "currentUser", senderName: "You", senderAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", text: "Even earlier...", timestamp: "9:55 AM" },

  ],
  convo2: [
    { id: "msg6", senderId: "user2", senderName: "Bob The Builder", senderAvatar: "https://i.pravatar.cc/150?img=3", text: "Can we build it? Yes, we can!", timestamp: "Yesterday" },
  ],
  convo3: [
    { id: "msg7", senderId: "user3", senderName: "Charlie Chaplin", senderAvatar: "https://i.pravatar.cc/150?img=5", text: "...", timestamp: "Mon" },
  ],
  convo4: [
    { id: "msg8", senderId: "currentUser", senderName: "You", senderAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", text: "Are you coming to the event?", timestamp: "Sun" },
    { id: "msg9", senderId: "user4", senderName: "Diana Prince", senderAvatar: "https://i.pravatar.cc/150?img=8", text: "I'll be there in a flash.", timestamp: "Sun" },
  ],
};