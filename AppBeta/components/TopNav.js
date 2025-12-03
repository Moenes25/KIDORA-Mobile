import React, { useRef } from "react";
import { View, TouchableOpacity, Image, Animated, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LanguageSelector from "./LanguageSelector";
import { useNavigation } from "@react-navigation/native";

export default function TopNav({ user }) {
  const notifScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const animateNotif = (toValue) => {
    Animated.spring(notifScale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const userAvatar = user?.avatar || require("../assets/default_avatar.jpg");

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.topBar}>
      <View style={styles.leftSection}>
        {/* MENU BUTTON → NOW OPENS MenuScreen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MenuScreen")}
          style={styles.menuIconContainer}
        >
          <Feather name="menu" size={28} color="#6F42C1" />
        </TouchableOpacity>

        <Image source={userAvatar} style={styles.userAvatar} />
      </View>

      <View style={styles.rightSection}>
        <Animated.View style={{ transform: [{ scale: notifScale }] }}>
          <TouchableOpacity
            onPressIn={() => animateNotif(1.1)}
            onPressOut={() => animateNotif(1)}
            activeOpacity={0.8}
            style={styles.iconCircle}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color="#6F42C1" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={handleLogout} style={styles.iconCircle}>
          <Feather name="log-out" size={24} color="#6F42C1" />
        </TouchableOpacity>

        <LanguageSelector />
      </View>
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
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconCircle: {
    backgroundColor: "#f3e8ff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
});
