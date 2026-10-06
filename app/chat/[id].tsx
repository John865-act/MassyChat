import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export default function ChatDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentMessages, currentConversation, sendMessage, loadConversationMessages, connected, error } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      loadMessagesData();
    }
  }, [id]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [currentMessages]);

  const loadMessagesData = async () => {
    try {
      setIsLoading(true);
      await loadConversationMessages(id as string);
    } catch (err) {
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !id || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(id as string, inputText);
      setInputText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessageBubble = ({ item }: { item: any }) => {
    const isFromCurrentUser = item.senderId === user?.id;

    return (
      <Animated.View
        entering={FadeInUp.springify()}
        className={`mx-4 my-1 flex-row ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <View
          className={`max-w-xs px-4 py-2 rounded-2xl ${
            isFromCurrentUser
              ? 'bg-blue-500 rounded-br-none'
              : 'bg-gray-300 rounded-bl-none'
          }`}
        >
          {!isFromCurrentUser && (
            <Text className="text-xs text-gray-700 font-semibold mb-1">{item.senderName}</Text>
          )}
          <Text
            className={`text-base ${
              isFromCurrentUser ? 'text-white' : 'text-gray-900'
            }`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isFromCurrentUser ? 'text-blue-100' : 'text-gray-600'
            }`}
          >
            {new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isFromCurrentUser && (
            <Text className="text-xs mt-1 text-blue-200">
              {item.status === 'read' ? '✓✓' : item.status === 'delivered' ? '✓' : '◯'}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  const participantNames = currentConversation?.participantNames
    .filter(name => name !== user?.displayName)
    .join(', ') || 'Chat';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
      className="flex-1 bg-white"
    >
      <View style={{ paddingTop: insets.top }} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-lg font-semibold text-gray-900">{participantNames}</Text>
              <View className="flex-row items-center mt-1">
                <View
                  className={`w-2 h-2 rounded-full ${
                    connected ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                <Text className="text-xs text-gray-600 ml-1">
                  {connected ? 'Connected' : 'Connecting...'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="p-2">
            <Text className="text-xl">⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 border-b border-red-300 px-4 py-2">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        )}

        {/* Messages List */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessageBubble}
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent=(
              <View className="flex-1 justify-center items-center py-12">
                <Text className="text-gray-500">No messages yet</Text>
                <Text className="text-gray-400 text-sm mt-2">Start the conversation!</Text>
              </View>
            }
          />
        )}

        {/* Input Area */}
        <View
          style={{ paddingBottom: insets.bottom }}
          className="px-4 py-3 border-t border-gray-200 bg-white flex-row items-center"
        >
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-900 mr-2"
            multiline
            maxHeight={100}
            editable={connected && !isSending}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || !connected || isSending}
            className={`${
              connected && inputText.trim() && !isSending
                ? 'bg-blue-500'
                : 'bg-gray-300'
            } rounded-full p-3`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-lg">↗</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
