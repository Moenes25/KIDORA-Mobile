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
import { normalize, wp, hp, screenHeight } from "../utils/responsive";

// 1. IMPORT YOUR MOCK DATA
import mockDailyReports from "../data/MockDailyReports";

const childrenGif = require("../assets/children.gif");
const TOP_SECTION_HEIGHT_RATIO = 0.28;

// 2. AVATAR MAPPING (Consistent with other screens)
const childAvatars = {
  "child-001": require("../assets/child1.png"),
  "child-002": require("../assets/child3.png"),
  "child-003": require("../assets/child2.png"),
  "child-004": require("../assets/child1.png"),
};

export default function ChildrenListScreen({ navigation, route }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { sendChildAlert, unreadCount } = useNotifications();

  const user = route?.params?.user || {};
  const username = user?.name || "User";
  const email = user?.email || "";

  // 3. MAP MOCK DATA TO LOCAL CHILDREN ARRAY
  const children = mockDailyReports.map(report => ({
    id: report.childId,
    name: report.name,
    age: report.age,
    // Calculate grade based on age or use a default
    grade: report.age === 4 ? t('Kindergarten') : `${report.age - 5}st Grade`,
    presence: report.attendance === "Present",
    // Simulating tasks for UI variety
    completedTasks: report.mood === "Happy" ? 9 : report.mood === "Neutral" ? 6 : 4,
    totalTasks: 10,
    performance: report.mood === "Happy" ? 92 : report.mood === "Neutral" ? 72 : 45,
    avatar: childAvatars[report.childId],
  }));

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const toggleNotificationPanel = () => setNotificationPanelVisible(!notificationPanelVisible);

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
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ]
    );
  };

  const getPerformanceColors = (performance) => {
    if (performance >= 75) return { gradient: ["#6FCF97", "#27AE60"], border: "#27AE60" };
    if (performance >= 45) return { gradient: ["#F2C94C", "#F2994A"], border: "#F2994A" };
    return { gradient: ["#EB5757", "#E53935"], border: "#E53935" };
  };

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
          colors={colors.headerGradient || ["#6F42C1", "#9b59b6"]} 
          style={[StyleSheet.absoluteFill, { borderBottomEndRadius: normalize(38), borderBottomStartRadius: normalize(38), overflow: 'hidden' }]}
        >
          <View style={styles.safeArea} />
          
          <TopBar
            onMenuPress={toggleSidebar}
            notificationCount={unreadCount}
            onNotificationPress={toggleNotificationPanel}
          />

          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
              {t('myChildren')}
            </Text>
            <Image source={childrenGif} style={styles.gif} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.scrollableBottomSection}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {children.map((child) => {
            const { gradient, border } = getPerformanceColors(child.performance);
            
            return (
              <TouchableOpacity
                key={child.id}
                style={styles.childCardWrapper}
                onPress={() => navigation.navigate("ChildDetailScreen", { 
                    child: {
                        id: child.id,
                        name: child.name,
                        age: child.age,
                        avatar: child.avatar,
                        grade: child.grade
                    } 
                })}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.avatarContainer,
                  isRTL ? { right: -wp(2) } : { left: -wp(2) }
                ]}>
                  <View style={[styles.avatarBorder, { borderColor: border }]}>
                    <Image
                      source={child.avatar}
                      style={styles.childAvatar}
                    />
                  </View>
                </View>

                <LinearGradient colors={gradient} style={styles.childCard}>
                  <View style={[styles.childHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.avatarSpacer} />
                    
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.childName, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                        {child.name}
                      </Text>
                      <Text style={[styles.childInfo, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                        {t('age')}: {child.age} | {t('grade')}: {child.grade} | {child.presence ? t('present') : t('absent')}
                      </Text>
                      <View style={[{ flexDirection: "row", alignItems: "center", marginTop: hp(0.8) }, isRTL && { flexDirection: 'row-reverse' }]}>
                        <Feather 
                          name="clipboard" 
                          size={normalize(16)} 
                          color="white" 
                          style={isRTL ? { marginLeft: wp(1.5) } : { marginRight: wp(1.5) }} 
                        />
                        <Text style={styles.taskText} allowFontScaling={false}>{t('tasks')}:</Text>
                        <View style={styles.taskBarBackground}>
                          <View
                            style={[
                              styles.taskBarProgress,
                              { width: `${(child.completedTasks / child.totalTasks) * 100}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.taskNumber} allowFontScaling={false}>{child.completedTasks}/{child.totalTasks}</Text>
                      </View>
                      <View style={[{ flexDirection: "row", alignItems: "center", marginTop: hp(0.5) }, isRTL && { flexDirection: 'row-reverse' }]}>
                        <Feather 
                          name="bar-chart-2" 
                          size={normalize(16)} 
                          color="white" 
                          style={isRTL ? { marginLeft: wp(1.5) } : { marginRight: wp(1.5) }} 
                        />
                        <Text style={styles.performanceText} allowFontScaling={false}>
                          {t('performance')}: {child.performance}%
                        </Text>
                      </View>
                    </View>
                    <Ionicons 
                      name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"} 
                      size={normalize(26)} 
                      color="white" 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: hp(2.5) }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
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
    borderBottomEndRadius: normalize(38),
    borderBottomStartRadius: normalize(38),
  },
  safeArea: { height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight },
  headerContent: { alignItems: "center", paddingVertical: hp(1), paddingHorizontal: wp(5) },
  headerTitle: { fontSize: normalize(24), fontWeight: "700", color: "white", marginBottom: hp(0.5) },
  gif: { width: normalize(60), height: normalize(60), resizeMode: "contain" },
  scrollableBottomSection: {
    position: "absolute",
    top: screenHeight * TOP_SECTION_HEIGHT_RATIO,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(8),
    elevation: 8,
  },
  scrollContent: { paddingHorizontal: wp(5), paddingTop: hp(3), paddingBottom: hp(12) },
  childCardWrapper: {
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.4) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(6),
    elevation: 4,
    borderRadius: normalize(20),
    overflow: "visible",
    position: "relative",
  },
  avatarContainer: { position: "absolute", top: hp(1.5), zIndex: 2 },
  avatarBorder: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    borderWidth: normalize(4),
    padding: normalize(2),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  childAvatar: { width: "100%", height: "100%", borderRadius: wp(8) },
  avatarSpacer: { width: wp(17), height: wp(17) },
  childCard: { borderRadius: normalize(20), padding: wp(4), overflow: "hidden" },
  childHeader: { flexDirection: "row", alignItems: "flex-start" },
  childName: { fontSize: normalize(18), fontWeight: "700", marginBottom: hp(0.5), color: "white" },
  childInfo: { fontSize: normalize(14), color: "white" },
  taskText: { fontSize: normalize(14), fontWeight: "600", marginRight: wp(1.5), color: "white" },
  taskBarBackground: {
    flex: 1,
    height: hp(1.2),
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: normalize(5),
    overflow: "hidden",
    marginRight: wp(1.5),
  },
  taskBarProgress: { height: "100%", backgroundColor: "white", borderRadius: normalize(5) },
  taskNumber: { fontSize: normalize(13), fontWeight: "600", color: "white" },
  performanceText: { fontSize: normalize(14), fontWeight: "600", color: "white" },
  bottomNav: { width: "100%", position: "absolute", bottom: 0, zIndex: 10, backgroundColor: "#ffffff" },
});