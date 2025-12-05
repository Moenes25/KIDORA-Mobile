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

const screenWidth = Dimensions.get("window").width;

export default function SideBar({ 
  visible, 
  onClose, 
  username, 
  email, 
  navigation, 
  onLogout,
  onNotifications 
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={["#6F42C1", "#9b59b6"]}
        style={styles.fullScreenSidebar}
      >
        {/* Header with Back Button */}
        <View style={styles.sidebarTopBar}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={require("../assets/omarPicture.jpg")}
              style={styles.profileAvatar}
              resizeMode="contain"
            />
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileEmail}>{email || "user@example.com"}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Regular</Text>
              </View>
              <View style={[styles.badge, styles.badgeVerified]}>
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Shortcut Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shortcut</Text>
            <View style={styles.shortcutGrid}>
              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                Alert.alert("Profile", "Profile screen coming soon!");
              }}>
                <View style={styles.shortcutIcon}>
                  <Feather name="user" size={24} color="#6F42C1" />
                </View>
                <Text style={styles.shortcutText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                navigation.navigate("Calendar");
              }}>
                <View style={styles.shortcutIcon}>
                  <Feather name="calendar" size={24} color="#6F42C1" />
                </View>
                <Text style={styles.shortcutText}>Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                navigation.navigate("MapScreen");
              }}>
                <View style={styles.shortcutIcon}>
                  <Feather name="map" size={24} color="#6F42C1" />
                </View>
                <Text style={styles.shortcutText}>Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                onClose();
                Alert.alert("Settings", "Settings screen coming soon!");
              }}>
                <View style={styles.shortcutIcon}>
                  <Feather name="settings" size={24} color="#6F42C1" />
                </View>
                <Text style={styles.shortcutText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recommend Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommend</Text>
            
            <TouchableOpacity style={styles.menuListItem} onPress={() => {
              onClose();
              Alert.alert("Language", "Language selection coming soon!");
            }}>
              <View style={styles.menuListIcon}>
                <Feather name="globe" size={22} color="#6F42C1" />
              </View>
              <View style={styles.menuListContent}>
                <Text style={styles.menuListTitle}>Language</Text>
                <Text style={styles.menuListSubtitle}>Change app language</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuListItem} onPress={() => {
              onClose();
              onNotifications();
            }}>
              <View style={styles.menuListIcon}>
                <Feather name="bell" size={22} color="#6F42C1" />
              </View>
              <View style={styles.menuListContent}>
                <Text style={styles.menuListTitle}>Notifications</Text>
                <Text style={styles.menuListSubtitle}>Manage notifications</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuListItem} onPress={() => {
              onClose();
              Alert.alert("Help & Support", "Support center coming soon!");
            }}>
              <View style={styles.menuListIcon}>
                <Feather name="help-circle" size={22} color="#6F42C1" />
              </View>
              <View style={styles.menuListContent}>
                <Text style={styles.menuListTitle}>Help & Support</Text>
                <Text style={styles.menuListSubtitle}>Get help and support</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuListItem} onPress={() => {
              onClose();
              Alert.alert("Settings", "Settings screen coming soon!");
            }}>
              <View style={styles.menuListIcon}>
                <Feather name="settings" size={22} color="#6F42C1" />
              </View>
              <View style={styles.menuListContent}>
                <Text style={styles.menuListTitle}>Settings</Text>
                <Text style={styles.menuListSubtitle}>App preferences</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              onClose();
              setTimeout(() => onLogout(), 300);
            }}
          >
            <Feather name="log-out" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
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
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  sidebarContent: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
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
    color: "white",
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
    color: "white",
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  shortcutText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  menuListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    marginBottom: 12,
  },
  menuListIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "white",
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
    color: "white",
    marginBottom: 2,
  },
  menuListSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: "rgba(235, 87, 87, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(235, 87, 87, 0.5)",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
