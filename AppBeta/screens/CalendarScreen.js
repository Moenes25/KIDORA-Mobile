// screens/CalendarScreen.js — DARK THEME WITH CARD OPACITY
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

// Reusable TopNavBar
import TopNavBar from "../components/TopNavBar";

export default function CalendarScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedDate] = useState(new Date(2023, 10, 17));
  const [selectedMonth] = useState("November 2023");

  const events = [
    {
      time: "10:00 AM",
      title: "Literature",
      subtitle: "Introduction to the course",
      color: colors.headerGradient,
    },
    {
      time: "11:00 AM",
      title: "Math",
      subtitle: "Logarithms and their derivatives",
      color: colors.headerGradient,
    },
    {
      time: "01:00 PM",
      title: "Design",
      subtitle: "Lecture",
      color: colors.headerGradient,
    },
  ];

  const shadowColor = isDark ? "#050017ff" : "#000";

  return (
    <View style={styles.container}>
      {/* White Status Bar */}
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
          backgroundColor: "white" 
        }} 
      />

      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
        {/* Perfect reusable header */}
        <TopNavBar title="Calendar" navigation={navigation} />

        {/* Calendar Header - Dark with opacity in dark theme */}
        {isDark ? (
          <View 
            style={[
              styles.calendarHeader,
              {
                backgroundColor: colors.cardHeavy,
                shadowColor: shadowColor,
                shadowOpacity: 0.4,
              }
            ]}
          >
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
                        <Text style={[styles.selectedDateText, { color: colors.primary }]}>{date}</Text>
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
        ) : (
          <LinearGradient 
            colors={colors.headerGradient} 
            style={[
              styles.calendarHeader,
              {
                shadowColor: shadowColor,
                shadowOpacity: 0.15,
              }
            ]}
          >
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
                        <Text style={[styles.selectedDateText, { color: colors.primary }]}>{date}</Text>
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
        )}

        {/* Event List with curved top */}
        <View style={[styles.eventListContainer, { backgroundColor: colors.background }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.eventListContent}
          >
            <View style={styles.eventHeader}>
              <Text style={[styles.eventCount, { color: colors.textSecondary }]}>2 tasks • 4 lessons</Text>
              <Text style={[styles.eventDate, { color: colors.text }]}>
                Wednesday {selectedDate.getDate()}
              </Text>
            </View>

            {events.map((event, index) => (
              <View 
                key={index} 
                style={[
                  styles.eventCardWrapper,
                  {
                    shadowColor: shadowColor,
                    shadowOpacity: isDark ? 0.5 : 0.1,
                  }
                ]}
              >
                {isDark ? (
                  // Dark theme: dark card with opacity, no gradient
                  <View style={[styles.eventCard, { backgroundColor: colors.cardMedium }]}>
                    <View style={styles.eventTimeRow}>
                      <Text style={styles.eventTime}>{event.time}</Text>
                      <Feather name="chevron-right" size={20} color="#fff" opacity={0.7} />
                    </View>

                    <View style={styles.eventIcon}>
                      {event.title === "Literature" && <Feather name="book-open" size={20} color="#fff" />}
                      {event.title === "Math" && <Feather name="calculator" size={20} color="#fff" />}
                      {event.title === "Design" && <Feather name="pen-tool" size={20} color="#fff" />}
                    </View>

                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                  </View>
                ) : (
                  // Light theme: keep original gradient
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
                      {event.title === "Literature" && <Feather name="book-open" size={20} color="#fff" />}
                      {event.title === "Math" && <Feather name="calculator" size={20} color="#fff" />}
                      {event.title === "Design" && <Feather name="pen-tool" size={20} color="#fff" />}
                    </View>

                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                  </LinearGradient>
                )}
              </View>
            ))}

            {/* Spare Time */}
            <View 
              style={[
                styles.spareTimeCard,
                { 
                  backgroundColor: isDark ? colors.cardLight : colors.card,
                  borderColor: isDark ? "rgba(255, 64, 129, 0.3)" : "#FFE5E5",
                  shadowColor: isDark ? "#FF4081" : "#E53935",
                }
              ]}
            >
              <Feather 
                name="coffee" 
                size={18} 
                color={isDark ? "#FF4081" : "#E53935"} 
                style={{ marginBottom: 8 }} 
              />
              <Text style={[styles.spareTimeText, { color: isDark ? "#FF4081" : "#E53935" }]}>
                Spare time: 12:00 – 13:00
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  calendarHeader: {
    marginTop: 5,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
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

  eventListContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -16,
    overflow: "hidden",
  },
  eventListContent: {
    paddingTop: 24,
  },
  eventHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCount: {
    fontSize: 14,
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 24,
    fontWeight: "700",
  },
  eventCardWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
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
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spareTimeText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});