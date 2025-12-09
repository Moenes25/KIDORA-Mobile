import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Heights
const COLLAPSED_HEIGHT = screenHeight * 0.45; 
const EXPANDED_HEIGHT = screenHeight * 0.75; 

export default function CalendarScreen({ navigation }) {
  const { colors } = useTheme();

  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleDates, setVisibleDates] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);

  // --- CALENDAR LOGIC ---
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (isExpanded) {
      generateMonth();
    } else {
      generateWeek();
    }
  }, [currentDate, isExpanded]);

  const generateWeek = () => {
    const dates = [];
    const curr = new Date(selectedDate); 
    const day = curr.getDay(); 
    const start = new Date(curr);
    start.setDate(curr.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push({ date: d, isCurrentMonth: true });
    }
    setVisibleDates(dates);
  };

  const generateMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push({ date: null, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    setVisibleDates(dates);
  };

  const toggleCalendar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
        setCurrentDate(new Date(selectedDate));
    }
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const onDatePress = (dateObj) => {
    if (!dateObj.date) return;
    setSelectedDate(dateObj.date);
  };

  const isSameDay = (d1, d2) => {
    if(!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const getFormattedFullDate = (date) => {
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
    return `${dayName}, ${monthNames[date.getMonth()].substring(0, 3)} ${date.getDate()}`;
  };

  // --- MOCK DATA ---
  const children = [
    { id: 1, name: "Ahmed", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Sara", image: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Omar", image: "https://i.pravatar.cc/150?img=3" },
  ];
  const hasMultipleChildren = children.length > 1;

  const events = [
    { time: "10:00 AM", title: "Literature", subtitle: "Introduction to the course", icon: "book-open", color: "#FF6B9D", timeColor: "#FF6B9D", childId: 1, childImage: "https://i.pravatar.cc/150?img=1", childName: "Ahmed" },
    { time: "11:00 AM", title: "Math", subtitle: "Logarithms and derivatives", icon: "trending-up", color: "#FFC75F", timeColor: "#FFC75F", childId: 2, childImage: "https://i.pravatar.cc/150?img=5", childName: "Sara" },
    { time: "12:00 PM", title: "Spare Time", subtitle: "Break time for relaxation", icon: "coffee", color: "#FF9671", timeColor: "#FF9671", childId: 2, childImage: "https://i.pravatar.cc/150?img=5", childName: "Sara" },
    { time: "01:00 PM", title: "Design", subtitle: "UI/UX Lecture", icon: "pen-tool", color: "#845EC2", timeColor: "#845EC2", childId: 3, childImage: "https://i.pravatar.cc/150?img=3", childName: "Omar" },
  ];

  const filteredEvents = selectedChildId ? events.filter(event => event.childId === selectedChildId) : events;

  // Render Helpers
  const currentHeight = isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />

      {/* --- PURPLE TOP SECTION --- */}
      <View style={[styles.fixedTopSection, { height: currentHeight }]}>
        <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={StyleSheet.absoluteFill}>
          
          {/* REMOVED: decoCircle1 and decoCircle2 (The unwanted circles) */}
          
          <View style={styles.safeArea} />
          
          <TopNavBar title="Calendar" navigation={navigation} transparent={true} />

          <View style={styles.calendarHeader}>
            {/* Month Picker */}
            <View style={styles.monthPicker}>
              <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(-1)}>
                <Feather name="chevron-left" size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.monthLabelContainer}>
                <Text style={styles.monthText}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
              </View>

              <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(1)}>
                <Feather name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Week Days */}
            <View style={styles.weekDays}>
              {dayNames.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            {/* Date Grid */}
            <View style={styles.dateGridContainer}>
                {visibleDates.map((item, index) => {
                    if (!item.date) return <View key={`empty-${index}`} style={styles.dateCell} />;
                    const isSelected = isSameDay(item.date, selectedDate);
                    
                    return (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.dateCell, isSelected && styles.dateCellActive]}
                        activeOpacity={0.7}
                        onPress={() => onDatePress(item)}
                    >
                        <View style={isSelected ? styles.selectedCircle : styles.normalCircle}>
                            <Text style={isSelected ? styles.selectedDateText : styles.normalDateText}>
                                {item.date.getDate()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    );
                })}
            </View>
          </View>
          
          {/* Toggle Button */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={toggleCalendar} style={styles.toggleButton}>
                <Feather 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color="rgba(255,255,255,0.9)" 
                />
            </TouchableOpacity>
          </View>

        </LinearGradient>
      </View>

      {/* --- WHITE BOTTOM SECTION --- */}
      <View style={[styles.whiteSection, { top: currentHeight - 25 }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.eventHeader}>
            <Text style={styles.eventCount}>{filteredEvents.length} tasks • {filteredEvents.length} lessons</Text>
            <Text style={styles.eventDate}>{getFormattedFullDate(selectedDate)}</Text>
          </View>

          {/* Filters */}
          {hasMultipleChildren && (
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Filter by Child:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
                <TouchableOpacity style={[styles.filterChip, selectedChildId === null && styles.filterChipActive]} onPress={() => setSelectedChildId(null)}>
                  <Text style={[styles.filterChipText, selectedChildId === null && styles.filterChipTextActive]}>All</Text>
                </TouchableOpacity>
                {children.map((child) => (
                  <TouchableOpacity key={child.id} style={[styles.filterChip, selectedChildId === child.id && styles.filterChipActive]} onPress={() => setSelectedChildId(child.id)}>
                    <Image source={{ uri: child.image }} style={styles.filterChildImage} />
                    <Text style={[styles.filterChipText, selectedChildId === child.id && styles.filterChipTextActive]}>{child.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Event Cards */}
          {filteredEvents.map((event, i) => (
            <TouchableOpacity key={i} style={styles.eventCardWrapper} activeOpacity={0.9}>
              <View style={styles.eventCard}>
                <LinearGradient colors={[event.color, event.color + 'DD']} style={styles.eventGradientBar} />
                <View style={styles.eventContent}>
                  <View style={styles.topRow}>
                    <View style={styles.timeRow}>
                      <View style={[styles.timeContainer, { backgroundColor: "#6F42C11A" }]}>
                        <Text style={[styles.time, { color: "#6F42C1" }]}>{event.time}</Text>
                      </View>
                      <Feather name="chevron-right" size={22} color="#6F42C1" />
                    </View>
                    {event.childImage && <View style={styles.childImageContainer}><Image source={{ uri: event.childImage }} style={styles.childImage} /></View>}
                  </View>
                  <View style={[styles.iconCircle, { backgroundColor: event.color }]}><Feather name={event.icon} size={24} color="#FFFFFF" /></View>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.subtitle}>{event.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
  safeArea: { height: Platform.OS === "android" ? StatusBar.currentHeight : 44 },
  
  // REMOVED: decoCircle1 and decoCircle2 styles
  
  calendarHeader: { paddingHorizontal: 20, paddingTop: 10 },
  monthPicker: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  monthLabelContainer: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  monthText: { fontSize: 18, fontWeight: "700", color: "#fff", letterSpacing: 0.5 },
  navIcon: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  
  weekDays: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  weekDayText: { width: (screenWidth - 40) / 7, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "600", textTransform: "uppercase" },
  
  dateGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dateCell: {
    width: (screenWidth - 40) / 7,
    height: 50,
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 5,
  },
  dateCellActive: { transform: [{translateY: -2}] },
  
  selectedCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: "#FFD700", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  normalCircle: { 
    width: 40, 
    height: 40, 
    justifyContent: "center", 
    alignItems: "center",
  },
  selectedDateText: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#6F42C1", 
  },
  normalDateText: { 
    fontSize: 16, 
    color: "rgba(255,255,255,0.9)", 
    fontWeight: "500",
  },

  toggleContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5, 
  },
  toggleButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
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
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 10 
  },
  scrollContent: { paddingTop: 32, paddingHorizontal: 20, paddingBottom: 120 },
  eventHeader: { marginBottom: 20 },
  eventCount: { fontSize: 15, color: "#888888", marginBottom: 6 },
  eventDate: { fontSize: 26, fontWeight: "700", color: "#1a1a2e" },
  
  filterSection: { marginBottom: 24 },
  filterTitle: { fontSize: 14, fontWeight: "600", color: "#666666", marginBottom: 12 },
  filterScroll: { marginHorizontal: -20 },
  filterContent: { paddingHorizontal: 20, gap: 10 },
  filterChip: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "#F5F5F5", borderRadius: 20, marginRight: 10 },
  filterChipActive: { backgroundColor: "#6F42C1" },
  filterChipText: { fontSize: 14, fontWeight: "600", color: "#666666" },
  filterChipTextActive: { color: "#FFFFFF" },
  filterChildImage: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  
  eventCardWrapper: { marginBottom: 18, borderRadius: 24, overflow: "hidden", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  eventCard: { backgroundColor: "#ffffff", borderRadius: 24 },
  eventGradientBar: { height: 6, width: "100%" },
  eventContent: { padding: 22 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeContainer: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  time: { fontSize: 14, fontWeight: "700" },
  childImageContainer: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 4 },
  childImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: "#FFD700" },
  iconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700", color: "#1a1a2e", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#666666" },
});