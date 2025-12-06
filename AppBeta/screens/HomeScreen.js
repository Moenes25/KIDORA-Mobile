// screens/HomeScreen.js — Dark theme with opacity cards
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

import BottomNav from "../components/BottomNav";
import SideBar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [expandedCard, setExpandedCard] = useState(null);
  const [animatedHeights, setAnimatedHeights] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lang, setLang] = useState("en");

  const user = route.params?.user;
  const username = user?.name || "User";
  const email = user?.email || "";

  const children = [
    { id: 1, name: "John Doe", age: 8, grade: 3, present: true, completedTasks: 10, totalTasks: 15, performance: 42, avatar: require("../assets/child1.jpg") },
    { id: 2, name: "Emma Smith", age: 7, grade: 2, present: false, completedTasks: 7, totalTasks: 12, performance: 74, avatar: require("../assets/child3.jpg") },
    { id: 3, name: "Liam Brown", age: 9, grade: 4, present: true, completedTasks: 12, totalTasks: 15, performance: 91, avatar: require("../assets/child2.jpg") },
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

  const shadowColor = isDark ? "#2d1b69" : "#000";

  const renderChildCard = ({ item, index }) => {
    let gradientColors = ["#6FCF97", "#27AE60"];
    if (item.performance >= 45 && item.performance < 75) gradientColors = ["#F2C94C", "#F2994A"];
    if (item.performance < 45) gradientColors = ["#EB5757", "#E53935"];

    return (
      <TouchableOpacity 
        style={[
          styles.childCardWrapper,
          {
            shadowColor: shadowColor,
            shadowOpacity: isDark ? 0.4 : 0.18,
          }
        ]} 
        activeOpacity={0.9}
      >
        {isDark ? (
          // Dark theme: dark card with opacity
          <View style={[styles.childCard, { backgroundColor: colors.cardMedium }]}>
            <View style={styles.childHeader}>
              <Image source={item.avatar} style={styles.childAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.childName}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.childInfo}>
                    Age: {item.age} | Grade: {item.grade} | {item.present ? "Present" : "Absent"}
                  </Text>
                  <Feather name={item.present ? "check" : "x"} size={16} color="#fff" style={{ marginLeft: 4 }} />
                </View>
              </View>
            </View>

            <View style={styles.taskRow}>
              <Feather name="clipboard" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.taskText}>Tasks:</Text>
              <View style={styles.taskBarBackground}>
                <View style={[styles.taskBarProgress, { width: `${(item.completedTasks / item.totalTasks) * 100}%` }]} />
              </View>
              <Text style={styles.taskNumber}>{item.completedTasks}/{item.totalTasks}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="bar-chart-2" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.performanceText}>Performance: {item.performance}%</Text>
            </View>
          </View>
        ) : (
          // Light theme: colored gradient based on performance
          <LinearGradient colors={gradientColors} style={styles.childCard}>
            <View style={styles.childHeader}>
              <Image source={item.avatar} style={styles.childAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.childName}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.childInfo}>
                    Age: {item.age} | Grade: {item.grade} | {item.present ? "Present" : "Absent"}
                  </Text>
                  <Feather name={item.present ? "check" : "x"} size={16} color="#fff" style={{ marginLeft: 4 }} />
                </View>
              </View>
            </View>

            <View style={styles.taskRow}>
              <Feather name="clipboard" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.taskText}>Tasks:</Text>
              <View style={styles.taskBarBackground}>
                <View style={[styles.taskBarProgress, { width: `${(item.completedTasks / item.totalTasks) * 100}%` }]} />
              </View>
              <Text style={styles.taskNumber}>{item.completedTasks}/{item.totalTasks}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="bar-chart-2" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.performanceText}>Performance: {item.performance}%</Text>
            </View>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

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
        />
        <TopBar onMenuPress={toggleSidebar} />

        <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Welcome Card */}
          {isDark ? (
            <View 
              style={[
                styles.welcomeCard,
                {
                  backgroundColor: colors.cardHeavy,
                  shadowColor: shadowColor,
                  shadowOpacity: 0.4,
                }
              ]}
            >
              <View style={styles.welcomeContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeTitle}>Welcome to Family Space</Text>
                  <Text style={styles.welcomeSubtitle}>
                    Track your children's progress and educational activities
                  </Text>
                </View>
                <Image source={require("../assets/famGif.gif")} style={styles.famGif} resizeMode="contain" />
              </View>
            </View>
          ) : (
            <LinearGradient 
              colors={colors.headerGradient} 
              style={[
                styles.welcomeCard,
                {
                  shadowColor: shadowColor,
                  shadowOpacity: 0.12,
                }
              ]}
            >
              <View style={styles.welcomeContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeTitle}>Welcome to Family Space</Text>
                  <Text style={styles.welcomeSubtitle}>
                    Track your children's progress and educational activities
                  </Text>
                </View>
                <Image source={require("../assets/famGif.gif")} style={styles.famGif} resizeMode="contain" />
              </View>
            </LinearGradient>
          )}

          {/* Metrics + Calendar */}
          {isDark ? (
            <View 
              style={[
                styles.metricBigCard,
                {
                  backgroundColor: colors.cardHeavy,
                  shadowColor: shadowColor,
                  shadowOpacity: 0.4,
                }
              ]}
            >
              <View style={styles.metricContainer}>
                <View style={[styles.metricCard, { backgroundColor: colors.cardMedium }]}>
                  <View style={styles.metricTop}>
                    <Feather name="users" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>3</Text>
                  </View>
                  <Text style={styles.metricText}>Children</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: colors.cardMedium }]}>
                  <View style={styles.metricTop}>
                    <Feather name="check-circle" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>15</Text>
                  </View>
                  <Text style={styles.metricText}>Completed Tasks</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: colors.cardMedium }]}>
                  <View style={styles.metricTop}>
                    <Feather name="bar-chart-2" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>82%</Text>
                  </View>
                  <Text style={styles.metricText}>Average performance</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 8 }}>
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
                          color: isToday ? colors.primary : "white",
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
          ) : (
            <LinearGradient 
              colors={colors.headerGradient} 
              style={[
                styles.metricBigCard,
                {
                  shadowColor: shadowColor,
                  shadowOpacity: 0.15,
                  elevation: 6,
                }
              ]}
            >
              <View style={styles.metricContainer}>
                <View style={[styles.metricCard, { backgroundColor: "rgba(110, 190, 252, 0.7)" }]}>
                  <View style={styles.metricTop}>
                    <Feather name="users" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>3</Text>
                  </View>
                  <Text style={styles.metricText}>Children</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: "rgba(55, 224, 178, 0.7)" }]}>
                  <View style={styles.metricTop}>
                    <Feather name="check-circle" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>15</Text>
                  </View>
                  <Text style={styles.metricText}>Completed Tasks</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: "rgba(255, 140, 97, 0.7)" }]}>
                  <View style={styles.metricTop}>
                    <Feather name="bar-chart-2" size={22} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.metricNumber}>82%</Text>
                  </View>
                  <Text style={styles.metricText}>Average performance</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef} contentContainerStyle={{ paddingHorizontal: 8 }}>
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
                          color: isToday ? colors.primary : "white",
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
            </LinearGradient>
          )}

          {/* Children */}
          <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
            <Text style={[styles.childrenTitle, { color: colors.text }]}>My Children</Text>
            {children.map((child, index) => (
              <View key={child.id} style={{ marginBottom: 16 }}>
                {renderChildCard({ item: child, index })}
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomNav navigation={navigation} activeScreen="home" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainScroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },
  welcomeCard: { 
    borderRadius: 16, 
    padding: 18, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 3 },
    elevation: 4, 
    marginBottom: 16, 
    marginTop: 16 
  },
  welcomeContent: { flexDirection: "row", alignItems: "center" },
  welcomeTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 6 },
  welcomeSubtitle: { color: "white", fontSize: 14, opacity: 0.95 },
  famGif: { width: 80, height: 80, marginLeft: 12 },
  metricBigCard: { 
    borderRadius: 16, 
    paddingVertical: 16, 
    paddingHorizontal: 10, 
    marginBottom: 16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  metricContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 0, marginBottom: 12 },
  metricCard: { width: 100, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10 },
  metricTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metricNumber: { color: "white", fontSize: 18, fontWeight: "700" },
  metricText: { color: "white", fontSize: 12, opacity: 0.95 },
  childrenTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  childCardWrapper: { 
    width: "100%", 
    borderRadius: 20, 
    overflow: "hidden", 
    elevation: 6, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 } 
  },
  childCard: { borderRadius: 20, padding: 16 },
  childHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  childAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  childName: { fontSize: 16, fontWeight: "700", marginBottom: 2, color: "#fff" },
  childInfo: { fontSize: 13, color: "#fff" },
  taskRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  taskText: { fontSize: 14, fontWeight: "600", marginRight: 6, color: "#fff" },
  taskBarBackground: { flex: 1, height: 10, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 5, overflow: "hidden", marginRight: 6 },
  taskBarProgress: { height: "100%", backgroundColor: "white", borderRadius: 5 },
  taskNumber: { fontSize: 13, fontWeight: "600", color: "#fff" },
  performanceText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});