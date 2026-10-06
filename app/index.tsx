import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const mockChats = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM', avatar: '👨' },
  { id: '2', name: 'Jane Smith', lastMessage: 'See you tomorrow!', timestamp: '9:15 AM', avatar: '👩' },
  { id: '3', name: 'Team Dev', lastMessage: 'Project deadline extended', timestamp: 'Yesterday', avatar: '👥' },
  { id: '4', name: 'Mom', lastMessage: 'Don\'t forget dinner!', timestamp: '5:45 PM', avatar: '👴' },
  { id: '5', name: 'Alex Johnson', lastMessage: 'Can we talk later?', timestamp: 'Monday', avatar: '👨‍💼' },
];

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/chat/${item.id}`)}
      className="flex-row items-center px-4 py-3 border-b border-gray-200"
    >
      <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-3">
        <Text className="text-2xl">{item.avatar}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">{item.lastMessage}</Text>
      </View>
      <Text className="text-xs text-gray-500">{item.timestamp}</Text>
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

        {/* Chat List */}
        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500 text-base">No conversations found</Text>
            </View>
          }
        />
      </View>
    </LinearGradient>
  );
}
