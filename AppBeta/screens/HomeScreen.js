// screens/HomeScreen.js - Calendar Grid with Children Details
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('Daily');
  const [calendarExpanded, setCalendarExpanded] = useState(true);

  const user = route.params?.user;
  const username = user?.name || "Mohamed";
  const email = user?.email || "";

  const children = [
    { id: 1, name: "John Doe", age: 8, grade: 3, present: true, completedTasks: 10, totalTasks: 15, performance: 85, avatar: require("../assets/child1.jpg") },
    { id: 2, name: "Emma Smith", age: 7, grade: 2, present: false, completedTasks: 7, totalTasks: 12, performance: 50, avatar: require("../assets/child3.jpg") },
    { id: 3, name: "Liam Brown", age: 9, grade: 4, present: true, completedTasks: 12, totalTasks: 15, performance: 25, avatar: require("../assets/child2.jpg") },
  ];

  // Activity data for calendar dates
  const activityData = {
    '2024-12-08': { attendance: 3, tasks: 15, performance: 82 },
    '2024-12-09': { attendance: 2, tasks: 12, performance: 75 },
    '2024-12-10': { attendance: 3, tasks: 18, performance: 90 },
    '2024-12-05': { attendance: 2, tasks: 14, performance: 78 },
  };

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
    if (performance >= 75) return { gradient: ["#6FCF97", "#27AE60"], icon: "#27AE60" };
    if (performance >= 45) return { gradient: ["#F2C94C", "#F2994A"], icon: "#F2994A" };
    return { gradient: ["#EB5757", "#E53935"], icon: "#E53935" };
  };

  const renderChildCard = ({ item }) => {
    const isPressed = pressedCard === item.id;
    const { gradient } = getPerformanceColors(item.performance);
    
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

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const currentActivity = activityData[getDateKey(selectedDate)];

  const TOP_SECTION_HEIGHT = calendarExpanded ? screenHeight * 0.72 : screenHeight * 0.48;

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

      {/* FIXED PURPLE TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          <TopBar onMenuPress={toggleSidebar} notificationCount={2} />
          
          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* <Image 
              source={require("../assets/default_avatar.jpeg")} 
              style={styles.profileAvatar} 
            /> */}
            <View style={styles.greetingContainer}>
             
              <Text style={styles.greeting}>
                Hi, <Text style={styles.userName}>{username}</Text>
              </Text>

            </View>
          </View>

          {/* Activity Stats Cards - Above Calendar */}
          <View style={styles.activityStatsRow}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.statCardGradient}>
                <View style={styles.statIconCirclered}>
                  <Feather name="users" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.attendance || 0}</Text>
                <Text style={styles.statCardLabel}>Attendance</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.statCardGradient}>
                <View style={styles.statIconCirclepurple}>
                  <Feather name="check-circle" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.tasks || 0}</Text>
                <Text style={styles.statCardLabel}>Completed Tasks</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="trending-up" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.performance || 0}%</Text>
                <Text style={styles.statCardLabel}>Overall Performance</Text>
              </LinearGradient>
              <View style={styles.incompleteShadow}>
                <Text style={styles.incompleteText}>
                  {currentActivity ? (20 - currentActivity.tasks) : 20} Incomplete
                </Text>
              </View>
            </View>
          </View>

          {/* Calendar Section */}
          <View style={styles.calendarSection}>
            <TouchableOpacity 
              style={styles.selectDateRow}
              onPress={() => setCalendarExpanded(!calendarExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.selectDateText}>Select Date</Text>
              <View style={styles.headerRight}>
                <View style={styles.calendarIconContainer}>
                  <Feather name="calendar" size={18} color="#6F42C1" />
                </View>
                <View style={styles.toggleIconContainer}>
                  <Feather 
                    name={calendarExpanded ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </View>
              </View>
            </TouchableOpacity>

            {calendarExpanded && (
              <>
                {/* Month Navigation */}
                <View style={styles.monthNavigation}>
                  <TouchableOpacity onPress={previousMonth} style={styles.monthNavBtn}>
                    <Feather name="chevron-left" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.monthText}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </Text>
                  <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn}>
                    <Feather name="chevron-right" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarGrid}>
                  {/* Day Headers */}
                  <View style={styles.dayHeaderRow}>
                    {dayNames.map((day, idx) => (
                      <Text key={idx} style={styles.dayHeader}>{day}</Text>
                    ))}
                  </View>

                  {/* Calendar Days */}
                  <View style={styles.daysGrid}>
                    {days.map((day, index) => {
                      if (!day) {
                        return <View key={`empty-${index}`} style={styles.dayCell} />;
                      }

                      const isSelected = isSameDay(day, selectedDate);
                      const isTodayDate = isToday(day);
                      const hasActivity = activityData[getDateKey(day)];

                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedDate(day)}
                          style={[
                            styles.dayCell,
                            isSelected && styles.dayCellSelected,
                            isTodayDate && !isSelected && styles.dayCellToday,
                          ]}
                        >
                          <Text style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                            isTodayDate && !isSelected && styles.dayTextToday,
                          ]}>
                            {day.getDate()}
                          </Text>
                          {hasActivity && !isSelected && (
                            <View style={styles.activityDot} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                  {['Daily', 'Weekly', 'Monthly'].map((period) => (
                    <TouchableOpacity
                      key={period}
                      onPress={() => setSelectedPeriod(period)}
                      style={[
                        styles.periodBtn,
                        selectedPeriod === period && styles.periodBtnSelected
                      ]}
                    >
                      <Text style={[
                        styles.periodText,
                        selectedPeriod === period && styles.periodTextSelected
                      ]}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION - Children Details */}
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
  },
  safeArea: { height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight },
  
  // Profile Section
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFD700",
    backgroundColor: "#FFD700",
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  userName: {
    color: "#FFD700",
    fontWeight: "700",
  },
  pointsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  pointBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  pointText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  // Calendar Section
  calendarSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectDateText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  calendarIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#A5F3B4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Month Navigation
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  monthNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Calendar Grid
  calendarGrid: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 3,
  },
  dayCellSelected: {
    backgroundColor: "#FFD700",
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dayTextSelected: {
    color: "#6F42C1",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#FFD700",
  },
  activityDot: {
    position: "absolute",
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFD700",
  },

  // Activity Stats Cards (Above Calendar)
  activityStatsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "visible",
  },
  statCardGradient: {
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  statIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "rgba(165, 243, 180, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
   
   statIconCirclepurple: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: "rgba(165, 243, 180, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
   statIconCirclered: {
    width: 45,
    height: 45,
    borderRadius: 20,
    backgroundColor: "rgba(165, 243, 180, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statCardValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
  },
  incompleteShadow: {
    backgroundColor: "rgba(79, 70, 229, 0.5)",
    paddingVertical: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: "center",
  },
  incompleteText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },

  periodSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 17,
  },
  periodBtnSelected: {
    backgroundColor: "#FFD700",
  },
  periodText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  periodTextSelected: {
    color: "#6F42C1",
    fontWeight: "700",
  },

  // Bottom Section
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
  bottomNavContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10, 
    backgroundColor: "#ffffff" 
  },
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
  childAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12, borderWidth: 3, borderColor: "#FFD700" },
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