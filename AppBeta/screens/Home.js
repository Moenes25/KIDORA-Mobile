import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import Tabs from '../navigation/app/Tabs';
import ProfileScreen from './Profile';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome {user?.name}</Text>

      <ProfileScreen />
      <Button title="Logout" onPress={logout} />
    
    </View>
  );
}
