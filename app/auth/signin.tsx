import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      Alert.alert('Error', error);
    }
  };

  return (
    <LinearGradient
      colors={['#007AFF', '#5AC8FA']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingTop: insets.top }} className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-5xl font-bold text-white text-center mb-2">MassyChat</Text>
              <Text className="text-lg text-blue-100 text-center">Real-time Messaging</Text>
            </View>

            {/* Form Container */}
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Error Message */}
              {error ? (
                <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">Email</Text>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showPassword}
                    className="flex-1 text-gray-900"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text className="text-gray-600 text-lg">{showPassword ? '👁' : '🙈'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                className={`py-3 rounded-lg items-center mb-4 ${
                  loading ? 'bg-gray-300' : 'bg-blue-500 active:bg-blue-600'
                }`}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="px-3 text-gray-500 text-sm">OR</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Demo Credentials */}
              <View className="bg-blue-50 rounded-lg p-3">
                <Text className="text-xs text-gray-600 mb-2">Demo Credentials:</Text>
                <Text className="text-xs text-gray-700">Email: demo@massychat.com</Text>
                <Text className="text-xs text-gray-700">Password: demo123</Text>
              </View>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-blue-100 text-sm">
                Don't have an account?{' '}
                <Text className="font-bold text-white">Sign Up</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
