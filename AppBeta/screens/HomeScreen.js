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

// 1. IMPORT YOUR MOCK DATA
import mockDailyReports from "../data/MockDailyReports";

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

const childAvatars = {
  "child-001": require("../assets/child1.png"),
  "child-002": require("../assets/child3.png"),
  "child-003": require("../assets/child2.png"),
  "child-004": require("../assets/child1.png"),
};

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

  // Mapping children from MockDailyReports
  const children = mockDailyReports.map(report => ({
    id: report.childId,
    name: report.name,
    age: report.age,
    grade: report.age === 4 ? "Preschool" : (report.age - 5) + "st Grade",
    present: report.attendance === "Present",
    completedTasks: Math.floor(Math.random() * 5) + 10,
    totalTasks: 15,
    performance: report.mood === "Happy" ? 90 : report.mood === "Neutral" ? 70 : 40,
    avatar: childAvatars[report.childId]
  }));

  const activityData = {
    '2025-12-24': { attendance: 4, tasks: 52, performance: 88 },
  };

  const handleTestTrigger = () => {
    const scenarios = [
      { name: "Charlie", status: "Left School 🏫", location: "the Main Gate" },
      { name: "Emma", status: "Arrived Home 🏠", location: "Home" },
    ];
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    sendChildAlert?.(randomScenario.name, randomScenario.status, randomScenario.location);
  };

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const isToday = (date) => date && date.toDateString() === new Date().toDateString();
  const isSameDay = (d1, d2) => d1 && d2 && d1.toDateString() === d2.toDateString();

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
    if (performance >= 75) return { gradient: ["#6FCF97", "#27AE60"], border: "#27AE60" };
    if (performance >= 45) return { gradient: ["#F2C94C", "#F2994A"], border: "#F2994A" };
    return { gradient: ["#EB5757", "#E53935"], border: "#E53935" };
  };

  const renderChildCard = ({ item }) => {
    const isPressed = pressedCard === item.id;
    const { gradient, border } = getPerformanceColors(item.performance);

    return (
      <View
        style={[styles.childCardWrapper, { elevation: isPressed ? 8 : 4 }]}
      >
        <View style={[styles.avatarContainer, isRTL ? { right: -wp(2) } : { left: -wp(2) }]}>
          <View style={[styles.avatarBorder, { borderColor: border }]}>
            <Image source={item.avatar} style={styles.childAvatar} />
          </View>
        </View>

        <LinearGradient colors={gradient} style={styles.childCard}>
          <View style={[styles.childHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.avatarSpacer} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.childName, isRTL && { textAlign: 'right' }]}>{item.name}</Text>
              <Text style={[styles.childInfo, isRTL && { textAlign: 'right' }]}>{t('age')}: {item.age} | {t('grade')}: {item.grade}</Text>
              <View style={[{ flexDirection: "row", alignItems: "center", marginTop: hp(0.7) }, isRTL && { flexDirection: 'row-reverse' }]}>
                <Feather name={item.present ? "check-circle" : "x-circle"} size={normalize(16)} color="#ffffff" />
                <Text style={[styles.statusText, isRTL ? { marginRight: wp(1) } : { marginLeft: wp(1) }]}>{item.present ? t('present') : t('absent')}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather name="clipboard" size={normalize(16)} color="#ffffff" />
              <Text style={[styles.statText, isRTL ? { marginRight: wp(1) } : { marginLeft: wp(1) }]}>{t('tasks')}: {item.completedTasks}/{item.totalTasks}</Text>
            </View>
            <View style={[styles.statItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Feather name="bar-chart-2" size={normalize(16)} color="#ffffff" />
              <Text style={[styles.statText, isRTL ? { marginRight: wp(1) } : { marginLeft: wp(1) }]}>{t('performance')}: {item.performance}%</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  
  const days = getDaysInMonth(currentMonth);
  const currentActivity = activityData[getDateKey(selectedDate)];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />

      <SideBar visible={sidebarVisible} onClose={toggleSidebar} username={username} email={email} navigation={navigation} onLogout={handleLogout} />
      <NotificationPanel visible={notificationPanelVisible} onClose={toggleNotificationPanel} />

      <View style={styles.fixedTopSection}>
        <LinearGradient colors={colors.headerGradient} style={[StyleSheet.absoluteFill, { borderBottomEndRadius: normalize(38), borderBottomStartRadius: normalize(38), overflow: 'hidden' }]}>
          <View style={styles.safeArea} />
          <TopBar onMenuPress={toggleSidebar} notificationCount={unreadCount} onNotificationPress={toggleNotificationPanel} />

          <View style={[styles.profileSection, isRTL && { flexDirection: 'row-reverse' }]}>
            <Image 
                source={require("../assets/human.jpg")} 
                style={[
                    styles.profileAvatar, 
                    // CONDITIONAL SPACING FOR ENGLISH/FRENCH
                    !isRTL && { marginRight: wp(5) },
                    isRTL && { marginLeft: wp(5), marginRight: 0 }
                ]} 
            />
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, isRTL && { textAlign: 'right' }]}>{t('greeting')}, <Text style={styles.userName}>{username}</Text></Text>
            </View>
            <TouchableOpacity style={styles.calendarIconButton} onPress={() => setCalendarModalVisible(true)}><Feather name="calendar" size={normalize(18)} color="#6F42C1" /></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.testNotificationBtn} onPress={handleTestTrigger}>
            <Feather name="alert-circle" size={normalize(16)} color="#6F42C1" />
            <Text style={styles.testNotificationText}>Simulate Child Alert</Text>
          </TouchableOpacity>

          <View style={[styles.activityStatsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#EC4899', '#DB2777']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}><Feather name="users" size={normalize(16)} color="#FFFFFF" /></View>
                <Text style={styles.statCardValue}>{currentActivity?.attendance || 0}</Text>
                <Text style={styles.statCardLabel}>{t('attendance')}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#A855F7', '#9333EA']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}><Feather name="check-circle" size={normalize(16)} color="#FFFFFF" /></View>
                <Text style={styles.statCardValue}>{currentActivity?.tasks || 0}</Text>
                <Text style={styles.statCardLabel}>{t('completed')}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.statCardGradient}>
                <View style={styles.statIconCircle}><Feather name="trending-up" size={normalize(16)} color="#FFFFFF" /></View>
                <Text style={styles.statCardValue}>{currentActivity?.performance || 0}%</Text>
                <Text style={styles.statCardLabel}>{t('performance')}</Text>
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

      <Modal visible={calendarModalVisible} transparent={true} animationType="fade" onRequestClose={() => setCalendarModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCalendarModalVisible(false)}>
          <View style={styles.calendarModalContent}>
            <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={styles.popupGradient}>
              <TouchableOpacity style={[styles.modalCloseButton, isRTL && { left: wp(4), right: 'auto' }]} onPress={() => setCalendarModalVisible(false)}>
                <Feather name="x" size={normalize(24)} color="#fff" />
              </TouchableOpacity>
              <View style={[styles.modalMonthNavigation, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity onPress={isRTL ? nextMonth : previousMonth}><Feather name={isRTL ? "chevron-right" : "chevron-left"} size={normalize(22)} color="#fff" /></TouchableOpacity>
                <Text style={styles.modalMonthText}>{getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}</Text>
                <TouchableOpacity onPress={isRTL ? previousMonth : nextMonth}><Feather name={isRTL ? "chevron-left" : "chevron-right"} size={normalize(22)} color="#fff" /></TouchableOpacity>
              </View>
              <View style={[styles.modalDayHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => <Text key={`header-${idx}`} style={styles.modalDayHeader}>{getDayName(idx)}</Text>)}
              </View>
              <View style={styles.modalDaysGrid}>
                {days.map((day, index) => (
                  <TouchableOpacity key={day ? day.toISOString() : `empty-${index}`} onPress={() => day && setSelectedDate(day)} style={[styles.modalDayCell, isSameDay(day, selectedDate) && styles.modalDayCellActive]}>
                    <View style={[isSameDay(day, selectedDate) ? styles.selectedCircle : styles.normalCircle, isToday(day) && !isSameDay(day, selectedDate) && styles.todayCircle]}>
                      <Text style={[isSameDay(day, selectedDate) ? styles.selectedDateText : styles.normalDateText]}>{day ? day.getDate() : ""}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.scrollableBottomSection}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          <Text style={[styles.childrenTitle, isRTL && { textAlign: 'right' }]}>{t('childrenDetails')}</Text>
          
          {children.map((child) => (
            <View key={child.id}> 
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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  fixedTopSection: { position: "absolute", top: 0, left: 0, right: 0, height: TOP_SECTION_HEIGHT, zIndex: 1 },
  safeArea: { height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight },
  profileSection: { flexDirection: "row", alignItems: "center", paddingHorizontal: wp(5), marginTop: hp(0.7), marginBottom: hp(1.5) },
  profileAvatar: { width: wp(13), height: wp(13), borderRadius: wp(6.5), borderWidth: normalize(3), borderColor: "white" },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: normalize(20), color: "#FFFFFF" },
  userName: { color: "#FFD700", fontWeight: "700" },
  calendarIconButton: { width: wp(9.5), height: wp(9.5), backgroundColor: "#FFD700", borderRadius: normalize(12), justifyContent: "center", alignItems: "center" },
  testNotificationBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFD700', paddingVertical: hp(1), paddingHorizontal: wp(4), borderRadius: normalize(20), marginBottom: hp(1.5), gap: wp(1.5) },
  testNotificationText: { fontSize: normalize(12), fontWeight: '700', color: '#6F42C1' },
  activityStatsRow: { flexDirection: "row", paddingHorizontal: wp(5), gap: wp(2.2), marginBottom: hp(2) },
  statCard: { flex: 1, borderRadius: normalize(16), overflow: "hidden", minHeight: hp(16) },
  statCardGradient: { flex: 1, paddingVertical: hp(1.5), paddingHorizontal: wp(2), alignItems: "center" },
  statIconCircle: { width: wp(8.5), height: wp(8.5), borderRadius: wp(4.25), backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  statCardValue: { fontSize: normalize(22), fontWeight: "700", color: "#FFFFFF" },
  statCardLabel: { fontSize: normalize(11), fontWeight: "600", color: "rgba(255, 255, 255, 0.9)", textAlign: "center" },
  incompleteBadge: { marginTop: hp(0.7), backgroundColor: "rgba(0, 0, 0, 0.15)", paddingVertical: hp(0.5), paddingHorizontal: wp(1.5), borderRadius: normalize(8) },
  incompleteText: { fontSize: normalize(9), color: "rgba(255, 255, 255, 0.95)", fontWeight: "900", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  calendarModalContent: { width: wp(80), borderRadius: normalize(20), overflow: "hidden" },
  popupGradient: { padding: wp(4), paddingBottom: hp(2) },
  modalCloseButton: { position: "absolute", top: hp(1.5), right: wp(3), zIndex: 10 },
  modalMonthNavigation: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: hp(1) },
  modalMonthText: { fontSize: normalize(14), fontWeight: "700", color: "#fff" },
  modalDayHeaderRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp(1) },
  modalDayHeader: { width: (wp(80) - wp(8)) / 7, textAlign: "center", fontSize: normalize(10), color: "rgba(255,255,255,0.7)" },
  modalDaysGrid: { flexDirection: "row", flexWrap: "wrap" },
  modalDayCell: { width: (wp(80) - wp(8)) / 7, height: normalize(34), alignItems: "center", justifyContent: "center" },
  selectedCircle: { width: normalize(28), height: normalize(28), borderRadius: normalize(8), backgroundColor: "#FFD700", justifyContent: "center", alignItems: "center" },
  normalCircle: { width: normalize(28), height: normalize(28), justifyContent: "center", alignItems: "center" },
  todayCircle: { borderWidth: 1.5, borderColor: "#fff" },
  selectedDateText: { color: "#6F42C1", fontWeight: "bold" },
  normalDateText: { color: "#fff" },
  scrollableBottomSection: { position: "absolute", top: TOP_SECTION_HEIGHT, left: 0, right: 0, bottom: 0, backgroundColor: "#ffffff", borderTopLeftRadius: normalize(38), borderTopRightRadius: normalize(38) },
  bottomScroll: { paddingHorizontal: wp(4), paddingTop: hp(4), paddingBottom: hp(12.5) },
  bottomNavContainer: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 },
  childrenTitle: { fontSize: normalize(20), fontWeight: "700", marginBottom: hp(1.5), color: "#1a1a2e" },
  childCardWrapper: { width: "100%", borderRadius: normalize(20), position: "relative", marginBottom: hp(2) },
  avatarContainer: { position: "absolute", top: hp(2), zIndex: 2 },
  avatarBorder: { width: wp(16), height: wp(16), borderRadius: wp(8), borderWidth: normalize(4), backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" },
  childAvatar: { width: "100%", height: "100%", borderRadius: wp(7) },
  avatarSpacer: { width: wp(14), height: wp(14) },
  childCard: { borderRadius: normalize(20), padding: wp(4.5) },
  childHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: hp(2) },
  childName: { fontSize: normalize(18), fontWeight: "700", color: "#ffffff" },
  childInfo: { fontSize: normalize(13), color: "rgba(255,255,255,0.9)" },
  statusText: { fontSize: normalize(13), fontWeight: "600", color: "#ffffff" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: hp(1.5), borderTopWidth: normalize(1), borderTopColor: "rgba(255,255,255,0.3)" },
  statItem: { flexDirection: "row", alignItems: "center" },
  statText: { fontSize: normalize(13), fontWeight: "600", color: "#ffffff" },
});