import React from "react";
import { View, StyleSheet, TouchableOpacity, Image,Platform,StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
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
  return (
    <View style={styles.header}>
      {/* Menu Button */}
      {showMenu && (
        <TouchableOpacity style={styles.burgerButton} onPress={onMenuPress}>
          <Feather name="menu" size={24} color="#6F42C1" />
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
        {/* Notification Button */}
        {showNotification && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
          >
            <Feather name="bell" size={24} color="#6F42C1" />
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
    paddingVertical: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  burgerButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  headerLeft: {
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#6F42C1",
    backgroundColor: "#f0f0f0",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  languageSelectorContainer: {
    marginLeft: 16,
  },
});