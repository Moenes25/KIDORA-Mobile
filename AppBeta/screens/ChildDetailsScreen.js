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
              <Feather name={isRTL ? "chevron-right" : "chevron-left"} size={normalize(24)} color="#fff" />
            </TouchableOpacity>
           
            <Image
              source={child.avatar || require("../assets/child1.png")}
              style={[styles.childAvatar, isRTL && { marginRight: wp(2), marginLeft: 0 }]}
            />
           
            <View style={[styles.childInfoHeader, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.childName, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {child.name || "Child Name"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {t('age')}: {child.age || 6} | {t('grade')}: {child.grade || "1st"}
              </Text>
              <Text style={[styles.childInfoText, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                {t('educator')}: {child.educator || t('notAssigned')}
              </Text>
            </View>
          </View>

          {/* Status Bubbles */}
          <View style={[styles.statusContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Sad Status */}
            <View style={styles.statusItem}>
              <View style={styles.statusCircleRed}>
                <Ionicons name="sad-outline" size={normalize(22)} color="#fff" />
              </View>
              <Text style={styles.statusLabel} allowFontScaling={false}>{t('sad')}</Text>
            </View>

            {/* Absent Status */}
            <View style={styles.statusItem}>
              <View style={styles.statusCircleRed}>
                <Feather name="calendar" size={normalize(20)} color="#fff" />
                <View style={styles.absentBadge}>
                   <Feather name="x" size={normalize(8)} color="#c0392b" />
                </View>
              </View>
              <Text style={styles.statusLabel} allowFontScaling={false}>{t('absent')}</Text>
            </View>
          </View>
         
          <View style={{ height: hp(1) }} />
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
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('dailyAttendance')}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('thisWeek')}: {weekAttendance} {t('outOf')} 5 {t('days')}
            </Text>
            <View style={{ height: hp(0.8), backgroundColor: isDark ? '#333' : '#eee', borderRadius: normalize(3), marginTop: hp(1.2) }}>
              <View style={{ width: '100%', height: '100%', backgroundColor: '#e74c3c', borderRadius: normalize(3) }} />
            </View>
          </View>

          {/* Today's Activities */}
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

          {/* Today's Tasks */}
          {todaysTasks.length > 0 && (
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
          )}

          {/* Skills Development */}
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
              onPress={() => navigation.navigate("ImprovementsScreen", { child })}
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

          {/* Meals Today */}
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

          {/* Health Information */}
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

          {/* Educator's Comment */}
          <View style={[styles.card, styles.shadowProp(isDark)]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {t('educatorsComment')}
            </Text>
            <Text style={[styles.comment, { color: isDark ? "#cccccc" : "#555", textAlign: isRTL ? 'right' : 'left' }]} allowFontScaling={false}>
              {comments}
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
  backButton: { 
    padding: wp(2),
  },
  childAvatar: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: normalize(4),
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: wp(2),
  },
  childInfoHeader: { 
    marginLeft: wp(4), 
    marginRight: wp(4), 
    flex: 1 
  },
  childName: { 
    fontSize: normalize(18), 
    fontWeight: "700", 
    color: "#fff" 
  },
  childInfoText: { 
    fontSize: normalize(12), 
    color: "rgba(255,255,255,0.9)", 
    marginTop: hp(0.3) 
  },

  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(3),
    paddingBottom: hp(1),
  },
  statusItem: {
    alignItems: "center",
  },
  statusCircleRed: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: 'rgba(231, 76, 60, 0.35)',
    borderWidth: normalize(1),
    borderColor: 'rgba(231, 76, 60, 0.6)',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(0.8),
  },
  statusLabel: {
    color: "#fff",
    fontSize: normalize(12),
    fontWeight: "600",
  },
  absentBadge: {
    position: 'absolute',
    bottom: -wp(0.5),
    right: -wp(0.5),
    backgroundColor: '#fff',
    borderRadius: wp(2),
    width: wp(4),
    height: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },

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
  scrollContent: {
    paddingTop: hp(4),
    paddingHorizontal: wp(5),
    paddingBottom: hp(2.5),
  },
  card: {
    borderRadius: normalize(24),
    padding: wp(5.5),
    marginBottom: hp(2.2),
  },
  shadowProp: (isDark) => ({
    backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
    shadowColor: isDark ? "#2d1b69" : "#000",
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowOffset: { width: 0, height: hp(0.7) },
    shadowRadius: normalize(16),
    elevation: 6,
  }),
  cardTitle: { 
    fontSize: normalize(16), 
    fontWeight: "700", 
    marginBottom: hp(2) 
  },
  cardText: { 
    fontSize: normalize(13), 
    lineHeight: normalize(20) 
  },

  activityRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: hp(1.2) 
  },
  iconCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: { 
    fontSize: normalize(14), 
    fontWeight: "600" 
  },
  activityTime: { 
    fontSize: normalize(12), 
    marginTop: hp(0.5) 
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    borderBottomWidth: normalize(1),
  },
  taskTitle: { 
    fontSize: normalize(14), 
    fontWeight: "600" 
  },
  taskDesc: { 
    fontSize: normalize(12), 
    marginTop: hp(0.5) 
  },

  skillLabel: { 
    fontSize: normalize(13), 
    fontWeight: "600" 
  },
  progressBg: { 
    height: hp(1.2), 
    borderRadius: normalize(5), 
    overflow: "hidden", 
    marginTop: hp(1) 
  },
  progressFill: { 
    height: "100%", 
    borderRadius: normalize(5) 
  },

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
  improveButtonText: {
    color: "#fff",
    fontSize: normalize(13),
    fontWeight: "600",
  },

  mealItem: { 
    paddingVertical: hp(1.7), 
    borderBottomWidth: normalize(1) 
  },
  mealType: { 
    fontSize: normalize(14), 
    fontWeight: "600" 
  },
  mealDesc: { 
    fontSize: normalize(12), 
    marginTop: hp(0.5) 
  },

  comment: { 
    fontSize: normalize(13), 
    lineHeight: normalize(22), 
    fontStyle: "italic" 
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});