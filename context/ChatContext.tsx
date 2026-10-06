import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage?: Message;
  updatedAt: number;
}

interface ChatContextType {
  socket: Socket | null;
  connected: boolean;
  conversations: Conversation[];
  currentMessages: Message[];
  currentConversation: Conversation | null;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadConversationMessages: (conversationId: string) => Promise<void>;
  createConversation: (participantIds: string[], participantNames: string[]) => Promise<string>;
  markAsRead: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://your-backend.com', {
      auth: {
        userId: user.id,
        displayName: user.displayName,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // Listen for new messages
    newSocket.on('message:new', (message: Message) => {
      if (currentConversation && message.conversationId === currentConversation.id) {
        setCurrentMessages(prev => [...prev, message]);
      }
      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === message.conversationId ? { ...conv, lastMessage: message } : conv
        )
      );
    });

    // Listen for typing indicators
    newSocket.on('user:typing', (data: { conversationId: string; userId: string; displayName: string }) => {
      console.log(`${data.displayName} is typing...`);
    });

    // Listen for read receipts
    newSocket.on('message:read', (data: { conversationId: string; messageId: string }) => {
      setCurrentMessages(prev =>
        prev.map(msg => (msg.id === data.messageId ? { ...msg, status: 'read' as const } : msg))
      );
    });

    // Listen for conversation updates
    newSocket.on('conversation:updated', (conversation: Conversation) => {
      setConversations(prev =>
        prev.map(conv => (conv.id === conversation.id ? conversation : conv))
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, currentConversation]);

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      if (!socket || !user) return;

      const message: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: user.id,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        text,
        timestamp: Date.now(),
        status: 'sent',
      };

      socket.emit('message:send', message);
      setCurrentMessages(prev => [...prev, message]);
    },
    [socket, user]
  );

  const loadConversations = useCallback(async () => {
    if (!socket || !user) return;

    socket.emit('conversations:load', { userId: user.id }, (data: Conversation[]) => {
      setConversations(data);
    });
  }, [socket, user]);

  const loadConversationMessages = useCallback(
    async (conversationId: string) => {
      if (!socket) return;

      socket.emit('messages:load', { conversationId }, (messages: Message[]) => {
        setCurrentMessages(messages);
      });

      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
      }
    },
    [socket, conversations]
  );

  const createConversation = useCallback(
    async (participantIds: string[], participantNames: string[]) => {
      return new Promise<string>((resolve, reject) => {
        if (!socket || !user) {
          reject(new Error('Socket not connected'));
          return;
        }

        socket.emit(
          'conversation:create',
          { participantIds, participantNames },
          (response: { id: string; error?: string }) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response.id);
            }
          }
        );
      });
    },
    [socket, user]
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!socket || !user) return;

      socket.emit('conversation:markAsRead', { conversationId, userId: user.id });
    },
    [socket, user]
  );

  const value: ChatContextType = {
    socket,
    connected,
    conversations,
    currentMessages,
    currentConversation,
    sendMessage,
    loadConversations,
    loadConversationMessages,
    createConversation,
    markAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
