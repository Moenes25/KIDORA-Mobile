import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, Image, Animated, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LanguageSelector from "./LanguageSelector";
import Sidebar from "./Sidebar";

  

export default function TopNav({ user }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const notifScale = useRef(new Animated.Value(1)).current;

  const animateNotif = (toValue) => {
    Animated.spring(notifScale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const userName = user?.name || "Parent";
  const userAvatar = user?.avatar || require("../assets/default_avatar.jpg");

  return (
    <>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIconContainer}>
            <Feather name="menu" size={28} color="#6F42C1" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image source={userAvatar} style={styles.userAvatar} />
            <Text style={styles.userName}>Welcome {userName}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Animated.View style={{ transform: [{ scale: notifScale }] }}>
            <TouchableOpacity
              onPressIn={() => animateNotif(1.1)}
              onPressOut={() => animateNotif(1)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="bell" size={24} color="#6F42C1" />
            </TouchableOpacity>
          </Animated.View>
          <LanguageSelector />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: "#fbf7ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 70,
  },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuIconContainer: { paddingRight: 10 },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 18, fontWeight: "600", color: "#6F42C1" },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 10 },
});
