// components/Sidebar.js — BEAUTIFUL DARK THEME SUPPORT
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

export default function SideBar({
  visible,
  onClose,
  username,
  email,
  navigation,
  onLogout,
  onNotifications,
}) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <LinearGradient colors={colors.sidebarGradient} style={styles.fullScreenSidebar}>
        {/* Header with Back Button */}
        <View style={styles.sidebarTopBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.sidebarText} />
          </TouchableOpacity>
          <Text style={[styles.sidebarTitle, { color: colors.sidebarText }]}>Menu</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={[styles.profileSection, { borderBottomColor: colors.sidebarItemBg }]}>
            <Image
              source={require("../assets/omarPicture.jpg")}
              style={styles.profileAvatar}
              resizeMode="contain"
            />
            <Text style={[styles.profileName, { color: colors.sidebarText }]}>{username}</Text>
            <Text style={[styles.profileEmail, { color: colors.sidebarText, opacity: 0.7 }]}>
              {email || "user@example.com"}
            </Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: colors.sidebarIconBg }]}>
                <Text style={[styles.badgeText,{ color: colors.childrenArea.badgeText }]}>Regular</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.sidebarIconBg }]}>
                <Text style={[styles.badgeText, { color: colors.childrenArea.badgeText }]}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Shortcut Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.sidebarText }]}>Shortcut</Text>
            <View style={styles.shortcutGrid}>
              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                Alert.alert("Profile", "Profile screen coming soon!");
              }}>
                <View style={[styles.shortcutIcon, { backgroundColor: colors.sidebarIconBg }]}>
                  <Feather name="user" size={24} color={isDark ? "#fff" : colors.primary} />
                </View>
                <Text style={[styles.shortcutText, { color: colors.sidebarText }]}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                navigation.navigate("Calendar");
              }}>
                <View style={[styles.shortcutIcon, { backgroundColor: colors.sidebarIconBg }]}>
                  <Feather name="calendar" size={24} color={isDark ? "#fff" : colors.primary} />
                </View>
                <Text style={[styles.shortcutText, { color: colors.sidebarText }]}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                navigation.navigate("MapScreen");
              }}>
                <View style={[styles.shortcutIcon, { backgroundColor: colors.sidebarIconBg }]}>
                  <Feather name="map" size={24} color={isDark ? "#fff" : colors.primary} />
                </View>
                <Text style={[styles.shortcutText, { color: colors.sidebarText }]}>Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                Alert.alert("Settings", "Settings screen coming soon!");
              }}>
                <View style={[styles.shortcutIcon, { backgroundColor: colors.sidebarIconBg }]}>
                  <Feather name="settings" size={24} color={isDark ? "#fff" : colors.primary} />
                </View>
                <Text style={[styles.shortcutText, { color: colors.sidebarText }]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Children Area - Featured Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.sidebarText }]}>Kids Zone</Text>
            
            <TouchableOpacity 
              style={[styles.featuredCard, { backgroundColor: colors.sidebarItemBg }]} 
              onPress={() => {
                onClose();
                navigation.navigate("ChildrenAreaScreen");
              }}
            >
              <LinearGradient 
                colors={colors.sidebarGradient} 
                style={styles.featuredGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.featuredLeft}>
                    <Text style={styles.featuredEmoji}>🎈</Text>
                    <View>
                      <Text style={styles.featuredTitle}>عالم الأطفال</Text>
                      <Text style={styles.featuredSubtitle}>التعلم والمرح معاً</Text>
                    </View>
                  </View>
                  <View style={styles.featuredRight}>
                    <Feather name="arrow-right" size={24} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Recommend Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.sidebarText }]}>Recommend</Text>
            
            <TouchableOpacity 
              style={[styles.menuListItem, { backgroundColor: colors.sidebarItemBg }]} 
              onPress={() => {
                onClose();
                Alert.alert("Language", "Language selection coming soon!");
              }}
            >
              <View style={[styles.menuListIcon, { backgroundColor: colors.sidebarIconBg }]}>
                <Feather name="globe" size={22} color={isDark ? "#fff" : colors.primary} />
              </View>
              <View style={styles.menuListContent}>
                <Text style={[styles.menuListTitle, { color: colors.sidebarText }]}>Language</Text>
                <Text style={[styles.menuListSubtitle, { color: colors.sidebarText, opacity: 0.6 }]}>
                  Change app language
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.sidebarText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuListItem, { backgroundColor: colors.sidebarItemBg }]} 
              onPress={() => {
                onClose();
                onNotifications();
              }}
            >
              <View style={[styles.menuListIcon, { backgroundColor: colors.sidebarIconBg }]}>
                <Feather name="bell" size={22} color={isDark ? "#fff" : colors.primary} />
              </View>
              <View style={styles.menuListContent}>
                <Text style={[styles.menuListTitle, { color: colors.sidebarText }]}>Notifications</Text>
                <Text style={[styles.menuListSubtitle, { color: colors.sidebarText, opacity: 0.6 }]}>
                  Manage notifications
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.sidebarText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuListItem, { backgroundColor: colors.sidebarItemBg }]} 
              onPress={() => {
                onClose();
                Alert.alert("Help & Support", "Support center coming soon!");
              }}
            >
              <View style={[styles.menuListIcon, { backgroundColor: colors.sidebarIconBg }]}>
                <Feather name="help-circle" size={22} color={isDark ? "#fff" : colors.primary} />
              </View>
              <View style={styles.menuListContent}>
                <Text style={[styles.menuListTitle, { color: colors.sidebarText }]}>Help & Support</Text>
                <Text style={[styles.menuListSubtitle, { color: colors.sidebarText, opacity: 0.6 }]}>
                  Get help and support
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.sidebarText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuListItem, { backgroundColor: colors.sidebarItemBg }]} 
              onPress={() => {
                onClose();
                Alert.alert("Settings", "Settings screen coming soon!");
              }}
            >
              <View style={[styles.menuListIcon, { backgroundColor: colors.sidebarIconBg }]}>
                <Feather name="settings" size={22} color={isDark ? "#fff" : colors.primary} />
              </View>
              <View style={styles.menuListContent}>
                <Text style={[styles.menuListTitle, { color: colors.sidebarText }]}>Settings</Text>
                <Text style={[styles.menuListSubtitle, { color: colors.sidebarText, opacity: 0.6 }]}>
                  App preferences
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.sidebarText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[
              styles.logoutButton,
              { 
                backgroundColor: isDark ? "rgba(255, 64, 129, 0.15)" : "rgba(235, 87, 87, 0.3)",
                borderColor: isDark ? "rgba(255, 64, 129, 0.3)" : "rgba(235, 87, 87, 0.5)"
              }
            ]} 
            onPress={() => {
              onClose();
              setTimeout(() => onLogout(), 300);
            }}
          >
            <Feather name="log-out" size={20} color={isDark ? "#FF4081" : "#ff6b6b"} />
            <Text style={[styles.logoutText, { color: isDark ? "#FF4081" : "#ff6b6b" }]}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenSidebar: {
    flex: 1,
    paddingTop: 40,
  },
  sidebarTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sidebarContent: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(242, 201, 76, 0.8)",
  },
  badgeVerified: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  shortcutItem: {
    width: (screenWidth - 72) / 4,
    alignItems: "center",
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  featuredCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  featuredGradient: {
    padding: 20,
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featuredEmoji: {
    fontSize: 40,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  featuredRight: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuListIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuListContent: {
    flex: 1,
  },
  menuListTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  menuListSubtitle: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});