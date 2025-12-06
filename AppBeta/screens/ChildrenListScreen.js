// screens/ChildrenListScreen.js — Dark theme with opacity cards
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

const childrenGif = require("../assets/children.gif");

export default function ChildrenListScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lang, setLang] = useState("en");

  const user = route?.params?.user || {};
  const username = user?.name || "User";
  const email = user?.email || "";

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

  const handleNotifications = () => {
    Alert.alert("Notifications", "Coming soon!", [{ text: "OK" }]);
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    Alert.alert("Language Changed", `Switched to ${newLang.toUpperCase()}`);
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const getGradient = (performance) => {
    if (performance >= 75) return ["#6FCF97", "#27AE60"];
    if (performance >= 45) return ["#F2C94C", "#F2994A"];
    return ["#EB5757", "#E53935"];
  };

  const shadowColor = isDark ? "#2d1b69" : "#000";

  return (
    <View style={styles.container}>
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
          backgroundColor: "white" 
        }} 
      />
      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
      <SideBar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        username={username}
        email={email}
        navigation={navigation}
        onLogout={handleLogout}
        onNotifications={handleNotifications}
      />

      <TopBar
        onMenuPress={toggleSidebar}
        onNotificationPress={handleNotifications}
        onLanguageChange={handleLanguageChange}
        lang={lang}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header - Dark with opacity in dark theme */}
        {isDark ? (
          <View 
            style={[
              styles.header,
              {
                backgroundColor: colors.cardHeavy,
                shadowColor: shadowColor,
                shadowOpacity: 0.4,
              }
            ]}
          >
            <Text style={styles.headerTitle}>My Children</Text>
            <Image source={childrenGif} style={styles.gif} resizeMode="contain" />
          </View>
        ) : (
          <LinearGradient 
            colors={colors.headerGradient} 
            style={[
              styles.header,
              {
                shadowColor: shadowColor,
                shadowOpacity: 0.2,
              }
            ]}
          >
            <Text style={styles.headerTitle}>My Children</Text>
            <Image source={childrenGif} style={styles.gif} resizeMode="contain" />
          </LinearGradient>
        )}

        {/* Children List */}
        <View style={styles.listContainer}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={[
                styles.childCardWrapper,
                {
                  shadowColor: shadowColor,
                  shadowOpacity: isDark ? 0.5 : 0.15,
                }
              ]}
              onPress={() => navigation.navigate("ChildDetailScreen", { child })}
            >
              {isDark ? (
                // Dark theme: dark card with opacity
                <View style={[styles.childCard, { backgroundColor: colors.cardMedium }]}>
                  <View style={styles.childHeader}>
                    <Image source={child.avatar} style={styles.childAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childInfo}>
                        Age: {child.age} | Grade: {child.grade} | {child.presence ? "Present" : "Absent"}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                        <Feather name="clipboard" size={16} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.taskText}>Tasks:</Text>
                        <View style={styles.taskBarBackground}>
                          <View
                            style={[
                              styles.taskBarProgress,
                              { width: `${(child.completedTasks / child.totalTasks) * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.taskNumber}>{child.completedTasks}/{child.totalTasks}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Feather name="bar-chart-2" size={16} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.performanceText}>Performance: {child.performance}%</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={26} color="white" />
                  </View>
                </View>
              ) : (
                // Light theme: colored gradient based on performance
                <LinearGradient colors={getGradient(child.performance)} style={styles.childCard}>
                  <View style={styles.childHeader}>
                    <Image source={child.avatar} style={styles.childAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childInfo}>
                        Age: {child.age} | Grade: {child.grade} | {child.presence ? "Present" : "Absent"}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                        <Feather name="clipboard" size={16} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.taskText}>Tasks:</Text>
                        <View style={styles.taskBarBackground}>
                          <View
                            style={[
                              styles.taskBarProgress,
                              { width: `${(child.completedTasks / child.totalTasks) * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.taskNumber}>{child.completedTasks}/{child.totalTasks}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <Feather name="bar-chart-2" size={16} color="white" style={{ marginRight: 6 }} />
                        <Text style={styles.performanceText}>Performance: {child.performance}%</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={26} color="white" />
                  </View>
                </LinearGradient>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
      </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  gif: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginTop: 0,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  childCardWrapper: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  childCard: {
    borderRadius: 20,
    padding: 16,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  childAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "white",
  },
  childInfo: {
    fontSize: 14,
    color: "white",
  },
  taskText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
    color: "white",
  },
  taskBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    overflow: "hidden",
    marginRight: 6,
  },
  taskBarProgress: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  taskNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  performanceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  bottomNav: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
});