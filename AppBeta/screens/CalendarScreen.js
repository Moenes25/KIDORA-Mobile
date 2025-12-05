import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 10, 17)); // Nov 17, 2023
  const [selectedMonth, setSelectedMonth] = useState("November 2023");

  const events = [
    {
      time: "10:00 AM",
      title: "Literature",
      subtitle: "Introduction to the course",
      color: ["#FF9800", "#F57C00"],
    },
    {
      time: "11:00 AM",
      title: "Math",
      subtitle: "Logarithms and their derivatives",
      color: ["#42A5F5", "#1E88E5"],
    },
    {
      time: "01:00 PM",
      title: "Design",
      subtitle: "Lecture",
      color: ["#AB47BC", "#8E24AA"],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={26} color="#6F42C1" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Calendar</Text>

          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      {/* Dark Calendar Header */}
      <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.calendarHeader}>
        <View style={styles.monthPicker}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <Feather name="chevron-down" size={20} color="#fff" />
        </View>

        {/* Weekday Labels */}
        <View style={styles.weekDays}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <Text key={i} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Date Grid */}
        <View style={styles.dateGrid}>
          {[14, 15, 16, 17, 18, 19, 20].map((date, i) => {
            const isSelected = date === 17;
            return (
              <View key={i} style={styles.dateCell}>
                {isSelected ? (
                  <View style={styles.selectedDateCircle}>
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
      </LinearGradient>

      {/* Event List - Now with curved top that overlaps the calendar */}
      <View style={styles.eventListContainer}>
        <ScrollView 
          style={styles.eventList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventListContent}
        >
          <View style={styles.eventHeader}>
            <Text style={styles.eventCount}>2 tasks • 4 lessons</Text>
            <Text style={styles.eventDate}>
              Wednesday {selectedDate.getDate()}
            </Text>
          </View>

          {events.map((event, index) => (
            <View key={index} style={styles.eventCardWrapper}>
              <LinearGradient
                colors={event.color}
                style={styles.eventCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.eventTimeRow}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <Feather name="chevron-right" size={20} color="#fff" opacity={0.7} />
                </View>

                <View style={styles.eventIcon}>
                  {event.title === "Literature" && (
                    <Feather name="book-open" size={20} color="#fff" />
                  )}
                  {event.title === "Math" && (
                    <Feather name="calculator" size={20} color="#fff" />
                  )}
                  {event.title === "Design" && (
                    <Feather name="pen-tool" size={20} color="#fff" />
                  )}
                </View>

                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
              </LinearGradient>
            </View>
          ))}

          {/* Spare Time Note */}
          <View style={styles.spareTimeCard}>
            <Feather name="coffee" size={18} color="#E53935" style={{ marginBottom: 8 }} />
            <Text style={styles.spareTimeText}>
              ☕ Spare time: 12:00 – 13:00
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
    backgroundColor: "#6F42C1",
  },
  safeHeader: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F42C1",
    flex: 1,
    textAlign: "center",
  },

  // Dark Calendar Header
  calendarHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  monthPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  weekDayText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    width: 40,
    textAlign: "center",
  },
  dateGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateCell: {
    width: 40,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDateText: {
    color: "#6F42C1",
    fontWeight: "700",
    fontSize: 16,
  },
  normalDateText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginTop: 4,
  },

  // Events Container with curved top
  eventListContainer: {
    flex: 1,
    backgroundColor: "#fbf7ff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -16,
    overflow: "hidden",
  },
  eventList: {
    flex: 1,
  },
  eventListContent: {
    paddingTop: 8,
  },
  eventHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 24,
  },
  eventCount: {
    fontSize: 14,
    color: "#999",
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c2c2c",
  },
  eventCardWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventCard: {
    borderRadius: 20,
    padding: 18,
    paddingLeft: 20,
  },
  eventTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTime: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
    fontWeight: "500",
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  eventSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  spareTimeCard: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFE5E5",
    borderStyle: "dashed",
    alignItems: "center",
    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spareTimeText: {
    fontSize: 14,
    color: "#E53935",
    textAlign: "center",
    fontWeight: "600",
  },
});