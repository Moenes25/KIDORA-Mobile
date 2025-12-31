import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp, screenHeight } from "../utils/responsive";
import BottomNav from "../components/BottomNav";

// 1. Dynamic Data Import helper
import { getReportByChildId } from "../data/MockDailyReports";

const TOP_SECTION_HEIGHT = screenHeight * 0.35;

export default function ChildDetailScreen({ route, navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";
  const childParams = route.params?.child || {};

  // 2. Integration: Fetch the specific child's full report data
  const fullReport = getReportByChildId(childParams.id) || {};

  // Helper to determine status colors dynamically based on presence and mood
  const getStatusStyle = (type, value) => {
    const lowerValue = value?.toLowerCase();
    
    // Attendance Colors (Green if present, Red if anything else)
    if (type === 'attendance') {
      const isPresent = lowerValue === "present";
      return {
        bg: isPresent ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
        border: isPresent ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)',
        icon: isPresent ? "check" : "x",
        iconColor: isPresent ? "#10b981" : "#ef4444" // Specific icon color
      };
    }

    // Mood Colors (Green if happy/excited, Red if sad, Orange if neutral/tired)
    if (type === 'mood') {
      switch (lowerValue) {
        case "happy":
        case "excited":
          return { 
            bg: 'rgba(16, 185, 129, 0.35)', 
            border: 'rgba(16, 185, 129, 0.6)', 
            icon: "happy-outline",
            iconColor: "#10b981" 
          };
        case "sad":
          return { 
            bg: 'rgba(239, 68, 68, 0.35)', 
            border: 'rgba(239, 68, 68, 0.6)', 
            icon: "sad-outline",
            iconColor: "#ef4444" 
          };
        case "neutral":
        case "tired":
          return { 
            bg: 'rgba(245, 158, 11, 0.35)', 
            border: 'rgba(245, 158, 11, 0.6)', 
            icon: "meh-outline",
            iconColor: "#f59e0b" 
          };
        default:
          return { 
            bg: 'rgba(107, 114, 128, 0.35)', 
            border: 'rgba(107, 114, 128, 0.6)', 
            icon: "help-circle-outline",
            iconColor: "#6b7280" 
          };
      }
    }
  };

  const moodStyle = getStatusStyle('mood', fullReport.mood);
  const attendanceStyle = getStatusStyle('attendance', fullReport.attendance);

  // Remaining Mock Data
  const weekAttendance = 5;
  const healthInfo = { allergies: "Peanuts", medicalNotes: "Asthma, needs inhaler" };
  const skills = { language: 40, motor: 70, cognition: 60, social: 90 };
  const meals = {
    breakfast: "Oatmeal, banana, milk",
    lunch: "Grilled chicken, rice, veggies",
    snacks: "Yogurt, apple slices",
  };

  const activities = [
    { id: 1, icon: "book-open", title: "Reading Time", time: "09:00 - 09:30", description: "Story reading session" },
    { id: 2, icon: "activity", title: "Physical Activity", time: "10:00 - 10:30", description: "Outdoor games and exercises" },
    { id: 3, icon: "music", title: "Music Class", time: "11:00 - 11:30", description: "Learning songs and rhythms" },
  ];

  const todaysTasks = [
    { id: 1, title: "Math Homework", description: "Complete exercises 5–10 on page 32." },
    { id: 2, title: "Reading Assignment", description: "Read chapter 3 of 'The Magic Tree House'." },
    { id: 3, title: "Drawing Activity", description: "Draw your favorite animal for art class." },
  ];

  const getProgressColor = (percent) =>
    percent <= 40 ? "#e74c3c" : percent <= 75 ? "#f1c40f" : "#2ecc71";

  const getTaskIcon = (title) => {
    const tl = title.toLowerCase();
    if (tl.includes("math")) return "hash";
    if (tl.includes("reading")) return "book";
    if (tl.includes("drawing") || tl.includes("art")) return "edit-3";
    return "check-circle";
  };

  const getCategoryColor = (category) => {
    const catColors = {
      mood: "#10b981",
      meal: "#f59e0b",
      suggestion: "#6366f1",
      activity: "#8b5cf6",
      social: "#ec4899",
      achievement: "#10b981",
      hygiene: "#06b6d4",
      rest: "#a855f7",
    };
    return catColors[category] || "#6b7280";
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0f0a1f" : "#f5f5f5" }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? "#0f0a1f" : "#6f42c1"} />

      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient
          colors={isDark ? colors.bgGradient : ["#6F42C1", "#8e44ad"]}
          style={StyleSheet.absoluteFill}
        >
          {isDark && (
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
          )}
          <View style={styles.safeArea} />

          <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={normalize(24)} color="#fff" />
            </TouchableOpacity>
           
            <Image
              source={childParams.avatar || require("../assets/child1.png")}
              style={[styles.childAvatar, isRTL && { marginRight: wp(2), marginLeft: 0 }]}
            />
           
            <View style={[styles.childInfoHeader, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.childName, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {childParams.name || "Child Name"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {t('age')}: {childParams.age || 6} | {t('grade')}: {childParams.grade || "1st"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {t('educator')}: {childParams.educator || t('notAssigned')}
              </Text>
            </View>
          </View>

          {/* Status Bubbles with Dynamic Presence and Mood Styling */}
          <View style={[styles.statusContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.statusItem}>
              <View style={[styles.statusCircleBase, { backgroundColor: moodStyle.bg, borderColor: moodStyle.border }]}>
                <Ionicons name={moodStyle.icon} size={normalize(22)} color={moodStyle.iconColor} />
              </View>
              <Text style={[styles.statusLabel, { color: moodStyle.iconColor }]} allowFontScaling={false}>
                {t(fullReport.mood?.toLowerCase() || 'neutral')}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <View style={[styles.statusCircleBase, { backgroundColor: attendanceStyle.bg, borderColor: attendanceStyle.border }]}>
                <Feather name={attendanceStyle.icon} size={normalize(20)} color={attendanceStyle.iconColor} />
              </View>
              <Text style={[styles.statusLabel, { color: attendanceStyle.iconColor }]} allowFontScaling={false}>
                {fullReport.attendance?.toLowerCase() === "present" ? t('present') : t('absent')}
              </Text>
            </View>
          </View>
          <View style={{ height: hp(1) }} />
        </LinearGradient>
      </View>

      <View style={[
        styles.whiteSection,
        {
          top: TOP_SECTION_HEIGHT,
          backgroundColor: isDark ? "#000000" : "#ffffff",
        }
      ]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('dailyAttendance')}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('thisWeek')}: {weekAttendance} {t('outOf')} 5 {t('days')}
            </Text>
            <View style={{ height: hp(0.8), backgroundColor: isDark ? '#333' : '#eee', borderRadius: normalize(3), marginTop: hp(1.2) }}>
              <View style={{ width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: normalize(3) }} />
            </View>
          </View>

          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('todaysActivities')}
            </Text>
            {activities.map((act) => (
              <View key={act.id} style={[styles.activityRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[
                  styles.iconCircle,
                  { backgroundColor: isDark ? "rgba(183, 148, 244, 0.2)" : "#f3e8ff" }
                ]}>
                  <Feather name={act.icon} size={normalize(18)} color={isDark ? "#B794F4" : "#6f42c1"} />
                </View>
                <View style={[{ flex: 1, marginLeft: wp(3) }, isRTL && { marginLeft: 0, marginRight: wp(3) }]}>
                  <Text style={[styles.activityTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {act.title}
                  </Text>
                  <Text style={[styles.activityTime, { color: isDark ? "#B794F4" : "#888", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {act.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.card, styles.shadowProp(isDark), styles.reportCard]}>
            <View style={[styles.reportHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.reportIconContainer, isRTL && { marginRight: 0, marginLeft: wp(3) }]}>
                <Feather name="file-text" size={normalize(20)} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { marginBottom: 0, color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {t('dailyReportSummary')}
                </Text>
                <Text style={[styles.reportDate, { color: isDark ? "#B794F4" : "#6f42c1", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {fullReport.date}
                </Text>
              </View>
            </View>

            <View style={styles.reportEntries}>
              {fullReport.reportLines?.map((entry, index) => (
                <View key={index} style={[
                  styles.reportEntry,
                  { borderLeftColor: getCategoryColor(entry.category) },
                  isRTL && { 
                    flexDirection: 'row-reverse', 
                    borderLeftWidth: 0, 
                    borderRightWidth: normalize(3), 
                    borderRightColor: getCategoryColor(entry.category) 
                  }
                ]}>
                  <Text style={[styles.reportEmoji, isRTL && { marginLeft: wp(3), marginRight: 0 }]}>{entry.emoji}</Text>
                  <Text style={[styles.reportText, { color: isDark ? "#cccccc" : "#374151", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {entry.tKey ? t(entry.tKey) : entry.text}
                  </Text>
                </View>
              ))}
            </View>

            {fullReport.educatorNote && (
              <View style={[
                styles.educatorNoteBox,
                { backgroundColor: isDark ? "rgba(99, 102, 241, 0.15)" : "#eff6ff" }
              ]}>
                <View style={[styles.noteHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Feather 
                    name="message-circle" 
                    size={normalize(16)} 
                    color={isDark ? "#B794F4" : "#6366f1"} 
                    style={isRTL ? { marginLeft: wp(2) } : { marginRight: wp(2) }}
                  />
                  <Text style={[styles.noteHeaderText, { color: isDark ? "#B794F4" : "#6366f1", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {t('educatorNoteTitle')}
                  </Text>
                </View>
                <Text style={[styles.educatorNoteText, { color: isDark ? "#cccccc" : "#475569", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {fullReport.educatorNote}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('todaysTasks')}
            </Text>
            {todaysTasks.map((task) => (
              <View key={task.id} style={[
                styles.taskItem,
                { borderBottomColor: isDark ? "#333" : "#f0f0f0" },
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Feather name={getTaskIcon(task.title)} size={normalize(18)} color={isDark ? "#B794F4" : "#6f42c1"} />
                <View style={[{ marginLeft: wp(3.5), flex: 1 }, isRTL && { marginLeft: 0, marginRight: wp(3.5) }]}>
                  <Text style={[styles.taskTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {task.title}
                  </Text>
                  <Text style={[styles.taskDesc, { color: isDark ? "#aaaaaa" : "#666", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                    {task.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('skillsDevelopment')}
            </Text>
            {Object.entries(skills).map(([skill, value]) => (
              <View key={skill} style={{ marginVertical: hp(1.5) }}>
                <Text style={[styles.skillLabel, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {t(skill)}: {value}%
                </Text>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#333" : "#e5e7eb" }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${value}%`, backgroundColor: getProgressColor(value) },
                      isRTL && { alignSelf: 'flex-end' }
                    ]}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.improveButton, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => navigation.navigate("ImprovementsScreen", { child: childParams })}
            >
              <Feather 
                name="bar-chart-2" 
                size={normalize(16)} 
                color="#fff" 
                style={isRTL ? { marginLeft: wp(2) } : { marginRight: wp(2) }} 
              />
              <Text style={styles.improveButtonText} allowFontScaling={false}>
                {t('checkChildImprovements')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('mealsToday')}
            </Text>
            {Object.entries(meals).map(([meal, desc]) => (
              <View key={meal} style={[
                styles.mealItem,
                { borderBottomColor: isDark ? "#333" : "#f0f0f0" }
              ]}>
                <Text style={[styles.mealType, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {t(meal)}
                </Text>
                <Text style={[styles.mealDesc, { color: isDark ? "#aaaaaa" : "#666", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
                  {desc}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('healthInformation')}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('allergies')}: {healthInfo.allergies}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", marginTop: hp(1), textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('medicalNotes')}: {healthInfo.medicalNotes}
            </Text>
          </View>

          <View style={{ height: hp(15) }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        <BottomNav navigation={navigation} activeScreen="people" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderEndEndRadius: normalize(38),
    borderBottomStartRadius: normalize(38),
  },
  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : hp(5.5),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
  },
  backButton: { padding: wp(2) },
  childAvatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: normalize(4),
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: wp(2),
  },
  childInfoHeader: { marginLeft: wp(4), marginRight: wp(4), flex: 1 },
  childName: { fontSize: normalize(18), fontWeight: "700", color: "#fff" },
  childInfoText: { fontSize: normalize(12), color: "rgba(255,255,255,0.9)", marginTop: hp(0.3) },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(3),
    paddingBottom: hp(1),
  },
  statusItem: { alignItems: "center" },
  statusCircleBase: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    borderWidth: normalize(1),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  statusLabel: { fontSize: normalize(12), fontWeight: "600" }, // Color dynamically set in view
  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -hp(0.6) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(12),
    elevation: 12,
  },
  scrollContent: { paddingTop: hp(4), paddingHorizontal: wp(5), paddingBottom: hp(2.5) },
  card: { borderRadius: normalize(24), padding: wp(5.5), marginBottom: hp(2.2) },
  shadowProp: (isDark) => ({
    backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
    shadowColor: isDark ? "#2d1b69" : "#000",
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowOffset: { width: 0, height: hp(0.7) },
    shadowRadius: normalize(16),
    elevation: 6,
  }),
  cardTitle: { fontSize: normalize(16), fontWeight: "700", marginBottom: hp(2) },
  cardText: { fontSize: normalize(13), lineHeight: normalize(20) },
  reportCard: { borderLeftWidth: normalize(4), borderLeftColor: "#6f42c1" },
  reportHeader: { flexDirection: "row", alignItems: "center", marginBottom: hp(2) },
  reportIconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#6f42c1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  reportDate: { fontSize: normalize(12), marginTop: hp(0.5), fontWeight: "500" },
  reportEntries: { marginTop: hp(1) },
  reportEntry: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: hp(1.2),
    paddingLeft: wp(3),
    marginBottom: hp(1),
    borderLeftWidth: normalize(3),
    backgroundColor: "rgba(241, 245, 249, 0.5)",
    borderRadius: normalize(8),
  },
  reportEmoji: { fontSize: normalize(18), marginRight: wp(3), marginTop: hp(0.2) },
  reportText: { flex: 1, fontSize: normalize(13), lineHeight: normalize(20) },
  educatorNoteBox: { marginTop: hp(2), padding: wp(4), borderRadius: normalize(12), borderLeftWidth: normalize(3), borderLeftColor: "#6366f1" },
  noteHeader: { flexDirection: "row", alignItems: "center", marginBottom: hp(1) },
  noteHeaderText: { fontSize: normalize(13), fontWeight: "700" },
  educatorNoteText: { fontSize: normalize(13), lineHeight: normalize(20), fontStyle: "italic" },
  activityRow: { flexDirection: "row", alignItems: "center", marginVertical: hp(1.2) },
  iconCircle: { width: wp(12), height: wp(12), borderRadius: wp(6), justifyContent: "center", alignItems: "center" },
  activityTitle: { fontSize: normalize(14), fontWeight: "600" },
  activityTime: { fontSize: normalize(12), marginTop: hp(0.5) },
  taskItem: { flexDirection: "row", alignItems: "center", paddingVertical: hp(2), borderBottomWidth: normalize(1) },
  taskTitle: { fontSize: normalize(14), fontWeight: "600" },
  taskDesc: { fontSize: normalize(12), marginTop: hp(0.5) },
  skillLabel: { fontSize: normalize(13), fontWeight: "600" },
  progressBg: { height: hp(1.2), borderRadius: normalize(5), overflow: "hidden", marginTop: hp(1) },
  progressFill: { height: "100%", borderRadius: normalize(5) },
  improveButton: {
    marginTop: hp(2.2),
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
    borderRadius: normalize(10),
    backgroundColor: "#9575CD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  improveButtonText: { color: "#fff", fontSize: normalize(13), fontWeight: "600" },
  mealItem: { paddingVertical: hp(1.7), borderBottomWidth: normalize(1) },
  mealType: { fontSize: normalize(14), fontWeight: "600" },
  mealDesc: { fontSize: normalize(12), marginTop: hp(0.5) },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 },
});