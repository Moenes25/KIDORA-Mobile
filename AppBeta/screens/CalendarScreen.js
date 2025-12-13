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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

export default function CalendarScreenV1({ navigation }) {
  const { colors } = useTheme();

  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [visibleDates, setVisibleDates] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // --- CALENDAR LOGIC ---
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateMonth();
  }, [currentDate]);

  const generateMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push({ date: null, isCurrentMonth: false });
    }
    
    // Add current month's dates
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    setVisibleDates(dates);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const onPopupDatePress = (dateObj) => {
    if (!dateObj.date) return;
    setSelectedDate(dateObj.date);
    setCurrentDate(new Date(dateObj.date));
    setShowCalendarPopup(false);
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

  // --- FIXED COMPACT HEIGHT ---
  const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight : 44;
  const TOP_NAV = 80;
  const PADDING = 30;
  const FIXED_HEIGHT = STATUS_BAR + TOP_NAV + PADDING;

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />

      {/* --- CALENDAR POPUP MODAL --- */}
      <Modal
        visible={showCalendarPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarPopup(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowCalendarPopup(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={styles.popupGradient}>
              
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowCalendarPopup(false)}
              >
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>

              {/* Month Picker */}
              <View style={styles.popupMonthPicker}>
                <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(-1)}>
                  <Feather name="chevron-left" size={22} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.monthLabelContainer}>
                  <Text style={styles.monthText}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Text>
                </View>

                <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(1)}>
                  <Feather name="chevron-right" size={22} color="#fff" />
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
                  const isToday = isSameDay(item.date, new Date());
                  
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.dateCell, isSelected && styles.dateCellActive]}
                      activeOpacity={0.7}
                      onPress={() => onPopupDatePress(item)}
                    >
                      <View style={[
                        isSelected ? styles.selectedCircle : styles.normalCircle,
                        isToday && !isSelected && styles.todayCircle
                      ]}>
                        <Text style={[
                          isSelected ? styles.selectedDateText : styles.normalDateText,
                          isToday && !isSelected && styles.todayDateText
                        ]}>
                          {item.date.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- COMPACT PURPLE TOP SECTION --- */}
      <View style={[styles.fixedTopSection, { height: FIXED_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          <TopNavBar title="Calendar" navigation={navigation} transparent={true} />
        </LinearGradient>
      </View>

      {/* --- WHITE BOTTOM SECTION --- */}
      <View style={[styles.whiteSection, { top: FIXED_HEIGHT - 30 }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.eventHeader}>
            <View style={styles.eventHeaderRow}>
              <View>
                <Text style={styles.eventCount}>{filteredEvents.length} tasks • {filteredEvents.length} lessons</Text>
                <Text style={styles.eventDate}>{getFormattedFullDate(selectedDate)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.calendarIconButton}
                onPress={() => setShowCalendarPopup(true)}
              >
                <Feather name="calendar" size={24} color="#6F42C1" />
              </TouchableOpacity>
            </View>
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
                      <View style={[styles.timeContainer, { backgroundColor: event.color + '20' }]}>
                        <Text style={[styles.time, { color: event.color }]}>{event.time}</Text>
                      </View>
                      <Feather name="chevron-right" size={20} color={event.color} />
                    </View>
                    {event.childImage && <View style={styles.childImageContainer}><Image source={{ uri: event.childImage }} style={styles.childImage} /></View>}
                  </View>
                  <View style={[styles.iconCircle, { backgroundColor: event.color }]}><Feather name={event.icon} size={22} color="#FFFFFF" /></View>
                  <Text style={styles.title}>{event.title}</Text>
                  <Text style={styles.subtitle}>{event.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 250 }} />
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
    borderBottomEndRadius: 35,
    borderBottomStartRadius: 35,
  },
  safeArea: { height: Platform.OS === "android" ? StatusBar.currentHeight : 44 },

  whiteSection: { 
    position: "absolute", 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: "#ffffff", 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    overflow: "hidden", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: -5 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 12, 
    elevation: 12,
  },
  scrollContent: { paddingTop: 28, paddingHorizontal: 18, paddingBottom: 120 },
  eventHeader: { marginBottom: 20 },
  eventHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  eventCount: { fontSize: 14, color: "#999999", marginBottom: 6, fontWeight: "500" },
  eventDate: { fontSize: 24, fontWeight: "700", color: "#1a1a2e", letterSpacing: 0.3 },
  calendarIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  filterSection: { marginBottom: 22 },
  filterTitle: { fontSize: 14, fontWeight: "700", color: "#555555", marginBottom: 12 },
  filterScroll: { marginHorizontal: -18 },
  filterContent: { paddingHorizontal: 18, gap: 10 },
  filterChip: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    backgroundColor: "#F0F0F0", 
    borderRadius: 20, 
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  filterChipActive: { 
    backgroundColor: "#6F42C1",
    borderColor: "#6F42C1",
  },
  filterChipText: { fontSize: 14, fontWeight: "600", color: "#666666" },
  filterChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  filterChildImage: { width: 26, height: 26, borderRadius: 13, marginRight: 8, borderWidth: 1.5, borderColor: "#fff" },
  
  eventCardWrapper: { 
    marginBottom: 16, 
    borderRadius: 22, 
    overflow: "hidden", 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 6,
  },
  eventCard: { backgroundColor: "#ffffff", borderRadius: 22 },
  eventGradientBar: { height: 5, width: "100%" },
  eventContent: { padding: 20 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeContainer: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  time: { fontSize: 13, fontWeight: "700" },
  childImageContainer: { 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    elevation: 4,
    borderRadius: 25,
  },
  childImage: { width: 46, height: 46, borderRadius: 23, borderWidth: 2.5, borderColor: "white" },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 19, fontWeight: "700", color: "#1a1a2e", marginBottom: 5, letterSpacing: 0.2 },
  subtitle: { fontSize: 14, color: "#777777", fontWeight: "500" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  popupGradient: {
    padding: 20,
    paddingBottom: 30,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
  popupMonthPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  monthLabelContainer: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: { fontSize: 17, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  navIcon: { 
    padding: 10, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weekDays: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingHorizontal: 2 },
  weekDayText: { 
    width: (screenWidth - 40) / 7, 
    textAlign: "center", 
    fontSize: 13, 
    color: "rgba(255,255,255,0.85)", 
    fontWeight: "700", 
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 2,
  },
  dateCell: {
    width: (screenWidth - 40) / 7,
    height: 48,
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 4,
  },
  dateCellActive: { 
    transform: [{scale: 1.05}],
  },
  selectedCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: "#FFD700", 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  normalCircle: { 
    width: 40, 
    height: 40, 
    justifyContent: "center", 
    alignItems: "center",
    borderRadius: 12,
  },
  todayCircle: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  selectedDateText: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: "#6F42C1", 
  },
  normalDateText: { 
    fontSize: 16, 
    color: "rgba(255,255,255,0.95)", 
    fontWeight: "600",
  },
  todayDateText: {
    color: "#fff",
    fontWeight: "800",
  },
});