// screens/HomeScreen.js - Performance-based colors
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

import BottomNav from "../components/BottomNav";
import SideBar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation, route }) {
  const { colors } = useTheme();

  const [pressedCard, setPressedCard] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const user = route.params?.user;
  const username = user?.name || "User";
  const email = user?.email || "";

  const children = [
    { id: 1, name: "John Doe", age: 8, grade: 3, present: true, completedTasks: 10, totalTasks: 15, performance: 85, avatar: require("../assets/child1.jpg") },
    { id: 2, name: "Emma Smith", age: 7, grade: 2, present: false, completedTasks: 7, totalTasks: 12, performance: 50, avatar: require("../assets/child3.jpg") },
    { id: 3, name: "Liam Brown", age: 9, grade: 4, present: true, completedTasks: 12, totalTasks: 15, performance: 25, avatar: require("../assets/child2.jpg") },
  ];

  const today = new Date();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const scrollRef = useRef(null);
  const currentDayIndex = (today.getDay() + 6) % 7;

  const weekDays = dayNames.map((day, index) => {
    const d = new Date(today);
    const diff = index - currentDayIndex;
    d.setDate(today.getDate() + diff);
    return { name: day, date: d.getDate() };
  });

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        const cardWidth = 80;
        const offset = cardWidth * currentDayIndex - screenWidth / 2 + cardWidth / 2;
        scrollRef.current.scrollTo({ x: Math.max(offset, 0), animated: true });
      }
    }, 100);
  }, []);

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
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

  const getPerformanceColors = (performance) => {
    if (performance >= 75) return { gradient: ["#6FCF97", "#27AE60"], icon: "#27AE60" }; // Green - Good
    if (performance >= 45) return { gradient: ["#F2C94C", "#F2994A"], icon: "#F2994A" }; // Yellow - Neutral
    return { gradient: ["#EB5757", "#E53935"], icon: "#E53935" }; // Red - Needs attention
  };

  const renderChildCard = ({ item }) => {
    const isPressed = pressedCard === item.id;
    const { gradient, icon } = getPerformanceColors(item.performance);
    
    return (
      <TouchableOpacity 
        style={[
          styles.childCardWrapper,
          {
            shadowOpacity: isPressed ? 0.25 : 0.15,
            elevation: isPressed ? 8 : 4,
          }
        ]} 
        activeOpacity={1}
        onPressIn={() => setPressedCard(item.id)}
        onPressOut={() => setPressedCard(null)}
      >
        <LinearGradient colors={gradient} style={styles.childCard}>
          <View style={styles.childHeader}>
            <Image source={item.avatar} style={styles.childAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.childName}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={styles.childInfo}>Age: {item.age} | Grade: {item.grade}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                <Feather 
                  name={item.present ? "check-circle" : "x-circle"} 
                  size={16} 
                  color="#ffffff"
                  style={{ marginRight: 4 }} 
                />
                <Text style={styles.statusText}>
                  {item.present ? "Present" : "Absent"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="clipboard" size={16} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>Tasks: {item.completedTasks}/{item.totalTasks}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Feather name="bar-chart-2" size={16} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.statText}>Performance: {item.performance}%</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const TOP_SECTION_HEIGHT = screenHeight * 0.45;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />
      
      <SideBar 
        visible={sidebarVisible} 
        onClose={toggleSidebar} 
        username={username} 
        email={email} 
        navigation={navigation} 
        onLogout={handleLogout} 
      />

      {/* FIXED TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          <TopBar onMenuPress={toggleSidebar} />
          
          <ScrollView 
            style={styles.topScrollView}
            contentContainerStyle={styles.topContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>My Children</Text>
              <Image source={require("../assets/famGif.gif")} style={styles.gif} resizeMode="contain" />
            </View>

            <View style={styles.metricBigCard}>
              <View style={styles.metricContainer}>
                <View style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Feather name="users" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>3</Text>
                  </View>
                  <Text style={styles.metricText}>Children</Text>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Feather name="check-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>15</Text>
                  </View>
                  <Text style={styles.metricText}>Completed Tasks</Text>
                </View>
                <View style={styles.metricCard}>
                  <View style={styles.metricTop}>
                    <Feather name="bar-chart-2" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>82%</Text>
                  </View>
                  <Text style={styles.metricText}>Average performance</Text>
                </View>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                ref={scrollRef} 
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                <View style={{ flexDirection: "row" }}>
                  {weekDays.map((day, index) => {
                    const isToday = index === currentDayIndex;
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: isToday ? "white" : "rgba(255,255,255,0.2)",
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                      >
                        <Text style={{
                          color: isToday ? "#6F42C1" : "#FFFFFF",
                          fontWeight: isToday ? "700" : "500",
                          fontSize: 14,
                        }}>
                          {day.name} {day.date}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            
            <View style={{ height: 20 }} />
          </ScrollView>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View style={[styles.scrollableBottomSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.childrenTitle}>Children Details</Text>
          
          {children.map((child) => (
            <View key={child.id} style={{ marginBottom: 16 }}>
              {renderChildCard({ item: child })}
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} activeScreen="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  safeArea: { height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight },
  topScrollView: { flex: 1 },
  topContent: { paddingHorizontal: 16, paddingBottom: 16 },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#ffffff" },
  gif: { width: 80, height: 80 },
  scrollableBottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomScroll: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 100 },
  bottomNavContainer: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "#ffffff" },
  metricBigCard: { 
    borderRadius: 16, 
    paddingVertical: 16, 
    paddingHorizontal: 10, 
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  metricContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 0, marginBottom: 12 },
  metricCard: { width: 100, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, backgroundColor: "rgba(255, 255, 255, 0.15)" },
  metricTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metricNumber: { fontSize: 18, fontWeight: "700", color: "#FFFFFF" },
  metricText: { fontSize: 12, color: "#FFFFFF", opacity: 0.9 },
  childrenTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#1a1a2e" },
  childCardWrapper: { 
    width: "100%", 
    borderRadius: 20, 
    overflow: "hidden", 
    shadowColor: "#000",
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 },
  },
  childCard: { borderRadius: 20, padding: 18 },
  childHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  childAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)" },
  childName: { fontSize: 18, fontWeight: "700", marginBottom: 2, color: "#ffffff" },
  childInfo: { fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.9)" },
  statusText: { fontSize: 13, fontWeight: "600", color: "#ffffff" },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
  },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { fontSize: 13, fontWeight: "600", color: "#ffffff" },
});