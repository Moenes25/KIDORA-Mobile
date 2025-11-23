import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import LanguageSelector from "../components/LanguageSelector";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Menu Icon */}
        <TouchableOpacity onPress={toggleSidebar}>
          <Feather name="menu" size={28} color="#6F42C1" />
        </TouchableOpacity>

        {/* Language Selector */}
        <LanguageSelector />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Home Page</Text>
        {/* Your other content goes here */}
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});
