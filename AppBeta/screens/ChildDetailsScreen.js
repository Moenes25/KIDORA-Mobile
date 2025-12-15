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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import BottomNav from "../components/BottomNav";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.35;

export default function ChildDetailScreen({ route, navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";
  const child = route.params?.child || {};

  // Mock Data
  const weekAttendance = 5;
  const healthInfo = { allergies: "Peanuts", medicalNotes: "Asthma, needs inhaler" };
  const skills = { language: 40, motor: 70, cognition: 60, social: 90 };
  const meals = {
    breakfast: "Oatmeal, banana, milk",
    lunch: "Grilled chicken, rice, veggies",
    snacks: "Yogurt, apple slices",
  };
  const comments = "Charlie is progressing well in language and social skills. Needs more support in motor activities.";

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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0f0a1f" : "#f5f5f5" }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? "#0f0a1f" : "#6f42c1"} />

      {/* FIXED TOP SECTION - Purple Gradient */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient
          colors={isDark ? colors.bgGradient : ["#6F42C1", "#8e44ad"]}
          style={StyleSheet.absoluteFill}
        >
          {isDark && (
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
          )}
         
          <View style={styles.safeArea} />

          {/* Header Row */}
          <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={28} color="#fff" />
            </TouchableOpacity>
           
            <Image
              source={child.avatar || require("../assets/child1.png")}
              style={[styles.childAvatar, isRTL && { marginRight: 8, marginLeft: 0 }]}
            />
           
            <View style={[styles.childInfoHeader, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.childName, isRTL && { textAlign: 'right' }]}>
                {child.name || "Child Name"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]}>
                {t('age')}: {child.age || 6} | {t('grade')}: {child.grade || "1st"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]}>
                {t('educator')}: {child.educator || t('notAssigned')}
              </Text>
            </View>
          </View>

          {/* Status Bubbles */}
          <View style={[styles.statusContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Sad Status */}
            <View style={styles.statusItem}>
              <View style={styles.statusCircleRed}>
                <Ionicons name="sad-outline" size={26} color="#fff" />
              </View>
              <Text style={styles.statusLabel}>{t('sad')}</Text>
            </View>

            {/* Absent Status */}
            <View style={styles.statusItem}>
              <View style={styles.statusCircleRed}>
                <Feather name="calendar" size={24} color="#fff" />
                <View style={styles.absentBadge}>
                   <Feather name="x" size={10} color="#c0392b" />
                </View>
              </View>
              <Text style={styles.statusLabel}>{t('absent')}</Text>
            </View>
          </View>
         
          <View style={{ height: 10 }} />
        </LinearGradient>
      </View>

      {/* WHITE/DARK BOTTOM SECTION */}
      <View style={[
        styles.whiteSection,
        {
          top: TOP_SECTION_HEIGHT,
          backgroundColor: isDark ? "#000000" : "#ffffff",
        }
      ]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
         
          {/* Attendance Card */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('dailyAttendance')}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('thisWeek')}: {weekAttendance} {t('outOf')} 5 {t('days')}
            </Text>
            <View style={{ height: 6, backgroundColor: isDark ? '#333' : '#eee', borderRadius: 3, marginTop: 10 }}>
              <View style={{ width: '100%', height: '100%', backgroundColor: '#e74c3c', borderRadius: 3 }} />
            </View>
          </View>

          {/* Today's Activities */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('todaysActivities')}
            </Text>
            {activities.map((act) => (
              <View key={act.id} style={[styles.activityRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[
                  styles.iconCircle,
                  { backgroundColor: isDark ? "rgba(183, 148, 244, 0.2)" : "#f3e8ff" }
                ]}>
                  <Feather name={act.icon} size={22} color={isDark ? "#B794F4" : "#6f42c1"} />
                </View>
                <View style={[{ flex: 1, marginLeft: 12 }, isRTL && { marginLeft: 0, marginRight: 12 }]}>
                  <Text style={[styles.activityTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
                    {act.title}
                  </Text>
                  <Text style={[styles.activityTime, { color: isDark ? "#B794F4" : "#888", textAlign: isRTL ? 'right' : 'left' }]}>
                    {act.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Today's Tasks */}
          {todaysTasks.length > 0 && (
            <View style={[styles.card, styles.shadowProp(isDark)]}>
              <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
                {t('todaysTasks')}
              </Text>
              {todaysTasks.map((task) => (
                <View key={task.id} style={[
                  styles.taskItem,
                  { borderBottomColor: isDark ? "#333" : "#f0f0f0" },
                  isRTL && { flexDirection: 'row-reverse' }
                ]}>
                  <Feather name={getTaskIcon(task.title)} size={22} color={isDark ? "#B794F4" : "#6f42c1"} />
                  <View style={[{ marginLeft: 14, flex: 1 }, isRTL && { marginLeft: 0, marginRight: 14 }]}>
                    <Text style={[styles.taskTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskDesc, { color: isDark ? "#aaaaaa" : "#666", textAlign: isRTL ? 'right' : 'left' }]}>
                      {task.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Skills Development */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('skillsDevelopment')}
            </Text>
            {Object.entries(skills).map(([skill, value]) => (
              <View key={skill} style={{ marginVertical: 12 }}>
                <Text style={[styles.skillLabel, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
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
              onPress={() => navigation.navigate("ImprovementsScreen", { child })}
            >
              <Feather name="bar-chart-2" size={20} color="#fff" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
              <Text style={styles.improveButtonText}>{t('checkChildImprovements')}</Text>
            </TouchableOpacity>
          </View>

          {/* Meals Today */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('mealsToday')}
            </Text>
            {Object.entries(meals).map(([meal, desc]) => (
              <View key={meal} style={[
                styles.mealItem,
                { borderBottomColor: isDark ? "#333" : "#f0f0f0" }
              ]}>
                <Text style={[styles.mealType, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
                  {t(meal)}
                </Text>
                <Text style={[styles.mealDesc, { color: isDark ? "#aaaaaa" : "#666", textAlign: isRTL ? 'right' : 'left' }]}>
                  {desc}
                </Text>
              </View>
            ))}
          </View>

          {/* Health Information */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('healthInformation')}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('allergies')}: {healthInfo.allergies}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", marginTop: 8, textAlign: isRTL ? 'right' : 'left' }]}>
              {t('medicalNotes')}: {healthInfo.medicalNotes}
            </Text>
          </View>

          {/* Educator's Comment */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]}>
              {t('educatorsComment')}
            </Text>
            <Text style={[styles.comment, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]}>
              {comments}
            </Text>
          </View>

          <View style={{ height: 120 }} />
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
    borderEndEndRadius: 38,
    borderBottomStartRadius: 38,
  },
  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: { padding: 8 },
  childAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: 8,
  },
  childInfoHeader: { marginLeft: 16, marginRight: 16, flex: 1 },
  childName: { fontSize: 22, fontWeight: "700", color: "#fff" },
  childInfoText: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 2 },

  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 25,
    paddingBottom: 10,
  },
  statusItem: {
    alignItems: "center",
  },
  statusCircleRed: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(231, 76, 60, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.6)',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  statusLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  absentBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  shadowProp: (isDark) => ({
    backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
    shadowColor: isDark ? "#2d1b69" : "#000",
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
  }),
  cardTitle: { fontSize: 19, fontWeight: "700", marginBottom: 16 },
  cardText: { fontSize: 15.5, lineHeight: 24 },

  activityRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: { fontSize: 16.5, fontWeight: "600" },
  activityTime: { fontSize: 14, marginTop: 4 },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  taskTitle: { fontSize: 16.5, fontWeight: "600" },
  taskDesc: { fontSize: 14.5, marginTop: 4 },

  skillLabel: { fontSize: 16, fontWeight: "600" },
  progressBg: { height: 10, borderRadius: 5, overflow: "hidden", marginTop: 8 },
  progressFill: { height: "100%", borderRadius: 5 },

  improveButton: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#9575CD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  improveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  mealItem: { paddingVertical: 14, borderBottomWidth: 1 },
  mealType: { fontSize: 16.5, fontWeight: "600" },
  mealDesc: { fontSize: 14.5, marginTop: 4 },

  comment: { fontSize: 15.5, lineHeight: 26, fontStyle: "italic" },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});