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
    language: 80,
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
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
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
    flexDirection: "row",
    alignItems: "center",
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
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#5a2e84",
    borderRadius: 5,
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
});
