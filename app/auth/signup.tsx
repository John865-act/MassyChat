import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      await signUp(email, password, displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
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
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-2xl text-white">←</Text>
              </TouchableOpacity>
              <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
              <Text className="text-lg text-blue-100">Join MassyChat today</Text>
            </View>

            {/* Form Container */}
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Error Message */}
              {error ? (
                <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              ) : null}

              {/* Display Name Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">Full Name</Text>
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#ccc"
                  value={displayName}
                  onChangeText={(text) => {
                    setDisplayName(text);
                    setError('');
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                  editable={!loading}
                />
              </View>

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
              <View className="mb-4">
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Confirm Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3">
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#ccc"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 text-gray-900"
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Text className="text-gray-600 text-lg">{showConfirmPassword ? '👁' : '🙈'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={loading}
                className={`py-3 rounded-lg items-center mb-4 ${
                  loading ? 'bg-gray-300' : 'bg-blue-500 active:bg-blue-600'
                }`}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-blue-100 text-sm">
                Already have an account?{' '}
                <Text className="font-bold text-white" onPress={() => router.back()}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
