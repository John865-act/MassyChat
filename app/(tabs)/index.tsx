import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations, loadConversations, markAsRead } = useChat();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.participantNames.join(' ').toLowerCase().includes(searchText.toLowerCase())
  );

  const handleConversationPress = async (conversationId: string) => {
    await markAsRead(conversationId);
    router.push(`/chat/${conversationId}`);
  };

  const renderConversation = ({ item }: { item: typeof conversations[0] }) => (
    <TouchableOpacity
      onPress={() => handleConversationPress(item.id)}
      className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white"
    >
      <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center mr-3">
        <Text className="text-white font-bold text-lg">
          {item.participantNames[0]?.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {item.participantNames.filter(name => name !== user?.displayName).join(', ')}
        </Text>
        <Text className="text-sm text-gray-600 mt-1 truncate">
          {item.lastMessage?.text || 'No messages yet'}
        </Text>
      </View>
      <Text className="text-xs text-gray-500">
        {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#007AFF', '#5AC8FA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1">
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Messages</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            className="bg-gray-100 rounded-full px-4 py-2 text-gray-900"
          />
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={item => item.id}
          renderItem={renderConversation}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          ListEmptyComponent=(
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 text-base">No conversations yet</Text>
              <Text className="text-gray-400 text-sm mt-2">Start chatting with friends!</Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}
