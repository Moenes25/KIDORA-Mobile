// components/TopBar.js
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext"; // Connects to the logic above

import LanguageSelector from "./LanguageSelector";

export default function TopBar({
  onMenuPress,
  onNotificationPress,
  showMenu = true,
  showAvatar = true,
  showNotification = true,
  showLanguage = true,
}) {
  const { colors } = useTheme();
  
  // Connect to the Logic
  const { unreadCount, setUnreadCount } = useNotifications();

  const handleNotificationClick = () => {
    // 1. Clear the badge locally (optional UX choice)
    setUnreadCount(0);
    
    // 2. Run the parent navigation logic
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

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
            onPress={handleNotificationClick} // Updated handler
          >
            <Feather name="bell" size={24} color="#FFFFFF" />

            {/* Smart Badge System */}
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                 {/* Only showing ONE cohesive badge for cleaner UI, 
                     but keeping your styling logic */}
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Language Selector */}
        {showLanguage && (
          <View style={styles.languageSelectorContainer}>
            <LanguageSelector />
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
    paddingTop: Platform.OS === "android" ? 40 : 12, // Adjusted for status bar
    paddingBottom: 12,
  },
  burgerButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
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
  badgeContainer: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  countBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10, // Perfectly round if 1 digit, pill shape if 2+
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  languageSelectorContainer: {
    marginLeft: 16,
  },
});