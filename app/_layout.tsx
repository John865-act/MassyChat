import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <View className="flex-1 bg-blue-500" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ animationEnabled: false }} />
          <Stack.Screen name="chat/[id]" />
        </>
      ) : (
        <>
          <Stack.Screen name="auth/signin" options={{ animationEnabled: false }} />
          <Stack.Screen name="auth/signup" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ChatProvider>
          <RootLayoutNav />
        </ChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
