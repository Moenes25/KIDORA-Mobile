import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import BottomNav from "../components/BottomNav";

export default function ChildDetailScreen({ route, navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  
  const child = route.params?.child;

  const weekAttendance = 5;

  const healthInfo = {
    allergies: "Peanuts",
    medicalNotes: "Asthma, needs inhaler",
  };

  const skills = {
    language: 40,
    motor: 70,
    cognition: 60,
    social: 90,
  };

  const meals = {
    breakfast: "Oatmeal, banana, milk",
    lunch: "Grilled chicken, rice, veggies",
    snacks: "Yogurt, apple slices",
  };

  const comments =
    "Charlie is progressing well in language and social skills. Needs more support in motor activities.";

  const activities = [
    {
      id: 1,
      icon: "book-open",
      title: "Reading Time",
      time: "09:00 - 09:30",
      description: "Story reading session with educator",
    },
    {
      id: 2,
      icon: "activity",
      title: "Physical Activity",
      time: "10:00 - 10:30",
      description: "Outdoor games and exercises",
    },
    {
      id: 3,
      icon: "music",
      title: "Music Class",
      time: "11:00 - 11:30",
      description: "Learning songs and rhythms",
    },
  ];

  const getProgressColor = (percent) => {
    if (percent <= 40) return "#e74c3c"; // red
    if (percent <= 75) return "#f1c40f"; // yellow
    return "#2ecc71"; // green
  };

  const getMoodColor = (mood) => {
    if (mood === "good") return "#2ecc71";    // green
    if (mood === "neutral") return "#f1c40f"; // yellow
    return "#e74c3c";                         // red
  };

  const getMoodIcon = (mood) => {
    if (mood === "good") return "smile";
    if (mood === "neutral") return "meh";
    return "frown";
  };

  const todaysTasks = [
    {
      id: 1,
      title: "Math Homework",
      description: "Complete exercises 5–10 on page 32.",
    },
    {
      id: 2,
      title: "Reading Assignment",
      description: "Read chapter 3 of 'The Magic Tree House'.",
    },
    {
      id: 3,
      title: "Drawing Activity",
      description: "Draw your favorite animal for the art class.",
    },
  ];

  const getTaskIcon = (title) => {
    const t = title.toLowerCase();

    if (t.includes("math") || t.includes("numbers") || t.includes("count"))
      return "hash";
    if (t.includes("reading") || t.includes("read") || t.includes("story"))
      return "book";
    if (t.includes("writing") || t.includes("write") || t.includes("essay"))
      return "edit";
    if (t.includes("drawing") || t.includes("draw") || t.includes("art"))
      return "edit-3";
    if (t.includes("science") || t.includes("experiment"))
      return "cpu";
    if (t.includes("music") || t.includes("song") || t.includes("rhythm"))
      return "music";
    if (t.includes("physical") || t.includes("exercise") || t.includes("sport"))
      return "activity";
    if (t.includes("homework") || t.includes("assignment"))
      return "check-circle";
    if (t.includes("clean") || t.includes("classroom duty"))
      return "clipboard";
    if (t.includes("language") || t.includes("vocabulary") || t.includes("words"))
      return "type";
    if (t.includes("project"))
      return "folder";
    if (t.includes("presentation"))
      return "monitor";
    if (t.includes("group") || t.includes("team"))
      return "users";
    if (t.includes("home") || t.includes("parent"))
      return "home";
    if (t.includes("test") || t.includes("quiz") || t.includes("exam"))
      return "file-text";

    return "check";
  };

  const shadowColor = isDark ? "#2d1b69" : "#000";

  return (
    <View style={styles.container}>
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
          backgroundColor: "white" 
        }} 
      />
      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header - Dark with opacity in dark theme */}
          {isDark ? (
            <View 
              style={[
                styles.header,
                {
                  backgroundColor: colors.cardHeavy,
                  shadowColor: shadowColor,
                  shadowOpacity: 0.4,
                }
              ]}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={28} color="white" />
              </TouchableOpacity>
              <Image source={child.avatar} style={[styles.childAvatar, { marginLeft: 15 }]} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childInfo}>Age: {child.age} | Grade: {child.grade}</Text>
                <Text style={styles.childInfo}>Educator: {child.educator || "Not assigned"}</Text>
              </View>
            </View>
          ) : (
            <LinearGradient 
              colors={colors.headerGradient} 
              style={[
                styles.header,
                {
                  shadowColor: shadowColor,
                  shadowOpacity: 0.15,
                }
              ]}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={28} color="white" />
              </TouchableOpacity>
              <Image source={child.avatar} style={[styles.childAvatar, { marginLeft: 15 }]} />
              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childInfo}>Age: {child.age} | Grade: {child.grade}</Text>
                <Text style={styles.childInfo}>Educator: {child.educator || "Not assigned"}</Text>
              </View>
            </LinearGradient>
          )}

          {/* Daily Attendance Card */}
          <View style={[
            styles.card, 
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="calendar" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Daily Attendance</Text>
              </View>
            </View>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Today: <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{child.presence ? "Present ✅" : "Absent ❌"}</Text>
            </Text>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              This week: <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{weekAttendance} / 5 days</Text>
            </Text>
          </View>

          {/* Mood Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="heart" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Today's Mood</Text>
              </View>
            </View>

            <View style={styles.moodRow}>
              <View style={[styles.moodIconCircle, { backgroundColor: getMoodColor(child.mood) }]}>
                <Feather name={getMoodIcon(child.mood)} size={24} color="white" />
              </View>
              <Text style={[styles.moodText, { color: colors.text }]}>
                {child.moodDescription || "No mood description available"}
              </Text>
            </View>
          </View>

          {/* Today's Activities Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="clipboard" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Today's Activities</Text>
              </View>
            </View>
            {activities.map((act) => (
              <View key={act.id} style={[styles.activityCard, { backgroundColor: isDark ? colors.cardLight : "#f5f5f5" }]}>
                <View style={[styles.activityIconCircle, { backgroundColor: isDark ? "#7c3aed" : colors.primary }]}>
                  <Feather name={act.icon} size={22} color="white" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>{act.title}</Text>
                  <Text style={[styles.activityTime, { color: isDark ? "#FF4081" : "#b53389" }]}>{act.time}</Text>
                  <Text style={[styles.activityDesc, { color: colors.textSecondary }]}>{act.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Today's Tasks Card */}
          <View style={[
            styles.task_card,
            { 
              backgroundColor: isDark ? colors.cardMedium : "#F2dbe7",
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="check-circle" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Today's Tasks</Text>
              </View>
            </View>

            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <View 
                  key={task.id} 
                  style={[
                    styles.taskItem,
                    { 
                      backgroundColor: isDark ? colors.cardLight : "#f8f5ff",
                      borderLeftColor: isDark ? "#7c3aed" : colors.primary,
                    }
                  ]}
                >
                  <View style={[styles.taskIconCircle, { backgroundColor: isDark ? "#7c3aed" : colors.primary }]}>
                    <Feather name={getTaskIcon(task.title)} size={20} color="white" />
                  </View>

                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={[styles.taskTitle, { color: isDark ? "#FF4081" : "#b53389" }]}>{task.title}</Text>
                    <Text style={[styles.taskDesc, { color: colors.textSecondary }]}>{task.description}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.infoLabel, { color: colors.text }]}>No assigned tasks for today.</Text>
            )}
          </View>

          {/* Health Information Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="heart" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Health Information</Text>
              </View>
            </View>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Allergies: <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{healthInfo.allergies}</Text>
            </Text>
            <Text style={[styles.infoLabel, { color: colors.text }]}>
              Medical Notes: <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{healthInfo.medicalNotes}</Text>
            </Text>
          </View>

          {/* Skills Development Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="trending-up" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Skills Development</Text>
              </View>
            </View>
            {Object.entries(skills).map(([skill, percent]) => (
              <View key={skill} style={{ marginTop: 8 }}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}:
                  <Text style={[styles.infoValue, { color: colors.textSecondary }]}> {percent}%</Text>
                </Text>

                <View style={[styles.progressBackground, { backgroundColor: isDark ? colors.cardLight : "#ddd" }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percent}%`, backgroundColor: getProgressColor(percent) },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Meals Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="coffee" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Meals</Text>
              </View>
            </View>

            {["breakfast", "lunch", "snacks"].map((meal) => (
              <View key={meal} style={[styles.mealCard, { backgroundColor: isDark ? colors.cardLight : "#f5f5f5" }]}>
                <View style={[styles.mealIconCircle, { backgroundColor: isDark ? "#7c3aed" : colors.primary }]}>
                  <Feather
                    name={meal === "breakfast" ? "sunrise" : meal === "lunch" ? "sun" : "star"}
                    size={20}
                    color="white"
                  />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={[styles.mealTitle, { color: colors.text }]}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
                  <Text style={[styles.mealDesc, { color: colors.textSecondary }]}>{meals[meal]}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Educator Comments Card */}
          <View style={[
            styles.card,
            { 
              backgroundColor: isDark ? colors.cardMedium : colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.1,
            }
          ]}>
            <View style={styles.cardHeader}>
              <Feather name="message-circle" size={24} color={isDark ? "#e0d4ff" : colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.cardLight : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: isDark ? "#e0d4ff" : colors.primary }]}>Educator's Comments</Text>
              </View>
            </View>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{comments}</Text>
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} activeScreen="people" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },

  childAvatar: { width: 80, height: 80, borderRadius: 40 },
  childName: { fontSize: 20, fontWeight: "700", color: "white" },
  childInfo: { fontSize: 14, color: "white" },

  card: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },

  task_card: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  cardTitleBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "500",
  },

  progressBackground: {
    width: "100%",
    height: 10,
    borderRadius: 10,
    marginTop: 4,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  activityCard: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },

  activityTitle: { fontSize: 15, fontWeight: "700" },
  activityTime: { fontSize: 13 },
  activityDesc: { fontSize: 13 },

  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  mealCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },

  mealIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  mealTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  mealDesc: {
    fontSize: 13,
  },

  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  moodIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  moodText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    flexWrap: "wrap",
  },

  taskIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  taskDesc: {
    fontSize: 14,
    marginTop: 4,
  },
});