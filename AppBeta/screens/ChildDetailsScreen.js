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
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import BottomNav from "../components/BottomNav";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.40;

export default function ChildDetailScreen({ route, navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const child = route.params?.child;

  // Sample data
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

  const getMoodIcon = () =>
    child.mood === "good" ? "smile" : child.mood === "neutral" ? "meh" : "frown";

  const getTaskIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("math")) return "hash";
    if (t.includes("reading")) return "book";
    if (t.includes("drawing") || t.includes("art")) return "edit-3";
    return "check-circle";
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#0f0a1f" : "#f5f5f5" }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? "#0f0a1f" : "#6f42c1"} />

      {/* FIXED TOP SECTION - Gradient */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={isDark ? colors.bgGradient : colors.headerGradient} style={StyleSheet.absoluteFill}>
          {isDark && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }} />
          )}
          
          <View style={styles.safeArea} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <Image source={child.avatar} style={styles.childAvatar} />
            <View style={styles.childInfoHeader}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childInfoText}>Age: {child.age} | Grade: {child.grade}</Text>
              <Text style={styles.childInfoText}>Educator: {child.educator || "Not assigned"}</Text>
            </View>
          </View>

          {/* Mood + Attendance */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Feather name={getMoodIcon()} size={34} color="#fff" />
              <Text style={styles.summaryLabel}>Mood</Text>
            </View>
            <View style={styles.summaryItem}>
              <Feather
                name="calendar"
                size={34}
                color={child.present ? "#4CAF50" : "#F44336"}
              />
              <Text style={styles.summaryLabel}>{child.present ? "Present" : "Absent"}</Text>
            </View>
          </View>
          
          {/* Spacer for rounded section */}
          <View style={{ height: 30 }} />
        </LinearGradient>
      </View>

      {/* WHITE/DARK BOTTOM SECTION with rounded top */}
      <View style={[
        styles.whiteSection, 
        { 
          top: TOP_SECTION_HEIGHT,
          backgroundColor: isDark ? "#000000" : "#ffffff",
        }
      ]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Attendance Card */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Daily Attendance</Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555" }]}>
              This week: {weekAttendance} out of 5 days
            </Text>
          </View>

          {/* Today's Activities */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Today's Activities</Text>
            {activities.map((act) => (
              <View key={act.id} style={styles.activityRow}>
                <View style={[
                  styles.iconCircle, 
                  { backgroundColor: isDark ? "rgba(183, 148, 244, 0.2)" : "#f3e8ff" }
                ]}>
                  <Feather name={act.icon} size={22} color={isDark ? "#B794F4" : "#6f42c1"} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.activityTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>
                    {act.title}
                  </Text>
                  <Text style={[styles.activityTime, { color: isDark ? "#B794F4" : "#888" }]}>
                    {act.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Today's Tasks */}
          {todaysTasks.length > 0 && (
            <View style={[styles.card, { 
              backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
              shadowColor: isDark ? "#2d1b69" : "#000",
              shadowOpacity: isDark ? 0.4 : 0.08,
            }]}>
              <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Today's Tasks</Text>
              {todaysTasks.map((task) => (
                <View key={task.id} style={[
                  styles.taskItem,
                  { borderBottomColor: isDark ? "#333" : "#f0f0f0" }
                ]}>
                  <Feather name={getTaskIcon(task.title)} size={22} color={isDark ? "#B794F4" : "#6f42c1"} />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={[styles.taskTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.taskDesc, { color: isDark ? "#aaaaaa" : "#666" }]}>
                      {task.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Skills Development */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Skills Development</Text>
            {Object.entries(skills).map(([skill, value]) => (
              <View key={skill} style={{ marginVertical: 12 }}>
                <Text style={[styles.skillLabel, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}: {value}%
                </Text>
                <View style={[styles.progressBg, { backgroundColor: isDark ? "#333" : "#e5e7eb" }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${value}%`, backgroundColor: getProgressColor(value) },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Meals Today */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Meals Today</Text>
            {Object.entries(meals).map(([meal, desc]) => (
              <View key={meal} style={[
                styles.mealItem,
                { borderBottomColor: isDark ? "#333" : "#f0f0f0" }
              ]}>
                <Text style={[styles.mealType, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </Text>
                <Text style={[styles.mealDesc, { color: isDark ? "#aaaaaa" : "#666" }]}>
                  {desc}
                </Text>
              </View>
            ))}
          </View>

          {/* Health Information */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Health Information</Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555" }]}>
              Allergies: {healthInfo.allergies}
            </Text>
            <Text style={[styles.cardText, { color: isDark ? "#cccccc" : "#555", marginTop: 8 }]}>
              Medical Notes: {healthInfo.medicalNotes}
            </Text>
          </View>

          {/* Educator's Comment */}
          <View style={[styles.card, { 
            backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
            shadowColor: isDark ? "#2d1b69" : "#000",
            shadowOpacity: isDark ? 0.4 : 0.08,
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#1a1a2e" }]}>Educator's Comment</Text>
            <Text style={[styles.comment, { color: isDark ? "#cccccc" : "#555" }]}>
              {comments}
            </Text>
          </View>

          <View style={{ height: 100 }} />
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
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: { padding: 8 },
  childAvatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: 8,
  },
  childInfoHeader: { marginLeft: 16, flex: 1 },
  childName: { fontSize: 22, fontWeight: "700", color: "#fff" },
  childInfoText: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 2 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
  },
  summaryItem: { alignItems: "center" },
  summaryLabel: { color: "#fff", marginTop: 10, fontSize: 15, fontWeight: "600" },

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
    paddingBottom: 120,
  },

  card: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 12,
  },
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