import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/LoginSc";
import Register from "../screens/Register";
import MainApp from "../MainApp";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import DailyRecordScreen from "../screens/DailyRecordScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/Profile";
import ChatNavs from "./ChatNavs";
import ChatList from "../screens/ChatList";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}
        initialRouteName={user ? "MainApp" : "Login"}
      >

        {/* AUTH SCREENS */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />

        {/* MAIN APP */}
        <Stack.Screen name="MainApp" component={MainApp} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="home" component={HomeScreen} />

        {/* CHAT SCREENS */}
       
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
         <Stack.Screen name="Chats" component={ChatList} options={{ title: 'Messages' }} />
        <Stack.Screen name="Conversation" component={ChatScreen} options={({ route }) => ({ title: route.params?.user?.name || 'Chat' })} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ presentation: 'modal', headerShown: false }} />


        {/* OTHER SCREENS */}
        <Stack.Screen name="daily" component={DailyRecordScreen} />
        <Stack.Screen name="calendar" component={CalendarScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
