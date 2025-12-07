// ChatNavs.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '../screens/ChatList';
import ChatScreen from '../screens/ChatScreen';
import VideoCallScreen from '../screens/VideoCallScreen';

const Stack = createNativeStackNavigator();

export default function ChatNavs() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatList} options={{ title: 'Messages' }} />
      <Stack.Screen name="Conversation" component={ChatScreen} options={({ route }) => ({ title: route.params?.user?.name || 'Chat' })} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ presentation: 'modal', headerShown: false }} />
    </Stack.Navigator>
  );
}
