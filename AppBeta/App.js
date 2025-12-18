import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './context/ThemeContext';
import { TranslationProvider } from './context/TranslationContext';
// Import all screens
import SplashScreen from './screens/SplashScreen';
import Login from './screens/LoginSc';
import Registerv1 from './screens/Registerv1';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePwdScreen from './screens/ChangePwdScreen';
import ChildrenListScreen from './screens/ChildrenListScreen';
import ChildDetailScreen from './screens/ChildDetailsScreen';
import MapScreen from './screens/MapScreen';
import CalendarScreen from './screens/CalendarScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import LanguageScreen from './screens/LanguageScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import ChildrenAreaScreen from './screens/ChildrenAreaScreen';
import GalleryScreen from './screens/GalleryScreen';
import PaidInvoiceScreen from "./screens/PaidInvoiceScreen";
import InvoiceToPayScreen from "./screens/InvoiceToPayScreen";
import ChatListScreen from './screens/ChatListScreen';
import ImprovementsScreen from './screens/ImprovementsScreen';
import ConversationScreen from './screens/ConversationScreen';
import CallComponent from './components/CallComponent';
import VideoCall from './screens/VideoCallScreen';
import FeedbackScreen from './components/FeedBackScreenComponent';
import { NotificationProvider } from './context/NotificationContext';

import { Text, TextInput } from 'react-native';

// Add these lines RIGHT AFTER your imports, BEFORE your App component
//Text.defaultProps = Text.defaultProps || {};
//Text.defaultProps.allowFontScaling = false;

//TextInput.defaultProps = TextInput.defaultProps || {};
//TextInput.defaultProps.allowFontScaling = false;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <TranslationProvider> 
         <NotificationProvider> 
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right'
              }}
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Registerv1" component={Registerv1} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="Calendar" component={CalendarScreen} />
              <Stack.Screen name="MapScreen" component={MapScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
              <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
              <Stack.Screen name="ChildrenListScreen" component={ChildrenListScreen} />
              <Stack.Screen name="ChildDetailScreen" component={ChildDetailScreen} />
              <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
              <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
              <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
              <Stack.Screen name="ChildrenAreaScreen" component={ChildrenAreaScreen} />
              <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
              <Stack.Screen name="PaidInvoiceScreen" component={PaidInvoiceScreen} />
              <Stack.Screen name="InvoiceToPayScreen" component={InvoiceToPayScreen} />
              <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
              <Stack.Screen name="ImprovementsScreen" component={ImprovementsScreen} />
              <Stack.Screen name="Conversation" component={ConversationScreen} />
              <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
              <Stack.Screen name="VideoCall" component={VideoCall} options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="Call" component={CallComponent} options={{ presentation: 'modal', headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
        </NotificationProvider>
      </TranslationProvider>
    </SafeAreaProvider>
  );
}