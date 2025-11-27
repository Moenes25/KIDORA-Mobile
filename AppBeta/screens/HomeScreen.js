import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated, ScrollView } from "react-native";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import LanguageSelector from "../components/LanguageSelector";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen({ navigation }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded

  const notifScale = useRef(new Animated.Value(1)).current;
  const animateNotif = (toValue) => {
    Animated.spring(notifScale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const children = [
    {
      id: 1,
      name: "John Doe",
      age: 8,
      grade: 3,
      present: true,
      completedTasks: 10,
      totalTasks: 15,
      performance: 42,
      avatar: require("../assets/child1.jpg"),
    },
    {
      id: 2,
      name: "Emma Smith",
      age: 7,
      grade: 2,
      present: false,
      completedTasks: 7,
      totalTasks: 12,
      performance: 74,
      avatar: require("../assets/child3.jpg"),
    },
    {
      id: 3,
      name: "Liam Brown",
      age: 9,
      grade: 4,
      present: true,
      completedTasks: 12,
      totalTasks: 15,
      performance: 91,
      avatar: require("../assets/child2.jpg"),
    },
  ];

  // Function to calculate top position dynamically
  const getTopPosition = (index) => {
    let baseTop = index * 70; // default stacked offset
    if (expandedCard !== null && index > expandedCard) {
      const expandedHeight = 180; // estimated expanded height of a card
      return baseTop + expandedHeight - 70; // push down the cards below
    }
    return baseTop;
  };

  return (
    <View style={styles.container}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.logoContainer}>
          <Image source={require("../assets/kidora.png")} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.rightSection}>
          <Animated.View style={{ transform: [{ scale: notifScale }] }}>
            <TouchableOpacity
              onPressIn={() => animateNotif(1.1)}
              onPressOut={() => animateNotif(1)}
              activeOpacity={0.8}
            >
               <MaterialCommunityIcons name="bell" size={24} color="#6F42C1" />
            </TouchableOpacity>
          </Animated.View>
          <LanguageSelector />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mainScroll}>
        {/* Welcome Card */}
        <LinearGradient
          colors={["#6F42C1", "#9b59b6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Welcome to Family Space</Text>
              <Text style={styles.welcomeSubtitle}>
                Track your children's progress and educational activities
              </Text>
            </View>
            <Image
              source={require("../assets/famGif.gif")}
              style={styles.famGif}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        {/* Metric Cards */}
        <View style={styles.metricContainer}>
          <View style={[styles.metricCard, { backgroundColor: "#6ebefc" }]}>
            <View style={styles.metricTop}>
              <MaterialCommunityIcons name="account-group-outline" size={28} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.metricNumber}>3</Text>
            </View>
            <Text style={styles.metricText}>Children</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: "#37e0b2" }]}>
            <View style={styles.metricTop}>
              <Feather name="check-circle" size={28} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.metricNumber}>15</Text>
            </View>
            <Text style={styles.metricText}>Completed Tasks</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: "#ff8c61" }]}>
            <View style={styles.metricTop}>
              <Feather name="bar-chart-2" size={28} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.metricNumber}>82%</Text>
            </View>
            <Text style={styles.metricText}>Performance</Text>
          </View>
        </View>

        {/* Stacked Child Cards */}
        <View style={styles.childStackContainer}>
          {children.map((child, index) => {
            let gradientColors = ["#6FCF97", "#27AE60"];
            if (child.performance >= 45 && child.performance < 75) gradientColors = ["#F2C94C", "#F2994A"];
            if (child.performance < 45) gradientColors = ["#EB5757", "#E53935"];

            const isLastCard = index === children.length - 1;

            return (
              <TouchableOpacity
                key={child.id}
                style={[
                  styles.childCardWrapper,
                  { top: getTopPosition(index), zIndex: index },
                ]}
                activeOpacity={0.9}
                onPress={() => {
                  if (!isLastCard) {
                    setExpandedCard(expandedCard === index ? null : index);
                  }
                }}
              >
                <LinearGradient
                  colors={gradientColors}
                  style={[
                    styles.childCard,
                    { height: isLastCard ? 130 : (expandedCard === index ? 180 : 130) },
                  ]}
                >
                  <View style={styles.childHeader}>
                    <Image source={child.avatar} style={styles.childAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.childInfo}>
                          Age: {child.age} | Grade: {child.grade} | {child.present ? "Present" : "Absent"}
                        </Text>
                        <Feather name={child.present ? "check" : "x"} size={16} color="#fff" style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </View>

                  <View style={[styles.taskRow, { alignItems: "center" }]}>
                    <Feather name="clipboard" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.taskText}>Tasks:</Text>
                    <View style={styles.taskBarBackground}>
                      <View
                        style={[
                          styles.taskBarProgress,
                          { width: `${(child.completedTasks / child.totalTasks) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.taskNumber}>
                      {child.completedTasks}/{child.totalTasks}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather name="bar-chart-2" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.performanceText}>Performance: {child.performance}%</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },

  topBar: {
    backgroundColor: "#fbf7ff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 70,
  },

  logoContainer: { flexDirection: "row", alignItems: "center" },
  logo: { width: 90, height: 80 },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 10 },

  mainScroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },

  welcomeCard: {
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  welcomeContent: { flexDirection: "row", alignItems: "center" },
  welcomeTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 6 },
  welcomeSubtitle: { color: "white", fontSize: 14, opacity: 0.95 },
  famGif: { width: 80, height: 80, marginLeft: 12 },

  metricContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 6 },
  metricCard: { flexBasis: "48%", borderRadius: 12, padding: 18, marginBottom: 6 },
  metricTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  metricNumber: { color: "white", fontSize: 24, fontWeight: "700" },
  metricText: { color: "white", fontSize: 16, opacity: 0.95 },

  childStackContainer: {
    position: "relative",
    height: 500,
    marginTop: 20,
  },
  childCardWrapper: {
    position: "absolute",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  childCard: {
    borderRadius: 20,
    padding: 16,
  },
  childHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  childAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  childName: { fontSize: 16, fontWeight: "700", marginBottom: 2, color: "#fff" },
  childInfo: { fontSize: 13, color: "#fff" },
  taskRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  taskText: { fontSize: 14, fontWeight: "600", marginRight: 6, color: "#fff" },
  taskBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 5,
    overflow: "hidden",
    marginRight: 6,
  },
  taskBarProgress: { height: "100%", backgroundColor: "white", borderRadius: 5 },
  taskNumber: { fontSize: 13, fontWeight: "600", color: "#fff" },
  performanceText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
