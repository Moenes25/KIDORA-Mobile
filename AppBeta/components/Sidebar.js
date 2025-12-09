// components/Sidebar.js - Full screen with colored sections
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function SideBar({ visible, onClose, username, email, navigation, onLogout }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [pressedShortcut, setPressedShortcut] = React.useState(null);
  const [pressedRecommend, setPressedRecommend] = React.useState(null);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.fullScreen}>
        {/* Purple Gradient Top Section */}
        <LinearGradient colors={colors.headerGradient} style={styles.topSection}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require("../assets/default_avatar.jpg")} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.username}>{username || "User Name"}</Text>
            <Text style={styles.email}>{email || "user@example.com"}</Text>
          </View>
        </LinearGradient>

        {/* White Bottom Section */}
        <View style={styles.whiteSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 80 }}
          >
            {/* Shortcuts Section - PURPLE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SHORTCUTS</Text>
              <View style={styles.shortcutGrid}>
                {[
                  { icon: "home-outline", label: "Home", screen: "HomeScreen" },
                  { icon: "people-outline", label: "Children", screen: "ChildrenList" },
                  { icon: "calendar-outline", label: "Calendar", screen: "Calendar" },
                  { icon: "location-outline", label: "Map", screen: "MapScreen" },
                  { icon: "image-outline", label: "Galerie", screen: "GalleryScreen" },
                ].map((item, index) => {
                  const isPressed = pressedShortcut === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.shortcutItem}
                      activeOpacity={1}
                      onPressIn={() => setPressedShortcut(index)}
                      onPressOut={() => setPressedShortcut(null)}
                      onPress={() => {
                        onClose();
                        navigation.navigate(item.screen);
                      }}
                    >
                      <View style={[
                        styles.purpleIconCircle,
                        isPressed && styles.purpleIconCirclePressed
                      ]}>
                        <Ionicons 
                          name={item.icon} 
                          size={28} 
                          color="#ffffff"
                        />
                      </View>
                      <Text style={styles.shortcutLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Kids Zone - GREEN */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>KIDS ZONE</Text>
              <TouchableOpacity
                style={styles.kidsZoneCard}
                onPress={() => {
                  onClose();
                  navigation.navigate("ChildrenAreaScreen");
                }}
              >
                <LinearGradient colors={["#4CAF50", "#27AE60"]} style={styles.kidsZoneGradient}>
                  <View style={styles.kidsZoneContent}>
                    <View style={styles.kidsZoneLeft}>
                      <Text style={styles.kidsZoneEmoji}>🎈</Text>
                      <View>
                        <Text style={styles.kidsZoneTitle}>عالم الأطفال</Text>
                        <Text style={styles.kidsZoneSubtitle}>التعلم والمرح معاً</Text>
                      </View>
                    </View>
                    <View style={styles.kidsZoneArrow}>
                      <Feather name="arrow-right" size={24} color="#fff" />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Recommend Section - YELLOW */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RECOMMEND</Text>
              {[
                { icon: "color-palette-outline", label: "Appearance", screen: "AppearanceScreen" },
                { icon: "notifications-outline", label: "Notifications" },
                { icon: "help-circle-outline", label: "Help & Support", screen: "HelpSupport" },
                { icon: "settings-outline", label: "Settings" },
              ].map((item, index) => {
                const isPressed = pressedRecommend === index;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.recommendItem}
                    activeOpacity={1}
                    onPressIn={() => setPressedRecommend(index)}
                    onPressOut={() => setPressedRecommend(null)}
                    onPress={() => {
                      onClose();
                      if (item.screen) navigation.navigate(item.screen);
                    }}
                  >
                    <View style={[
                      styles.yellowIconCircle,
                      isPressed && styles.yellowIconCirclePressed
                    ]}>
                      <Ionicons 
                        name={item.icon} 
                        size={24} 
                        color="#ffffff"
                      />
                    </View>
                    <Text style={styles.recommendLabel}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999999" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 0,
  },
  
  // Purple Top Section
  topSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#FFC75F",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#FFC75F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },

  // White Bottom Section
  whiteSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
    paddingBottom: 0,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999999",
    letterSpacing: 1,
    marginBottom: 16,
  },

  // Purple Shortcuts - DEFAULT: PURPLE CONTAINER WITH WHITE ICONS
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shortcutItem: {
    width: (screenWidth - 56) / 4,
    alignItems: "center",
    marginBottom: 20,
  },
  purpleIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#6F42C1", // FILLED PURPLE
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  purpleIconCirclePressed: {
    backgroundColor: "#4CAF50", // GREEN WHEN PRESSED
  },
  shortcutLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a2e",
    textAlign: "center",
  },

  // Green Kids Zone
  kidsZoneCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  kidsZoneGradient: {
    padding: 20,
  },
  kidsZoneContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kidsZoneLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  kidsZoneEmoji: {
    fontSize: 40,
  },
  kidsZoneTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },
  kidsZoneSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  kidsZoneArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Yellow Recommend - DEFAULT: FILLED YELLOW WITH WHITE ICONS
  recommendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    marginBottom: 10,
  },
  yellowIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFC75F", // FILLED YELLOW
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  yellowIconCirclePressed: {
    backgroundColor: "#FFB84D", // SLIGHTLY DARKER YELLOW WHEN PRESSED
  },
  recommendLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53935",
    marginLeft: 10,
  },
});