import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

const childrenGif = require("../assets/children.gif");

export default function ChildrenListScreen({ navigation, route }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lang, setLang] = useState('en');

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
    Alert.alert(
      "Notifications",
      "Notifications feature coming soon!",
      [{ text: "OK" }]
    );
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    Alert.alert('Language Changed', `Language switched to ${newLang.toUpperCase()}`);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  const getGradient = (performance) => {
    if (performance >= 75) return ["#6FCF97", "#27AE60"];
    if (performance >= 45) return ["#F2C94C", "#F2994A"];
    return ["#EB5757", "#E53935"];
  };

  return (
    <View style={styles.container}>
      {/* SideBar */}
      <SideBar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        username={username}
        email={email}
        navigation={navigation}
        onLogout={handleLogout}
        onNotifications={handleNotifications}
      />

      {/* Top Bar */}
      <TopBar
        onMenuPress={toggleSidebar}
        onNotificationPress={handleNotifications}
        onLanguageChange={handleLanguageChange}
        lang={lang}
      />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Gradient Header */}
        <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
          <Text style={styles.headerTitle}>My Children</Text>
          <Image source={childrenGif} style={styles.gif} />
        </LinearGradient>

        {/* Children List */}
        <View style={styles.listContainer}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.childCardWrapper}
              onPress={() => navigation.navigate("ChildDetailScreen", { child })}
            >
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation fixed at bottom */}
      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },
  scrollContent: { paddingBottom: 100},
  header: {
    width: "100%",
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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