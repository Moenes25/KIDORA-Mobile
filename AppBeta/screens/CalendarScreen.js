// screens/CalendarScreen.js - Colorful with meaningful colors
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.42;

export default function CalendarScreen({ navigation }) {
  const { colors } = useTheme();

  const selectedMonth = "November 2023";
  const selectedDate = 17;

  const events = [
    { time: "10:00 AM", title: "Literature", subtitle: "Introduction to the course", icon: "book-open", color: "#FF6B9D" },
    { time: "11:00 AM", title: "Math", subtitle: "Logarithms and derivatives", icon: "trending-up", color: "#FFC75F" },
    { time: "01:00 PM", title: "Design", subtitle: "UI/UX Lecture", icon: "pen-tool", color: "#845EC2" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />

      {/* PURPLE GRADIENT TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          <TopNavBar title="Calendar" navigation={navigation} />

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <View style={styles.monthPicker}>
              <Text style={styles.monthText}>{selectedMonth}</Text>
              <Feather name="chevron-down" size={22} color="#fff" />
            </View>

            <View style={styles.weekDays}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <Text key={`day-${index}`} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.dateGrid}>
              {[14, 15, 16, 17, 18, 19, 20].map((date) => {
                const isSelected = date === selectedDate;
                return (
                  <View key={date} style={styles.dateCell}>
                    {isSelected ? (
                      <View style={styles.selectedCircle}>
                        <Text style={styles.selectedDateText}>{date}</Text>
                      </View>
                    ) : (
                      <Text style={styles.normalDateText}>{date}</Text>
                    )}
                    {isSelected && <View style={styles.selectedDot} />}
                  </View>
                );
              })}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View 
        style={[
          styles.whiteSection, 
          { top: TOP_SECTION_HEIGHT }
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Event Header */}
          <View style={styles.eventHeader}>
            <Text style={styles.eventCount}>2 tasks • 4 lessons</Text>
            <Text style={styles.eventDate}>Wednesday, November 17</Text>
          </View>

          {events.map((event, i) => (
            <TouchableOpacity key={i} style={styles.eventCardWrapper} activeOpacity={0.9}>
              <View style={styles.eventCard}>
                <LinearGradient 
                  colors={[event.color, event.color + 'DD']} 
                  style={styles.eventGradientBar}
                />
                <View style={styles.eventContent}>
                  <View style={styles.timeRow}>
                    <Text style={styles.time}>{event.time}</Text>
                    <Feather name="chevron-right" size={22} color={event.color} />
                  </View>
                  <View style={[styles.iconCircle, { backgroundColor: event.color + '20' }]}>
                    <Feather name={event.icon} size={24} color={event.color} />
                  </View>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.subtitle}>{event.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Spare Time Card */}
          <View style={styles.spareCard}>
            <Feather name="coffee" size={20} color="#FF9671" />
            <Text style={styles.spareText}>
              Spare time: 12:00 – 13:00
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
  },

  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },

  calendarHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },

  monthPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weekDayText: {
    width: 44,
    textAlign: "center",
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },

  dateGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateCell: {
    width: 44,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6f42c1",
  },
  normalDateText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginTop: 6,
  },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 14,
  },

  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  eventHeader: {
    marginBottom: 24,
  },
  eventCount: {
    fontSize: 15,
    color: "#888888",
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a2e",
  },

  eventCardWrapper: {
    marginBottom: 18,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },

  eventCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
  },
  eventGradientBar: {
    height: 6,
    width: "100%",
  },
  eventContent: {
    padding: 22,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  time: { fontSize: 14, color: "#666666", fontWeight: "600" },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a2e", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#666666" },

  spareCard: {
    backgroundColor: "#FFF5F5",
    borderWidth: 2,
    borderColor: "#FFE5E5",
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  spareText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#FF9671",
  },
});