import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/LoginSc";
import Register from "../screens/Register";


import MainApp from "../MainApp";
import { AuthProvider } from "../context/AuthProvider";
import { AuthContext } from "../context/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import DailyRecordScreen from "../screens/DailyRecordScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/Profile";


const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
             <Stack.Screen name="MainApp" component={MainApp} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="home" component={HomeScreen} />


                <Stack.Screen name="chat" component={ChatScreen} />
                <Stack.Screen name="daily" component={DailyRecordScreen} />
                <Stack.Screen name="calendar" component={CalendarScreen} />
                 <Stack.Screen name="profile" component={ProfileScreen} />

             
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp" component={MainApp} />
             <Stack.Screen name="HomeScreen" component={HomeScreen} />
             <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
            
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
