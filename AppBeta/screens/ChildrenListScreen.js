// screens/ChildrenListScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.36;
const childrenGif = require("../assets/children.gif");

export default function ChildrenListScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const user = route?.params?.user || {};
  const username = user?.name || "User";
  const email = user?.email || "";
  

  // Mock data – replace with real API later
  const children = [
    {
      id: 1,
      name: "Alice Johnson",
      age: 6,
      grade: "1st Grade",
      presence: true,
      completedTasks: 8,
      totalTasks: 10,
      performance: 85,
      avatar: require("../assets/child1.jpg"),
    },
    {
      id: 2,
      name: "Bob Smith",
      age: 7,
      grade: "2nd Grade",
      presence: false,
      completedTasks: 5,
      totalTasks: 10,
      performance: 50,
      avatar: require("../assets/child2.jpg"),
    },
    {
      id: 3,
      name: "Charlie Brown",
      age: 5,
      grade: "Kindergarten",
      presence: true,
      completedTasks: 2,
      totalTasks: 10,
      performance: 20,
      avatar: require("../assets/child3.jpg"),
    },
  ];

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const getPerformanceGradient = (performance) => {
    if (performance >= 75) return ["#6FCF97", "#27AE60"];
    if (performance >= 45) return ["#F2C94C", "#F2994A"];
    return ["#EB5757", "#E53935"];
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          isDark
            ? colors.bgGradient?.[0] || colors.topSectionBg
            : colors.headerGradient?.[0] || "#6F42C1"
        }
      />

      {/* FIXED TOP SECTION WITH GRADIENT */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient
          colors={
            isDark
              ? colors.bgGradient || [colors.topSectionBg, colors.topSectionBg]
              : colors.headerGradient || ["#6F42C1", "#9b59b6"]
          }
          style={StyleSheet.absoluteFill}
        >
          {/* Dark mode overlay */}
          {isDark && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
            />
          )}

          <View style={styles.safeArea} />

          {/* TopBar with perfect yellow notification dot */}
          <TopBar
            onMenuPress={toggleSidebar}
            onNotificationPress={() => navigation.navigate("Notifications")}
            notificationCount={5} // Change this dynamically in real app
            showLanguage={true}
          />

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Children</Text>
            <Image source={childrenGif} style={styles.gif} resizeMode="contain" />
          </View>
        </LinearGradient>
      </View>

      {/* WHITE CONTENT AREA */}
      <View style={[styles.whiteSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.childCardWrapper}
              onPress={() => navigation.navigate("ChildDetailScreen", { child })}
              activeOpacity={0.85}
            >
              {isDark ? (
                <View style={styles.darkChildCard}>
                  <Image source={child.avatar} style={styles.childAvatar} />
                  <View style={styles.childInfo}>
                    <Text style={styles.darkChildName}>{child.name}</Text>
                    <Text style={styles.darkChildDetails}>
                      Age: {child.age} • {child.grade} • {child.presence ? "Present" : "Absent"}
                    </Text>

                    <View style={styles.statsRow}>
                      <View style={styles.stat}>
                        <Feather name="clipboard" size={18} color="#B794F4" />
                        <Text style={styles.darkStatText}>
                          {child.completedTasks}/{child.totalTasks} Tasks
                        </Text>
                      </View>
                      <View style={styles.stat}>
                        <Feather name="bar-chart-2" size={18} color="#B794F4" />
                        <Text style={styles.darkStatText}>{child.performance}%</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={28} color="#B794F4" />
                </View>
              ) : (
                <LinearGradient
                  colors={getPerformanceGradient(child.performance)}
                  style={styles.lightChildCard}
                >
                  <Image source={child.avatar} style={styles.childAvatar} />
                  <View style={styles.childInfo}>
                    <Text style={styles.lightChildName}>{child.name}</Text>
                    <Text style={styles.lightChildDetails}>
                      Age: {child.age} • {child.grade} • {child.presence ? "Present" : "Absent"}
                    </Text>
                    <View style={styles.statsRow}>
                      <View style={styles.stat}>
                        <Feather name="clipboard" size={18} color="white" />
                        <Text style={styles.lightStatText}>
                          {child.completedTasks}/{child.totalTasks} Tasks
                        </Text>
                      </View>
                      <View style={styles.stat}>
                        <Feather name="bar-chart-2" size={18} color="white" />
                        <Text style={styles.lightStatText}>{child.performance}%</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={28} color="white" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Sidebar & Bottom Navigation */}
      <SideBar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        username={username}
        email={email}
        navigation={navigation}
        onLogout={handleLogout}
      />

      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },

  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44,
  },

  headerContent: {
    alignItems: "center",
    paddingTop: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },

  gif: { width: 90, height: 90 },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  childCardWrapper: {
    marginBottom: 18,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },

  darkChildCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000000",
    borderRadius: 24,
  },

  darkChildName: { fontSize: 19, fontWeight: "700", color: "#ffffff" },
  darkChildDetails: { fontSize: 14, color: "#cccccc", marginTop: 4 },
  darkStatText: { color: "#ffffff", fontSize: 14.5, fontWeight: "600", marginLeft: 8 },

  lightChildCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
  },

  lightChildName: { fontSize: 19, fontWeight: "700", color: "#fff" },
  lightChildDetails: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 4 },
  lightStatText: { color: "#fff", fontSize: 14.5, fontWeight: "600", marginLeft: 8 },

  childAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },

  childInfo: { flex: 1, marginLeft: 16 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  stat: { flexDirection: "row", alignItems: "center" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});