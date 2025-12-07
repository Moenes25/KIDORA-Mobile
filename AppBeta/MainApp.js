import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";

import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import DailyRecordScreen from "./screens/DailyRecordScreen";
import CalendarScreen from "./screens/CalendarScreen";
import ProfileScreen from "./screens/Profile";
import SidebarApp from "./components/SideBarApp";
import BottomNavApp from "./components/BottomNavApp";
import ChatNavs from "./navigation/ChatNavs";
export default function MainApp() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("home");
  //const [currentScreen, setCurrentScreen] = useState("home"); // default HomeScreen


  const renderScreen = () => {
    switch (currentScreen) {
      case "chat": return <ChatScreen />;
        case "ChatScreen": return <ChatScreen />;
        case "ChatNavs": return <ChatScreen />;
      case "HomeScreen": return <HomeScreen />;
       case "MainApp": return <MainApp />;
      case "home": return <HomeScreen />;
      case "daily": return <DailyRecordScreen />;
      case "calendar": return <CalendarScreen />;
      case "profile": return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SidebarApp
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setSidebarVisible(false);
        }}
      />

      {renderScreen()}

      <BottomNavApp navigation={(s) => setCurrentScreen(s)} />

      <View
        style={styles.sidebarTriggerArea}
        onStartShouldSetResponder={() => {
          setSidebarVisible(true);
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sidebarTriggerArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 18,
    height: "100%",
  },
});
