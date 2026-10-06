import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const mockContacts = [
  { id: '1', name: 'John Doe', status: 'Active', avatar: '👨' },
  { id: '2', name: 'Jane Smith', status: 'Active', avatar: '👩' },
  { id: '3', name: 'Mike Johnson', status: 'Offline', avatar: '👨‍💼' },
  { id: '4', name: 'Sarah Williams', status: 'Active', avatar: '👩‍🔬' },
  { id: '5', name: 'Tom Brown', status: 'Offline', avatar: '👨‍🎓' },
];

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContact = ({ item }: { item: typeof mockContacts[0] }) => (
    <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-gray-200 bg-white">
      <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-3">
        <Text className="text-2xl">{item.avatar}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
        <Text className={`text-xs mt-1 ${item.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity className="bg-blue-500 rounded-full px-4 py-2">
        <Text className="text-white text-sm font-semibold">Message</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#007AFF', '#5AC8FA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1">
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Contacts</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            className="bg-gray-100 rounded-full px-4 py-2 text-gray-900"
          />
        </View>

        {/* Contacts List */}
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.id}
          renderItem={renderContact}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        />
      </View>
    </LinearGradient>
  );
}
