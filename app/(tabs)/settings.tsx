import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/signin');
  };

  return (
    <LinearGradient colors={['#007AFF', '#5AC8FA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1">
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
          {/* Profile Section */}
          <View className="bg-white mt-4 mx-4 rounded-lg p-4">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center mr-3">
                <Text className="text-white font-bold text-lg">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">{user?.displayName}</Text>
                <Text className="text-sm text-gray-600 mt-1">{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View className="bg-white mt-4 mx-4 rounded-lg overflow-hidden">
            <View className="px-4 py-3 border-b border-gray-200">
              <Text className="text-base font-semibold text-gray-900">Preferences</Text>
            </View>

            {/* Notifications */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <Text className="text-gray-700">Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={notifications ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            {/* Dark Mode */}
            <View className="flex-row items-center justify-between px-4 py-3">
              <Text className="text-gray-700">Dark Mode</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="bg-white mt-4 mx-4 rounded-lg p-4">
            <Text className="text-gray-700 font-semibold mb-2">About</Text>
            <Text className="text-sm text-gray-600">MassyChat v1.0.0</Text>
            <Text className="text-sm text-gray-600 mt-1">© 2024 MassyChat Inc.</Text>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 mx-4 mt-6 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold text-base">Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
