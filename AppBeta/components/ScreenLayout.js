import React from "react";
import { View, StyleSheet } from "react-native";
import BottomNav from "../components/BottomNav";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LanguageSelector from "../components/LanguageSelector";
import { Animated, Image, TouchableOpacity } from "react-native";

export default function ScreenLayout({ children, navigation, user, activeScreen }) {
  const notifScale = new Animated.Value(1);
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
    <View style={{ flex: 1, backgroundColor: "#fbf7ff" }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => navigation.openDrawer?.()} style={styles.menuIconContainer}>
            <Feather name="menu" size={28} color="#6F42C1" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image source={userAvatar} style={styles.userAvatar} />
            <Animated.Text style={styles.userName}>Welcome {userName}</Animated.Text>
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

      {/* Main Content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} activeScreen={activeScreen} />
    </View>
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
