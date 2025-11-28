import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated, ScrollView, Dimensions } from "react-native";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import LanguageSelector from "../components/LanguageSelector";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation, route }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const notifScale = useRef(new Animated.Value(1)).current;
  const animateNotif = (toValue) => {
    Animated.spring(notifScale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const [animatedHeights, setAnimatedHeights] = useState({});

  const user = route.params?.user;
  const userName = user?.name || "Parent";
  const userAvatar = user?.avatar || require("../assets/default_avatar.jpg");

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

  const extraHeight = 60;
  const getTopPosition = (index) => {
    if (expandedCard !== null && index > expandedCard) {
      return index * 70 + extraHeight;
    }
    return index * 70;
  };

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
        scrollRef.current.scrollTo({ x: offset > 0 ? offset : 0, animated: true });
      }
    }, 100);
  }, []);

  const toggleCard = (index) => {
    if (expandedCard === index) {
      Animated.timing(animatedHeights[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedCard(null));
    } else {
      const newAnimatedHeights = { ...animatedHeights };
      if (!newAnimatedHeights[index]) newAnimatedHeights[index] = new Animated.Value(0);
      if (expandedCard !== null && expandedCard !== index) {
        Animated.timing(animatedHeights[expandedCard], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
      setExpandedCard(index);
      Animated.timing(newAnimatedHeights[index], {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setAnimatedHeights(newAnimatedHeights);
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIconContainer}>
            <Feather name="menu" size={28} color="#6F42C1" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image source={userAvatar} style={styles.userAvatar} />
            <Text style={styles.userName}>Welcome {userName}</Text>
          </View>
        </View>

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

        {/* Metric Cards + Calendar */}
        <LinearGradient
          colors={["#6F42C1", "#9b59b6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.metricBigCard}
        >
          {/* Metric Cards (all 3 fit without scroll) */}
          <View style={[styles.metricContainer, { marginBottom: 12 }]}>
            <View style={[styles.metricCard, { backgroundColor: "rgba(110, 190, 252, 0.7)" }]}>
              <View style={styles.metricTop}>
                <MaterialCommunityIcons name="account-group-outline" size={22} color="white" style={{ marginRight: 8 }} />
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

          {/* Calendar */}
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
                      color: isToday ? "#6F42C1" : "white",
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

        {/* Child Cards */}
        <View style={styles.childStackContainer}>
          {children.map((child, index) => {
            let gradientColors = ["#6FCF97", "#27AE60"];
            if (child.performance >= 45 && child.performance < 75) gradientColors = ["#F2C94C", "#F2994A"];
            if (child.performance < 45) gradientColors = ["#EB5757", "#E53935"];

            if (!animatedHeights[index]) animatedHeights[index] = new Animated.Value(0);

            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childCardWrapper, { top: getTopPosition(index), zIndex: index }]}
                activeOpacity={0.9}
                onPress={() => toggleCard(index)}
              >
                <LinearGradient colors={gradientColors} style={styles.childCard}>
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
                      <View style={[styles.taskBarProgress, { width: `${(child.completedTasks / child.totalTasks) * 100}%` }]} />
                    </View>
                    <Text style={styles.taskNumber}>{child.completedTasks}/{child.totalTasks}</Text>
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
  topBar: { backgroundColor: "#fbf7ff", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 5, paddingBottom: 5, height: 70 },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuIconContainer: { paddingRight: 10 },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 18, fontWeight: "600", color: "#6F42C1" },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 10 },
  mainScroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },
  welcomeCard: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 4, marginBottom: 16 },
  welcomeContent: { flexDirection: "row", alignItems: "center" },
  welcomeTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 6 },
  welcomeSubtitle: { color: "white", fontSize: 14, opacity: 0.95 },
  famGif: { width: 80, height: 80, marginLeft: 12 },
  metricBigCard: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 10, marginBottom: 16 },
  metricContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 0 },
  metricCard: { width: 100, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10 },
  metricTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metricNumber: { color: "white", fontSize: 18, fontWeight: "700" },
  metricText: { color: "white", fontSize: 14, opacity: 0.95 },
  childStackContainer: { position: "relative", height: 500, marginTop: 20 },
  childCardWrapper: { position: "absolute", width: "100%", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
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
