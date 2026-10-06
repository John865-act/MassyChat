# MassyChat Frontend

Real-time messaging mobile app built with React Native and Expo.

## Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend server running on `http://localhost:3000`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/John865-act/MassyChat.git
cd MassyChat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure backend URL:
```bash
cp .env.example .env.local
# Edit .env.local if using a different backend URL
```

## Running the App

### Development Mode
```bash
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web browser

### For Physical Device
1. Install Expo Go app from app store
2. Scan the QR code from terminal

## Project Structure

```
MassyChat/
├── app/
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Messages list
│   │   ├── contacts.tsx     # Contacts
│   │   └── settings.tsx     # Settings
│   ├── auth/
│   │   ├── signin.tsx       # Sign in screen
│   │   └── signup.tsx       # Sign up screen
│   ├── chat/
│   │   └── [id].tsx         # Chat detail screen
│   └── _layout.tsx          # Root layout with auth flow
├── context/
│   ├── AuthContext.tsx      # Authentication state
│   └── ChatContext.tsx      # Real-time chat state
├── components/              # Reusable components
└── tailwind.config.js       # Tailwind CSS config
```

## Features

- ✅ User authentication (signup/signin)
- ✅ Real-time messaging with Socket.IO
- ✅ Message persistence
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Conversation list
- ✅ Contact list
- ✅ Settings screen
- ✅ Responsive UI

## Backend Integration

This app connects to the MassyChat backend at `http://localhost:3000`.

Update `context/AuthContext.tsx` and `context/ChatContext.tsx` if using a different backend URL.

## License

MIT
