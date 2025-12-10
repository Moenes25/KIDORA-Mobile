import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";

import LanguageSelector from "./LanguageSelector";

export default function TopBar({
  onMenuPress,
  onNotificationPress,
  onLanguageChange,
  lang = "en",
  showMenu = true,
  showAvatar = true,
  showNotification = true,
  showLanguage = true,
  avatarSource = require("../assets/famGif.gif"),
  notificationCount = 0,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      {/* Menu Button */}
      {showMenu && (
        <TouchableOpacity style={styles.burgerButton} onPress={onMenuPress}>
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}



      {/* Right Side Icons */}
      <View style={styles.headerRight}>
        {/* Notification Bell */}
        {showNotification && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => alert("L'interface Notification est en train d'être développée")}
          >
            <Feather name="bell" size={24} color="#FFFFFF" />

            {/* Notification Badge */}
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <LinearGradient
                  // FILL: High Intensity Yellow -> Deep Gold
                  colors={['rgba(255, 234, 0, 1)', '#FFC400']}
                  style={styles.yellowDot}
                  start={{ x: 0.1, y: 0.1 }} 
                  end={{ x: 0.9, y: 0.9 }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Language Selector */}
        {showLanguage && (
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector
              onLanguageChange={onLanguageChange}
              initialLanguage={lang}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 8 : 0,
    paddingBottom: 12,
  },
  burgerButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerLeft: {
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  yellowDot: {
    width: 13,
    height: 13,
    borderRadius: 8,
    // CHANGED: Border width 1.5 and Orange Color creates the "container" effect
    borderWidth: 1.5,
    borderColor: '#db703aff', // Deep Orange Border
  },
  languageSelectorContainer: {
    marginLeft: 16,
  },
});