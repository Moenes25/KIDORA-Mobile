// components/Sidebar.js - Updated with Responsive Design
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp, isSmallDevice } from "../utils/responsive";

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
            <Ionicons name="close" size={normalize(28)} color="#ffffff" />
          </TouchableOpacity>

          {/* Profile */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require("../assets/human.jpg")} 
                style={styles.avatar} 
              />
            </View>

            <Text style={styles.username} numberOfLines={1} allowFontScaling={false}>
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
              <Text style={styles.sectionTitle} allowFontScaling={false}>{t("shortcuts")}</Text>

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
                        <Ionicons name={item.icon} size={normalize(28)} color="#ffffff" />
                      </View>

                      <Text 
                        style={[
                          styles.shortcutLabel,
                          isRTL && { textAlign: "right" }
                        ]}
                        allowFontScaling={false}
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
              <Text style={styles.sectionTitle} allowFontScaling={false}>{t("kidsZone")}</Text>

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
                      <Text style={styles.kidsZoneEmoji} allowFontScaling={false}>🎈</Text>
                      <View>
                        <Text 
                          style={[
                            styles.kidsZoneTitle,
                            isRTL && { textAlign: "right" }
                          ]}
                          allowFontScaling={false}
                        >
                          عالم الأطفال
                        </Text>
                        <Text 
                          style={[
                            styles.kidsZoneSubtitle,
                            isRTL && { textAlign: "right" }
                          ]}
                          allowFontScaling={false}
                        >
                          التعلم والمرح معاً
                        </Text>
                      </View>
                    </View>

                    <View style={styles.kidsZoneArrow}>
                      <Feather 
                        name={isRTL ? "arrow-left" : "arrow-right"} 
                        size={normalize(24)} 
                        color="#fff" 
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* RECOMMEND */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle} allowFontScaling={false}>{t("recommend")}</Text>

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
                      <Ionicons name={item.icon} size={normalize(24)} color="#ffffff" />
                    </View>

                    <Text style={[styles.recommendLabel, isRTL && { textAlign: "right" }]} allowFontScaling={false}>
                      {item.label}
                    </Text>

                    {!isRTL && <Ionicons name="chevron-forward" size={normalize(20)} color="#999" />}
                    {isRTL && <Ionicons name="chevron-back" size={normalize(20)} color="#999" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={normalize(22)} color="white" />
              <Text style={styles.logoutText} allowFontScaling={false}>{t("logout")}</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* --- RESPONSIVE STYLES --- */
const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: "#ffffff" },
  topSection: {
    paddingTop: hp(7),
    paddingBottom: hp(5),
    paddingHorizontal: wp(5),
  },
  closeButton: {
    position: "absolute",
    top: hp(6),
    right: wp(5),
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: { 
    alignItems: "center", 
    marginTop: hp(2.5),
  },
  avatarContainer: {
    width: normalize(isSmallDevice ? 100 : 116),
    height: normalize(isSmallDevice ? 100 : 116),
    borderRadius: normalize(isSmallDevice ? 50 : 58),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(2),
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: { 
    width: normalize(isSmallDevice ? 88 : 100), 
    height: normalize(isSmallDevice ? 88 : 100), 
    borderRadius: normalize(isSmallDevice ? 44 : 50),
  },
  username: {
    fontSize: normalize(isSmallDevice ? 20 : 24),
    fontWeight: "700",
    color: "#FFC75F",
    marginBottom: hp(0.5),
    paddingHorizontal: wp(5),
  },
  whiteSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    marginTop: -hp(2.5),
    paddingTop: hp(3),
  },

  /* Sections */
  section: { 
    marginBottom: hp(2.5), 
    paddingHorizontal: wp(5),
  },
  sectionTitle: {
    fontSize: normalize(isSmallDevice ? 14 : 16),
    fontWeight: "700",
    color: "#444",
    marginBottom: hp(1.5),
  },

  /* Shortcuts */
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shortcutItem: {
    width: wp(42),
    backgroundColor: "#F0ECFF",
    borderRadius: normalize(18),
    paddingVertical: hp(2),
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  purpleIconCircle: {
    width: normalize(isSmallDevice ? 46 : 52),
    height: normalize(isSmallDevice ? 46 : 52),
    borderRadius: normalize(isSmallDevice ? 23 : 26),
    backgroundColor: "#7E57C2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
  },
  purpleIconCirclePressed: { backgroundColor: "#6C4BB3" },
  shortcutLabel: {
    fontSize: normalize(isSmallDevice ? 12 : 14),
    fontWeight: "600",
    color: "#444",
  },

  /* Kids Zone */
  kidsZoneCard: { 
    borderRadius: normalize(20), 
    overflow: "hidden",
  },
  kidsZoneGradient: { 
    padding: wp(4),
  },
  kidsZoneContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kidsZoneLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: wp(2.5),
  },
  kidsZoneEmoji: { 
    fontSize: normalize(isSmallDevice ? 26 : 30),
  },
  kidsZoneTitle: { 
    fontSize: normalize(isSmallDevice ? 14 : 16), 
    fontWeight: "700", 
    color: "#fff",
  },
  kidsZoneSubtitle: { 
    fontSize: normalize(isSmallDevice ? 11 : 13), 
    color: "#fff", 
    opacity: 0.9,
  },
  kidsZoneArrow: {},

  /* Recommend */
  recommendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: wp(3.5),
    borderRadius: normalize(16),
    marginBottom: hp(1.2),
  },
  yellowIconCircle: {
    width: normalize(isSmallDevice ? 40 : 44),
    height: normalize(isSmallDevice ? 40 : 44),
    borderRadius: normalize(isSmallDevice ? 20 : 22),
    backgroundColor: "#FBC02D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    marginLeft: wp(3),
  },
  yellowIconCirclePressed: { backgroundColor: "#F9A825" },
  recommendLabel: {
    flex: 1,
    fontSize: normalize(isSmallDevice ? 13 : 15),
    fontWeight: "600",
    color: "#444",
  },

  /* Logout */
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    padding: hp(1.8),
    borderRadius: normalize(14),
    marginHorizontal: wp(5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.2),
  },
  logoutText: {
    color: "white",
    fontSize: normalize(isSmallDevice ? 14 : 16),
    fontWeight: "700",
    marginLeft: wp(2),
  },
});