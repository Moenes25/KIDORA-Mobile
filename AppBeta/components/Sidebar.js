// components/Sidebar.js - Updated with TranslationContext
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
import { useTranslation } from "../context/TranslationContext";

const screenWidth = Dimensions.get("window").width;

export default function SideBar({ visible, onClose, username, email, navigation, onLogout }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t, isRTL } = useTranslation();

  const [pressedShortcut, setPressedShortcut] = React.useState(null);
  const [pressedRecommend, setPressedRecommend] = React.useState(null);

  const SHORTCUTS = [
    { icon: "home-outline", label: t("home"), screen: "HomeScreen" },
    { icon: "calendar-outline", label: t("calendar"), screen: "Calendar" },
    { icon: "location-outline", label: t("map"), screen: "MapScreen" },
    { icon: "image-outline", label: t("gallery"), screen: "GalleryScreen" },
  ];

  const RECOMMEND = [
    { icon: "help-circle-outline", label: t("helpSupport"), screen: "FeedbackScreen" },
    { icon: "settings-outline", label: t("settings"), screen: "ProfileScreen" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.fullScreen}>
        {/* Top Gradient Section */}
        <LinearGradient colors={colors.headerGradient} style={styles.topSection}>
          
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>

          {/* Profile */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require("../assets/human.jpg")} 
                style={styles.avatar} 
              />
            </View>

            <Text style={styles.username} numberOfLines={1}>
              {username || t("usernameDefault")}
            </Text>
          </View>
        </LinearGradient>

        {/* Bottom White Section */}
        <View style={styles.whiteSection}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) + 80 }}
          >

            {/* SHORTCUTS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("shortcuts")}</Text>

              <View style={styles.shortcutGrid}>
                {SHORTCUTS.map((item, index) => {
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
                      <View 
                        style={[
                          styles.purpleIconCircle,
                          isPressed && styles.purpleIconCirclePressed
                        ]}
                      >
                        <Ionicons name={item.icon} size={28} color="#ffffff" />
                      </View>

                      <Text 
                        style={[
                          styles.shortcutLabel,
                          isRTL && { textAlign: "right" }
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* KIDS ZONE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("kidsZone")}</Text>

              <TouchableOpacity
                style={styles.kidsZoneCard}
                onPress={() => {
                  onClose();
                  navigation.navigate("ChildrenAreaScreen");
                }}
              >
                <LinearGradient colors={["#4CAF50", "#27AE60"]} style={styles.kidsZoneGradient}>
                  <View 
                    style={[
                      styles.kidsZoneContent,
                      isRTL && { flexDirection: "row-reverse" }
                    ]}
                  >
                    <View style={[styles.kidsZoneLeft, isRTL && { flexDirection: "row-reverse" }]}>
                      <Text style={styles.kidsZoneEmoji}>🎈</Text>
                      <View>
                        <Text 
                          style={[
                            styles.kidsZoneTitle,
                            isRTL && { textAlign: "right" }
                          ]}
                        >
                          عالم الأطفال
                        </Text>
                        <Text 
                          style={[
                            styles.kidsZoneSubtitle,
                            isRTL && { textAlign: "right" }
                          ]}
                        >
                          التعلم والمرح معاً
                        </Text>
                      </View>
                    </View>

                    <View style={styles.kidsZoneArrow}>
                      <Feather 
                        name={isRTL ? "arrow-left" : "arrow-right"} 
                        size={24} 
                        color="#fff" 
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* RECOMMEND */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("recommend")}</Text>

              {RECOMMEND.map((item, index) => {
                const isPressed = pressedRecommend === index;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.recommendItem,
                      isRTL && { flexDirection: "row-reverse" }
                    ]}
                    activeOpacity={1}
                    onPressIn={() => setPressedRecommend(index)}
                    onPressOut={() => setPressedRecommend(null)}
                    onPress={() => {
                      onClose();

                      if (item.screen === "HelpSupport") {
                        alert(t("helpNotReady"));
                      } else {
                        navigation.navigate(item.screen);
                      }
                    }}
                  >
                    <View 
                      style={[
                        styles.yellowIconCircle,
                        isPressed && styles.yellowIconCirclePressed
                      ]}
                    >
                      <Ionicons name={item.icon} size={24} color="#ffffff" />
                    </View>

                    <Text style={[styles.recommendLabel, isRTL && { textAlign: "right" }]}>
                      {item.label}
                    </Text>

                    {!isRTL && <Ionicons name="chevron-forward" size={20} color="#999" />}
                    {isRTL && <Ionicons name="chevron-back" size={20} color="#999" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color="white" />
              <Text style={styles.logoutText}>{t("logout")}</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* --- STYLES REMAIN EXACTLY THE SAME --- */
const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: "#ffffff" },
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: { alignItems: "center", marginTop: 20 },
  avatarContainer: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFC75F",
    marginBottom: 4,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
  },

  /* Sections */
  section: { marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginBottom: 12,
  },

  /* Shortcuts */
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shortcutItem: {
    width: "48%",
    backgroundColor: "#F0ECFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  purpleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7E57C2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  purpleIconCirclePressed: { backgroundColor: "#6C4BB3" },
  shortcutLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  /* Kids Zone */
  kidsZoneCard: { borderRadius: 20, overflow: "hidden" },
  kidsZoneGradient: { padding: 16 },
  kidsZoneContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kidsZoneLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  kidsZoneEmoji: { fontSize: 30 },
  kidsZoneTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  kidsZoneSubtitle: { fontSize: 13, color: "#fff", opacity: 0.9 },
  kidsZoneArrow: {},

  /* Recommend */
  recommendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  yellowIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FBC02D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 12, // Add this line for RTL spacing
  },
  yellowIconCirclePressed: { backgroundColor: "#F9A825" },
  recommendLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },

  /* Logout */
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
