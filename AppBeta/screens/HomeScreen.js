// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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
import { normalize, wp, hp, screenWidth, screenHeight } from "../utils/responsive";

const getTopSectionHeight = () => {
  const baseHeight = Platform.OS === 'ios' ? hp(5.5) : (StatusBar.currentHeight || hp(3));
  const topBarHeight = hp(7.5);
  const profileHeight = hp(8.5);
  const testBtnHeight = hp(5);
  const statsHeight = hp(18);
  const padding = hp(5);
  return baseHeight + topBarHeight + profileHeight + testBtnHeight + statsHeight + padding;
};

const TOP_SECTION_HEIGHT = getTopSectionHeight();

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
    { 
      id: 1, 
      name: "John Doe", 
      age: 8, 
      grade: 3, 
      present: true, 
      completedTasks: 10, 
      totalTasks: 15, 
      performance: 85, 
      avatar: require("../assets/child1.png") 
    },
    { 
      id: 2, 
      name: "Emma Smith", 
      age: 7, 
      grade: 2, 
      present: false, 
      completedTasks: 7, 
      totalTasks: 12, 
      performance: 50, 
      avatar: require("../assets/child3.png") 
    },
    { 
      id: 3, 
      name: "Liam Brown", 
      age: 9, 
      grade: 4, 
      present: true, 
      completedTasks: 12, 
      totalTasks: 15, 
      performance: 25, 
      avatar: require("../assets/child2.png") 
    },
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
    if (performance >= 75) return { gradient: ["#6FCF97", "#27AE60"], icon: "#27AE60", border: "#27AE60" };
    if (performance >= 45) return { gradient: ["#F2C94C", "#F2994A"], icon: "#F2994A", border: "#F2994A" };
    return { gradient: ["#EB5757", "#E53935"], icon: "#E53935", border: "#E53935" };
  };

  const renderChildCard = ({ item }) => {
    const isPressed = pressedCard === item.id;
    const { gradient, border } = getPerformanceColors(item.performance);

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
        {/* Avatar positioned absolutely outside the gradient */}
        <View style={[
          styles.avatarContainer,
          isRTL ? { right: -wp(2) } : { left: -wp(2) }
        ]}>
          <View style={[styles.avatarBorder, { borderColor: border }]}>
            <Image
              source={item.avatar}
              style={styles.childAvatar}
            />
          </View>
        </View>

        <LinearGradient colors={gradient} style={styles.childCard}>
          <View style={[styles.childHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Empty space for avatar */}
            <View style={styles.avatarSpacer} />
            
            <View style={{ flex: 1 }}>
              <Text 
                style={[styles.childName, isRTL && { textAlign: 'right' }]}
                allowFontScaling={false}
              >
                {item.name}
              </Text>
              <View style={[
                { flexDirection: "row", alignItems: "center", marginTop: hp(0.5) },
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Text 
                  style={[styles.childInfo, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('age')}: {item.age} | {t('grade')}: {item.grade}
                </Text>
              </View>
              <View style={[
                { flexDirection: "row", alignItems: "center", marginTop: hp(0.7) },
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Feather
                  name={item.present ? "check-circle" : "x-circle"}
                  size={normalize(16)}
                  color="#ffffff"
                  style={isRTL ? { marginLeft: wp(1) } : { marginRight: wp(1) }}
                />
                <Text style={styles.statusText} allowFontScaling={false}>
                  {item.present ? t('present') : t('absent')}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.statsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather
                name="clipboard"
                size={normalize(16)}
                color="#ffffff"
                style={isRTL ? { marginLeft: wp(1) } : { marginRight: wp(1) }}
              />
              <Text style={styles.statText} allowFontScaling={false}>
                {t('tasks')}: {item.completedTasks}/{item.totalTasks}
              </Text>
            </View>
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather
                name="bar-chart-2"
                size={normalize(16)}
                color="#ffffff"
                style={isRTL ? { marginLeft: wp(1) } : { marginRight: wp(1) }}
              />
              <Text style={styles.statText} allowFontScaling={false}>
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
        <LinearGradient
          colors={colors.headerGradient}
          style={[StyleSheet.absoluteFill, { 
            borderBottomEndRadius: normalize(38), 
            borderBottomStartRadius: normalize(38), 
            overflow: 'hidden' 
          }]}
        >
          <View style={styles.safeArea} />

          <TopBar
            onMenuPress={toggleSidebar}
            notificationCount={unreadCount}
            onNotificationPress={toggleNotificationPanel}
          />

          <View style={[styles.profileSection, isRTL && { flexDirection: 'row-reverse' }]}>
            <Image
              source={require("../assets/human.jpg")}
              style={[
                styles.profileAvatar,
                isRTL && { marginLeft: wp(3), marginRight: 0 }
              ]}
            />
            <View style={styles.greetingContainer}>
              <Text 
                style={[styles.greeting, isRTL && { textAlign: 'right' }]}
                allowFontScaling={false}
              >
                {t('greeting')}, <Text style={styles.userName}>{username}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.calendarIconButton}
              onPress={() => setCalendarModalVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="calendar" size={normalize(18)} color="#6F42C1" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.testNotificationBtn}
            onPress={handleTestTrigger}
          >
            <Feather name="alert-circle" size={normalize(16)} color="#6F42C1" />
            <Text style={styles.testNotificationText} allowFontScaling={false}>
              Simulate Child Alert
            </Text>
          </TouchableOpacity>

          <View style={[styles.activityStatsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="users" size={normalize(16)} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue} allowFontScaling={false}>
                  {currentActivity?.attendance || 0}
                </Text>
                <Text style={styles.statCardLabel} allowFontScaling={false}>
                  {t('attendance')}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="check-circle" size={normalize(16)} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue} allowFontScaling={false}>
                  {currentActivity?.tasks || 0}
                </Text>
                <Text style={styles.statCardLabel} allowFontScaling={false}>
                  {t('completed')}
                </Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}>
                  <Feather name="trending-up" size={normalize(16)} color="#FFFFFF" />
                </View>
                <Text style={styles.statCardValue} allowFontScaling={false}>
                  {currentActivity?.performance || 0}%
                </Text>
                <Text style={styles.statCardLabel} allowFontScaling={false}>
                  {t('performance')}
                </Text>
                <View style={styles.incompleteBadge}>
                  <Text style={styles.incompleteText} allowFontScaling={false}>
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
          <View
            style={styles.calendarModalContent}
            onStartShouldSetResponder={() => true}
          >
            <LinearGradient
              colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]}
              style={styles.popupGradient}
            >
              <TouchableOpacity
                style={[styles.modalCloseButton, isRTL && { left: wp(4), right: 'auto' }]}
                onPress={() => setCalendarModalVisible(false)}
              >
                <Feather name="x" size={normalize(24)} color="#fff" />
              </TouchableOpacity>

              <View style={[styles.modalMonthNavigation, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                  onPress={isRTL ? nextMonth : previousMonth}
                  style={styles.modalMonthNavBtn}
                >
                  <Feather
                    name={isRTL ? "chevron-right" : "chevron-left"}
                    size={normalize(22)}
                    color="#fff"
                  />
                </TouchableOpacity>

                <View style={styles.monthLabelContainer}>
                  <Text style={styles.modalMonthText} allowFontScaling={false}>
                    {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={isRTL ? previousMonth : nextMonth}
                  style={styles.modalMonthNavBtn}
                >
                  <Feather
                    name={isRTL ? "chevron-left" : "chevron-right"}
                    size={normalize(22)}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.modalDayHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                  <Text key={idx} style={styles.modalDayHeader} allowFontScaling={false}>
                    {getDayName(idx)}
                  </Text>
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
                      <View
                        style={[
                          isSelected ? styles.selectedCircle : styles.normalCircle,
                          isTodayDate && !isSelected && styles.todayCircle
                        ]}
                      >
                        <Text
                          style={[
                            isSelected ? styles.selectedDateText : styles.normalDateText,
                            isTodayDate && !isSelected && styles.todayDateText
                          ]}
                          allowFontScaling={false}
                        >
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
                    <Text
                      style={[
                        styles.modalPeriodText,
                        selectedPeriod === period && styles.modalPeriodTextSelected
                      ]}
                      allowFontScaling={false}
                    >
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
        <ScrollView
          contentContainerStyle={styles.bottomScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text 
            style={[styles.childrenTitle, isRTL && { textAlign: 'right' }]}
            allowFontScaling={false}
          >
            {t('childrenDetails')}
          </Text>

          {children.map((child) => (
            <View key={child.id} style={{ marginBottom: hp(2) }}>
              {renderChildCard({ item: child })}
            </View>
          ))}

          <View style={{ height: hp(2.5) }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} activeScreen="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: TOP_SECTION_HEIGHT,
    zIndex: 1,
    borderBottomEndRadius: normalize(38),
    borderBottomStartRadius: normalize(38),
  },
  safeArea: {
    height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginTop: hp(0.7),
    marginBottom: hp(1.5),
  },
  profileAvatar: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    borderWidth: normalize(3),
    borderColor: "white",
    backgroundColor: "white",
    marginRight: wp(3),
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: normalize(20),
    color: "#FFFFFF",
  },
  userName: {
    color: "#FFD700",
    fontWeight: "700",
  },
  calendarIconButton: {
    width: wp(9.5),
    height: wp(9.5),
    backgroundColor: "#FFD700",
    borderRadius: normalize(12),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.2,
    shadowRadius: normalize(4),
    elevation: 4,
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: normalize(20),
    marginBottom: hp(1.5),
    gap: wp(1.5),
  },
  testNotificationText: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#6F42C1',
  },
  activityStatsRow: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    gap: wp(2.2),
    marginBottom: hp(2),
    alignItems: 'stretch',
  },
  statCard: {
    flex: 1,
    borderRadius: normalize(16),
    overflow: "hidden",
    minHeight: hp(16),
  },
  statCardGradient: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    alignItems: "center",
    justifyContent: "start-end",
    borderRadius: normalize(16),
  },
  statIconCircle: {
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.7),
  },
  statCardValue: {
    fontSize: normalize(22),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: hp(0.25),
  },
  statCardLabel: {
    fontSize: normalize(11),
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: hp(0.25),
  },
  incompleteBadge: {
    marginTop: hp(0.7),
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1.5),
    borderRadius: normalize(8),
  },
  incompleteText: {
    fontSize: normalize(9),
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
    width: wp(80),
    borderRadius: normalize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(20),
    elevation: 15,
    backgroundColor: "transparent",
  },
  popupGradient: {
    padding: wp(4),
    paddingBottom: hp(2),
    borderRadius: normalize(20),
  },
  modalCloseButton: {
    position: "absolute",
    top: hp(1.5),
    right: wp(3),
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: normalize(15),
    padding: wp(1.5),
  },
  modalMonthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
    marginTop: hp(1),
  },
  modalMonthNavBtn: {
    padding: wp(1.5),
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: normalize(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.12) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(2),
    elevation: 2,
  },
  monthLabelContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.6),
    borderRadius: normalize(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  modalMonthText: {
    fontSize: normalize(14),
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  modalDayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
    paddingHorizontal: wp(0.5),
  },
  modalDayHeader: {
    width: (wp(80) - wp(8)) / 7,
    textAlign: "center",
    fontSize: normalize(10),
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: wp(0.5),
  },
  modalDayCell: {
    width: (wp(80) - wp(8)) / 7,
    height: normalize(34),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0),
  },
  modalDayCellActive: {
    transform: [{ scale: 1.05 }],
  },
  selectedCircle: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(8),
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: hp(0.3) },
    shadowOpacity: 0.4,
    shadowRadius: normalize(5),
    elevation: 5,
  },
  normalCircle: {
    width: normalize(28),
    height: normalize(28),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalize(8),
  },
  todayCircle: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: normalize(1.5),
    borderColor: "rgba(255,255,255,0.6)",
  },
  selectedDateText: {
    fontSize: normalize(12),
    fontWeight: "800",
    color: "#6F42C1",
  },
  normalDateText: {
    fontSize: normalize(12),
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
    borderRadius: normalize(12),
    padding: wp(1),
    marginTop: hp(2),
  },
  modalPeriodBtn: {
    flex: 1,
    paddingVertical: hp(1.2),
    alignItems: "center",
    borderRadius: normalize(10),
  },
  modalPeriodBtnSelected: {
    backgroundColor: "#FFD700",
  },
  modalPeriodText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: normalize(14),
    fontWeight: "500",
  },
  modalPeriodTextSelected: {
    color: "#6F42C1",
    fontWeight: "700",
  },
  scrollableBottomSection: {
    position: "absolute",
    top: TOP_SECTION_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(-0.5) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(8),
    elevation: 8,
  },
  bottomScroll: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    paddingBottom: hp(12.5)
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
    fontSize: normalize(20),
    fontWeight: "700",
    marginBottom: hp(1.5),
    color: "#1a1a2e"
  },
  childCardWrapper: {
    width: "100%",
    borderRadius: normalize(20),
    overflow: "visible",
    shadowColor: "#000",
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: hp(0.5) },
    position: "relative",
  },
  avatarContainer: {
    position: "absolute",
    top: hp(2),
    zIndex: 2,
  },
  avatarBorder: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    borderWidth: normalize(4),
    padding: normalize(2),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  childAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: wp(7),
  },
  avatarSpacer: {
    width: wp(14),
    height: wp(14),
  },
  childCard: {
    borderRadius: normalize(20),
    padding: wp(4.5),
    overflow: "hidden",
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(2)
  },
  childName: {
    fontSize: normalize(18),
    fontWeight: "700",
    marginBottom: hp(0.25),
    color: "#ffffff"
  },
  childInfo: {
    fontSize: normalize(13),
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)"
  },
  statusText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#ffffff"
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: hp(1.5),
    borderTopWidth: normalize(1),
    borderTopColor: "rgba(255,255,255,0.3)",
    gap: wp(2),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#ffffff",
    flexShrink: 1,
  },
});