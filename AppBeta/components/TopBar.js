import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import LanguageSelector from "./LanguageSelector";

export default function TopBar({
  onMenuPress,
  onNotificationPress,
  onLanguageChange,
  lang = 'en',
  showMenu = true,
  showAvatar = true,
  showNotification = true,
  showLanguage = true,
  avatarSource = require("../assets/famGif.gif"),
}) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View 
      style={[
        styles.header, 
        { 
          backgroundColor: colors.card,
          shadowColor: isDark ? "#000" : "#000",
          shadowOpacity: isDark ? 0.3 : 0.1,
          paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 16,
        }
      ]}
    >
      {/* Menu Button */}
      {showMenu && (
        <TouchableOpacity 
          style={[
            styles.burgerButton, 
            { backgroundColor: isDark ? colors.sidebarItemBg : "#f0f0f0" }
          ]} 
          onPress={onMenuPress}
        >
          <Feather name="menu" size={24} color={isDark ? "#fff" : colors.primary} />
        </TouchableOpacity>
      )}

      {/* Avatar */}
      {showAvatar && (
        <View style={styles.headerLeft}>
          <Image
            source={avatarSource}
            style={[
              styles.userAvatar,
              { 
                borderColor: isDark ? "#fff" : colors.primary,
                backgroundColor: isDark ? colors.sidebarItemBg : "#f0f0f0",
              }
            ]}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Right Side Icons */}
      <View style={styles.headerRight}>
        {/* Notification Button */}
        {showNotification && (
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: isDark ? colors.sidebarItemBg : "#f0f0f0" }
            ]}
            onPress={onNotificationPress}
          >
            <Feather name="bell" size={24} color={isDark ? "#fff" : colors.primary} />
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
    paddingBottom: 16,
    elevation: 2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  burgerButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  headerLeft: {
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
    borderRadius: 20,
  },
  languageSelectorContainer: {
    marginLeft: 16,
  },
});