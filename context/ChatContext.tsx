import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_IO_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3000';

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
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection when user logs in
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(SOCKET_IO_URL, {
      auth: {
        token,
        userId: user.id,
        displayName: user.displayName,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✓ Socket connected');
      setConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Connection failed');
    });

    // Listen for new messages
    newSocket.on('message:new', (message: Message) => {
      if (currentConversation && message.conversationId === currentConversation.id) {
        setCurrentMessages(prev => [...prev, message]);
      }
      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === message.conversationId 
            ? { ...conv, lastMessage: message, updatedAt: message.timestamp }
            : conv
        ).sort((a, b) => b.updatedAt - a.updatedAt)
      );
    });

    // Listen for typing indicators
    newSocket.on('user:typing', (data: { conversationId: string; userId: string; displayName: string; isTyping: boolean }) => {
      if (data.isTyping) {
        console.log(`${data.displayName} is typing...`);
      }
    });

    // Listen for read receipts
    newSocket.on('message:read', (data: { conversationId: string; userId: string; messageIds: string[] }) => {
      setCurrentMessages(prev =>
        prev.map(msg => 
          data.messageIds.includes(msg.id) ? { ...msg, status: 'read' as const } : msg
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, token, currentConversation?.id]);

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      if (!socket || !user) {
        setError('Not connected');
        return;
      }

      try {
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

        // Emit to backend
        socket.emit('message:send', message);
        setError(null);
      } catch (err) {
        setError('Failed to send message');
        console.error('Send message error:', err);
      }
    },
    [socket, user]
  );

  const loadConversations = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to load conversations');

      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Load conversations error:', err);
    }
  }, [token]);

  const loadConversationMessages = useCallback(
    async (conversationId: string) => {
      if (!token) return;

      try {
        // Fetch messages from API
        const response = await fetch(
          `${BACKEND_URL}/api/messages/conversation/${conversationId}?limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error('Failed to load messages');

        const messages = await response.json();
        setCurrentMessages(messages);

        // Fetch conversation details
        const convResponse = await fetch(
          `${BACKEND_URL}/api/conversations/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (convResponse.ok) {
          const conversation = await convResponse.json();
          setCurrentConversation(conversation);
          
          // Join socket room
          if (socket) {
            socket.emit('conversation:join', { conversationId });
          }
        }

        setError(null);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Load messages error:', err);
      }
    },
    [token, socket]
  );

  const createConversation = useCallback(
    async (participantIds: string[], participantNames: string[]) => {
      if (!token) throw new Error('Not authenticated');

      try {
        const response = await fetch(`${BACKEND_URL}/api/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ participantIds, participantNames }),
        });

        if (!response.ok) throw new Error('Failed to create conversation');

        const data = await response.json();
        setError(null);
        return data.id;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create conversation';
        setError(message);
        throw err;
      }
    },
    [token]
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!token) return;

      try {
        await fetch(
          `${BACKEND_URL}/api/messages/conversation/${conversationId}/read`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Emit socket event for read receipts
        if (socket) {
          const messageIds = currentMessages
            .filter(m => m.senderId !== user?.id && m.status !== 'read')
            .map(m => m.id);
          
          if (messageIds.length > 0) {
            socket.emit('message:markAsRead', { conversationId, messageIds });
          }
        }
      } catch (err) {
        console.error('Mark as read error:', err);
      }
    },
    [token, socket, currentMessages, user?.id]
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
    error,
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
