import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

export default function ChildDetailScreen({ route, navigation }) {
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
      return "hash"; // math / counting

    if (t.includes("reading") || t.includes("read") || t.includes("story"))
      return "book"; // reading

    if (t.includes("writing") || t.includes("write") || t.includes("essay"))
      return "edit"; // writing

    if (t.includes("drawing") || t.includes("draw") || t.includes("art"))
      return "edit-3"; // drawing / art

    if (t.includes("science") || t.includes("experiment"))
      return "cpu"; // science

    if (t.includes("music") || t.includes("song") || t.includes("rhythm"))
      return "music"; // music

    if (t.includes("physical") || t.includes("exercise") || t.includes("sport"))
      return "activity"; // physical activity / sport

    if (t.includes("homework") || t.includes("assignment"))
      return "check-circle"; // general homework

    if (t.includes("clean") || t.includes("classroom duty"))
      return "clipboard"; // chores / duties

    if (t.includes("language") || t.includes("vocabulary") || t.includes("words"))
      return "type"; // language

    if (t.includes("project"))
      return "folder"; // projects

    if (t.includes("presentation"))
      return "monitor"; // presentation

    if (t.includes("group") || t.includes("team"))
      return "users"; // group work

    if (t.includes("home") || t.includes("parent"))
      return "home"; // home activity

    if (t.includes("test") || t.includes("quiz") || t.includes("exam"))
      return "file-text"; // tests

    return "check"; // fallback icon for unknown tasks
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Gradient Header with Back Button */}
        <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
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


        {/* Daily Attendance Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="calendar" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Daily Attendance</Text>
            </View>
          </View>
          <Text style={styles.infoLabel}>
            Today: <Text style={styles.infoValue}>{child.presence ? "Present ✅" : "Absent ❌"}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            This week: <Text style={styles.infoValue}>{weekAttendance} / 5 days</Text>
          </Text>
        </View>

        {/* Mood Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="heart" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Today's Mood</Text>
            </View>
          </View>

          <View style={styles.moodRow}>
            <View style={[styles.moodIconCircle, { backgroundColor: getMoodColor(child.mood) }]}>
              <Feather name={getMoodIcon(child.mood)} size={24} color="white" />
            </View>

            <Text style={styles.moodText}>
              {child.moodDescription || "No mood description available"}
            </Text>
          </View>
        </View>

        {/* Today's Activities Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="clipboard" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Today's Activities</Text>
            </View>
          </View>
          {activities.map((act) => (
            <View key={act.id} style={styles.activityCard}>
              <View style={styles.activityIconCircle}>
                <Feather name={act.icon} size={22} color="white" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
                <Text style={styles.activityDesc}>{act.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Today's Tasks Card */}
        <View style={styles.task_card}>
          <View style={styles.cardHeader}>
            <Feather name="check-circle" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Today's Tasks</Text>
            </View>
          </View>

          {todaysTasks.length > 0 ? (
            todaysTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>

                {/* Icon */}
                <View style={styles.taskIconCircle}>
                  <Feather name={getTaskIcon(task.title)} size={20} color="white" />
                </View>

                {/* Text */}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDesc}>{task.description}</Text>
                </View>

              </View>
            ))
          ) : (
            <Text style={styles.infoLabel}>No assigned tasks for today.</Text>
          )}

        </View>


        {/* Health Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="heart" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Health Information</Text>
            </View>
          </View>
          <Text style={styles.infoLabel}>
            Allergies: <Text style={styles.infoValue}>{healthInfo.allergies}</Text>
          </Text>
          <Text style={styles.infoLabel}>
            Medical Notes: <Text style={styles.infoValue}>{healthInfo.medicalNotes}</Text>
          </Text>
        </View>

         {/* Skills Development Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="trending-up" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Skills Development</Text>
            </View>
          </View>
          {Object.entries(skills).map(([skill, percent]) => (
            <View key={skill} style={{ marginTop: 8 }}>
              <Text style={styles.infoLabel}>
                {skill.charAt(0).toUpperCase() + skill.slice(1)}:
                <Text style={styles.infoValue}> {percent}%</Text>
              </Text>

              {/* Progress Bar with dynamic color */}
              <View style={styles.progressBackground}>
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="coffee" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Meals</Text>
            </View>
          </View>

          {["breakfast", "lunch", "snacks"].map((meal) => (
            <View key={meal} style={styles.mealCard}>
              <View style={styles.mealIconCircle}>
                <Feather
                  name={meal === "breakfast" ? "sunrise" : meal === "lunch" ? "sun" : "star"}
                  size={20}
                  color="white"
                />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.mealTitle}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</Text>
                <Text style={styles.mealDesc}>{meals[meal]}</Text>
              </View>
            </View>
          ))}
        </View>


        {/* Educator Comments Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="message-circle" size={24} color="#6F42C1" style={{ marginRight: 8 }} />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Educator's Comments</Text>
            </View>
          </View>
          <Text style={styles.infoValue}>{comments}</Text>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} activeScreen="people" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf7ff",
  },

  header: {
    marginTop:40,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    padding: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 12,
  },

  childAvatar: { width: 80, height: 80, borderRadius: 40 },
  childName: { fontSize: 20, fontWeight: "700", color: "white" },
  childInfo: { fontSize: 14, color: "white" },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  task_card: {
    backgroundColor: "#F2dbe7",
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

  cardTitleBox: {
    backgroundColor: "#f3e8ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F42C1",
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
  },

  progressBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 4,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  activityCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },

  activityTitle: { fontSize: 15, fontWeight: "700", color: "#333" },
  activityTime: { fontSize: 13, color: "#b53389" },
  activityDesc: { fontSize: 13, color: "#555" },

  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5a2e84",
    justifyContent: "center",
    alignItems: "center",
  },

  mealCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },

  mealIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5a2e84",
    justifyContent: "center",
    alignItems: "center",
  },

  mealTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  mealDesc: {
    fontSize: 13,
    color: "#555",
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
  color: "#333",
  flex: 1,
  flexWrap: "wrap",
},

taskIconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#5a2e84",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

taskItem: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f8f5ff",
  padding: 12,
  borderRadius: 15,
  marginBottom: 12,
  borderLeftWidth: 4,
  borderLeftColor: "#5a2e84",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},


taskTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#b53389",
},

taskDesc: {
  fontSize: 14,
  color: "#555",
  marginTop: 4,
},


});
