import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/Login"; 
import RegisterScreen from "./screens/Register"; 
import ProfileEdit from "./screens/ProfileEdit";

import { AuthProvider } from "./context/AuthProvider";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
           <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
