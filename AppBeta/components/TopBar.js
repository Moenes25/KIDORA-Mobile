import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
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
  return (
    <View style={styles.header}>
      {/* Menu Button */}
      {showMenu && (
        <TouchableOpacity style={styles.burgerButton} onPress={onMenuPress}>
          <Feather name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Avatar */}
      {showAvatar && (
        <View style={styles.headerLeft}>
          <Image
            source={avatarSource}
            style={styles.userAvatar}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Right Side Icons */}
      <View style={styles.headerRight}>
        {/* Notification Bell */}
        {showNotification && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <Feather name="bell" size={24} color="#FFFFFF" />

            {/* Exact match to your desired image */}
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <View style={styles.yellowDot} />
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

  // Perfectly matches your first image
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  yellowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD700",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },

  languageSelectorContainer: {
    marginLeft: 16,
  },
});