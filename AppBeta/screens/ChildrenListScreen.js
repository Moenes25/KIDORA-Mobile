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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { useNotifications } from "../context/NotificationContext";

const childrenGif = require("../assets/children.gif");
const screenHeight = Dimensions.get("window").height;
const TOP_SECTION_HEIGHT_RATIO = 0.28;

export default function ChildrenListScreen({ navigation, route }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { sendChildAlert, unreadCount } = useNotifications();

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
      avatar: require("../assets/child1.png"),
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
      avatar: require("../assets/child2.png"),
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
      avatar: require("../assets/child3.png"),
    },
  ];

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelVisible(!notificationPanelVisible);
  };

  const handleLogout = () => {
    Alert.alert(
      t('logoutTitle'),
      t('logoutMessage'),
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('yes'),
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
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />

      {/* SideBar */}
      <SideBar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        username={username}
        email={email}
        navigation={navigation}
        onLogout={handleLogout}
      />

      {/* Notification Panel */}
      <NotificationPanel 
        visible={notificationPanelVisible}
        onClose={toggleNotificationPanel}
      />

      {/* FIXED PURPLE TOP SECTION */}
      <View style={styles.fixedTopSection}>
        <LinearGradient 
          colors={colors.headerGradient || ["#6F42C1", "#9b59b6"]} 
          style={[StyleSheet.absoluteFill, { borderBottomEndRadius: 38, borderBottomStartRadius: 38, overflow: 'hidden' }]}
        >
          <View style={styles.safeArea} />
          
          {/* Top Bar with Notification Count */}
          <TopBar
            onMenuPress={toggleSidebar}
            notificationCount={unreadCount}
            onNotificationPress={toggleNotificationPanel}
          />

          {/* Header Content */}
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>
              {t('myChildren')}
            </Text>
            <Image source={childrenGif} style={styles.gif} />
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION - Children List */}
      <View style={styles.scrollableBottomSection}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.childCardWrapper}
              onPress={() => navigation.navigate("ChildDetailScreen", { child })}
              activeOpacity={0.8}
            >
              <LinearGradient colors={getGradient(child.performance)} style={styles.childCard}>
                <View style={[styles.childHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Image source={child.avatar} style={styles.childAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.childName, isRTL && { textAlign: 'right' }]}>
                      {child.name}
                    </Text>
                    <Text style={[styles.childInfo, isRTL && { textAlign: 'right' }]}>
                      {t('age')}: {child.age} | {t('grade')}: {child.grade} | {child.presence ? t('present') : t('absent')}
                    </Text>
                    <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 6 }, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather 
                        name="clipboard" 
                        size={16} 
                        color="white" 
                        style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }} 
                      />
                      <Text style={styles.taskText}>{t('tasks')}:</Text>
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
                    <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 4 }, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather 
                        name="bar-chart-2" 
                        size={16} 
                        color="white" 
                        style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }} 
                      />
                      <Text style={styles.performanceText}>
                        {t('performance')}: {child.performance}%
                      </Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"} 
                    size={26} 
                    color="white" 
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  
  // Fixed Purple Top Section
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * TOP_SECTION_HEIGHT_RATIO,
    zIndex: 1,
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
  },
  safeArea: { 
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight 
  },
  
  headerContent: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  gif: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  // Scrollable Bottom Section
  scrollableBottomSection: {
    position: "absolute",
    top: screenHeight * TOP_SECTION_HEIGHT_RATIO,
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
  scrollContent: { 
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 100 
  },

  // Child Cards
  childCardWrapper: {
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 20,
    overflow: "hidden",
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
    marginLeft: 8,
    borderWidth: 3,
    borderColor: "white",
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
    zIndex: 10,
    backgroundColor: "#ffffff",
  },
});