import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const chatData = {
  '1': { name: 'John Doe', avatar: '👨', color: '#FF6B6B' },
  '2': { name: 'Jane Smith', avatar: '👩', color: '#4ECDC4' },
  '3': { name: 'Team Dev', avatar: '👥', color: '#45B7D1' },
  '4': { name: 'Mom', avatar: '👴', color: '#FFA502' },
  '5': { name: 'Alex Johnson', avatar: '👨‍💼', color: '#6C5CE7' },
};

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! How are you doing?', sender: 'other', timestamp: '10:30 AM' },
    { id: '2', text: "I'm doing great! How about you?", sender: 'me', timestamp: '10:31 AM' },
    { id: '3', text: 'Just finished the project! 🎉', sender: 'other', timestamp: '10:32 AM' },
    { id: '4', text: 'That\'s awesome! Congratulations!', sender: 'me', timestamp: '10:33 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chat = chatData[id as keyof typeof chatData];

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate reply after 1 second
    setTimeout(() => {
      const replies = [
        'That sounds great!',
        'I totally agree!',
        'Let me think about that...',
        'Sounds good to me! 👍',
        'Awesome! Let\'s do it!',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMessage: Message = {
        id: Date.now().toString(),
        text: randomReply,
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  const renderMessageBubble = ({ item }: { item: Message }) => (
    <Animated.View
      entering={FadeInUp.springify()}
      className={`mx-4 my-1 flex-row ${item.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      <View
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          item.sender === 'me'
            ? 'bg-blue-500 rounded-br-none'
            : 'bg-gray-300 rounded-bl-none'
        }`}
      >
        <Text
          className={`text-base ${
            item.sender === 'me' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.sender === 'me' ? 'text-blue-100' : 'text-gray-600'
          }`}
        >
          {item.timestamp}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
      className="flex-1 bg-white"
    >
      <View style={{ paddingTop: insets.top }} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-3">
              <Text className="text-lg">{chat?.avatar}</Text>
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-900">{chat?.name}</Text>
              <Text className="text-xs text-green-500">Active now</Text>
            </View>
          </View>
          <TouchableOpacity className="p-2">
            <Text className="text-xl">⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessageBubble}
          contentContainerStyle={{ paddingVertical: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

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
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-blue-500 rounded-full p-3 active:bg-blue-600"
          >
            <Text className="text-white text-lg">↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
