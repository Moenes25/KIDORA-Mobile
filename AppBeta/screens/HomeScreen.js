// screens/HomeScreen.js
import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { useNotifications } from "../context/NotificationContext";

import BottomNav from "../components/BottomNav";
import SideBar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import NotificationPanel from "../components/NotificationPanel";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const TOP_SECTION_HEIGHT_RATIO = 0.42; 

export default function HomeScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t, isRTL, getMonthName, getDayName } = useTranslation();
  const { sendChildAlert, unreadCount } = useNotifications();

  const [pressedCard, setPressedCard] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const user = route.params?.user;
  const username = user?.name || "Mohamed";
  const email = user?.email || "";

  const handleTestTrigger = () => {
    const scenarios = [
      { name: "John", status: "Left School 🏫", location: "the Main Gate" },
      { name: "Emma", status: "Arrived Home 🏠", location: "Home" },
      { name: "Liam", status: "Is Nearby 📍", location: "the Playground" },
    ];
    
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (sendChildAlert) {
      sendChildAlert(randomScenario.name, randomScenario.status, randomScenario.location);
    } else {
      console.warn("sendChildAlert function is missing from NotificationContext");
    }
  };

  const children = [
    { id: 1, name: "John Doe", age: 8, grade: 3, present: true, completedTasks: 10, totalTasks: 15, performance: 85, avatar: require("../assets/child1.png") },
    { id: 2, name: "Emma Smith", age: 7, grade: 2, present: false, completedTasks: 7, totalTasks: 12, performance: 50, avatar: require("../assets/child3.png") },
    { id: 3, name: "Liam Brown", age: 9, grade: 4, present: true, completedTasks: 12, totalTasks: 15, performance: 25, avatar: require("../assets/child2.png") },
  ];

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

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const toggleNotificationPanel = () => setNotificationPanelVisible(!notificationPanelVisible);

  const handleLogout = async () => {
    Alert.alert(t('logoutTitle'), t('logoutMessage'), [
      { text: t('cancel'), style: "cancel" },
      {
        text: t('yes'),
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
          <View style={[styles.childHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Image 
              source={item.avatar} 
              style={[
                styles.childAvatar,
                isRTL ? { marginLeft: 12, marginRight: 0 } : { marginRight: 12, marginLeft: 0 }
              ]} 
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.childName, isRTL && { textAlign: 'right' }]}>{item.name}</Text>
              <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 4 }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.childInfo, isRTL && { textAlign: 'right' }]}>
                  {t('age')}: {item.age} | {t('grade')}: {item.grade}
                </Text>
              </View>
              <View style={[{ flexDirection: "row", alignItems: "center", marginTop: 6 }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Feather 
                  name={item.present ? "check-circle" : "x-circle"} 
                  size={16} 
                  color="#ffffff"
                  style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }} 
                />
                <Text style={styles.statusText}>
                  {item.present ? t('present') : t('absent')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.statsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather 
                name="clipboard" 
                size={16} 
                color="#ffffff" 
                style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }} 
              />
              <Text style={styles.statText}>
                {t('tasks')}: {item.completedTasks}/{item.totalTasks}
              </Text>
            </View>
            
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather 
                name="bar-chart-2" 
                size={16} 
                color="#ffffff" 
                style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }} 
              />
              <Text style={styles.statText}>
                {t('performance')}: {item.performance}%
              </Text>
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

  const handleDateSelect = (day) => {
    setSelectedDate(day);
    setCalendarModalVisible(false);
  };

  const days = getDaysInMonth(currentMonth);
  const currentActivity = activityData[getDateKey(selectedDate)];

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

      <NotificationPanel 
        visible={notificationPanelVisible}
        onClose={toggleNotificationPanel}
      />

      <View style={styles.fixedTopSection}>
        <LinearGradient colors={colors.headerGradient} style={[StyleSheet.absoluteFill, { borderBottomEndRadius: 38, borderBottomStartRadius: 38, overflow: 'hidden' }]}>

          <View style={styles.safeArea} />
          
          <TopBar 
            onMenuPress={toggleSidebar} 
            notificationCount={unreadCount}
            onNotificationPress={toggleNotificationPanel}
          />
          
          <View style={[styles.profileSection, isRTL && { flexDirection: 'row-reverse' }]}>
            <Image 
              source={require("../assets/human.jpg")} 
              style={[styles.profileAvatar, isRTL && { marginLeft: 12, marginRight: 0 }]} 
            />
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, isRTL && { textAlign: 'right' }]}>
                {t('greeting')}, <Text style={styles.userName}>{username}</Text>
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.calendarIconButton}
              onPress={() => setCalendarModalVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="calendar" size={22} color="#6F42C1" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.testNotificationBtn}
            onPress={handleTestTrigger}
          >
            <Feather name="alert-circle" size={16} color="#6F42C1" />
            <Text style={styles.testNotificationText}>Simulate Child Alert</Text>
          </TouchableOpacity>

          <View style={[styles.activityStatsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="users" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.attendance || 0}</Text>
                <Text style={styles.statCardLabel}>{t('attendance')}</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="check-circle" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.tasks || 0}</Text>
                <Text style={styles.statCardLabel}>{t('completed')}</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="trending-up" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue}>{currentActivity?.performance || 0}%</Text>
                <Text style={styles.statCardLabel}>{t('performance')}</Text>
                
                <View style={styles.incompleteBadge}>
                  <Text style={styles.incompleteText}>
                    {currentActivity ? (20 - currentActivity.tasks) : 20} {t('incomplete')}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

        </LinearGradient>
      </View>

      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCalendarModalVisible(false)}
        >
          <View style={styles.calendarModalContent} onStartShouldSetResponder={() => true}>
            <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={styles.popupGradient}>
              
              <TouchableOpacity 
                style={[styles.modalCloseButton, isRTL && { left: 15, right: 'auto' }]}
                onPress={() => setCalendarModalVisible(false)}
              >
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={[styles.modalMonthNavigation, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity onPress={isRTL ? nextMonth : previousMonth} style={styles.modalMonthNavBtn}>
                  <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={22} color="#fff" />
                </TouchableOpacity>
                <View style={styles.monthLabelContainer}>
                  <Text style={styles.modalMonthText}>
                    {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
                  </Text>
                </View>
                <TouchableOpacity onPress={isRTL ? previousMonth : nextMonth} style={styles.modalMonthNavBtn}>
                  <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={[styles.modalDayHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {[0,1,2,3,4,5,6].map((idx) => (
                  <Text key={idx} style={styles.modalDayHeader}>{getDayName(idx)}</Text>
                ))}
              </View>

              <View style={styles.modalDaysGrid}>
                {days.map((day, index) => {
                  if (!day) {
                    return <View key={`empty-${index}`} style={styles.modalDayCell} />;
                  }

                  const isSelected = isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDateSelect(day)}
                      style={[styles.modalDayCell, isSelected && styles.modalDayCellActive]}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        isSelected ? styles.selectedCircle : styles.normalCircle,
                        isTodayDate && !isSelected && styles.todayCircle
                      ]}>
                        <Text style={[
                          isSelected ? styles.selectedDateText : styles.normalDateText,
                          isTodayDate && !isSelected && styles.todayDateText
                        ]}>
                          {day.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.modalPeriodSelector}>
                {['daily', 'weekly', 'monthly'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    style={[
                      styles.modalPeriodBtn,
                      selectedPeriod === period && styles.modalPeriodBtnSelected
                    ]}
                  >
                    <Text style={[
                      styles.modalPeriodText,
                      selectedPeriod === period && styles.modalPeriodTextSelected
                    ]}>
                      {t(period)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.scrollableBottomSection}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.childrenTitle, isRTL && { textAlign: 'right' }]}>
            {t('childrenDetails')}
          </Text>
          
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
    height: screenHeight * TOP_SECTION_HEIGHT_RATIO,
    zIndex: 1,
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
  },
  safeArea: { height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight },
  
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "white",
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  userName: {
    color: "#FFD700",
    fontWeight: "700",
  },
  calendarIconButton: {
    width: 44,
    height: 44,
    backgroundColor: "#FFD700",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  testNotificationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F42C1',
  },

  activityStatsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 9,
    marginBottom: 16,
    alignItems: 'stretch', 
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 130,
  },
  statCardGradient: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "start-end", 
    borderRadius: 16,
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 2,
  },
  incompleteBadge: {
    marginTop: 6,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  incompleteText: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "900",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContent: {
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: "transparent",
  },
  popupGradient: {
    padding: 20,
    paddingBottom: 30,
    borderRadius: 25,
  },
  modalCloseButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
  modalMonthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  modalMonthNavBtn: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  monthLabelContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalMonthText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  modalDayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  modalDayHeader: {
    width: (screenWidth * 0.9 - 40) / 7,
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 2,
  },
  modalDayCell: {
    width: (screenWidth * 0.9 - 40) / 7,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalDayCellActive: {
    transform: [{ scale: 1.05 }],
  },
  selectedCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  normalCircle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  todayCircle: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#6F42C1",
  },
  normalDateText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
  },
  todayDateText: {
    color: "#fff",
    fontWeight: "800",
  },
  modalPeriodSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 4,
    marginTop: 16,
  },
  modalPeriodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  modalPeriodBtnSelected: {
    backgroundColor: "#FFD700",
  },
  modalPeriodText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  modalPeriodTextSelected: {
    color: "#6F42C1",
    fontWeight: "700",
  },

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
  bottomScroll: { 
    paddingHorizontal: 16, 
    paddingTop: 32, 
    paddingBottom: 100 
  },
  bottomNavContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10, 
    backgroundColor: "#ffffff" 
  },
  childrenTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 12, 
    color: "#1a1a2e" 
  },
  childCardWrapper: { 
    width: "100%", 
    borderRadius: 20, 
    overflow: "hidden", 
    shadowColor: "#000",
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 4 },
  },
  childCard: { 
    borderRadius: 20, 
    padding: 18 
  },
  childHeader: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    marginBottom: 16 
  },
  childAvatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    borderWidth: 3, 
    borderColor: "white" 
  },
  childName: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 2, 
    color: "#ffffff" 
  },
  childInfo: { 
    fontSize: 13, 
    fontWeight: "500", 
    color: "rgba(255,255,255,0.9)" 
  },
  statusText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#ffffff" 
  },
  statsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    gap: 8,
  },
  statItem: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1,
  },
  statText: { 
    fontSize: 13, 
    fontWeight: "600", 
    color: "#ffffff",
    flexShrink: 1,
  },
});