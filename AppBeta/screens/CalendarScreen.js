import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";
import { normalize, wp, hp, screenWidth } from "../utils/responsive";

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
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  useEffect(() => {
    generateMonth();
  }, [currentDate]);

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

  // --- POPUP DIMENSIONS ---
  const POPUP_WIDTH = wp(80);
  const POPUP_CELL_SIZE = (POPUP_WIDTH - wp(10)) / 7;

  // --- RESPONSIVE COMPACT HEIGHT ---
  const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight : 44;
  const TOP_NAV = hp(10);
  const PADDING = hp(3);
  const FIXED_HEIGHT = STATUS_BAR + TOP_NAV + PADDING;

  // --- MOCK DATA ---
  const children = [
    { id: 1, name: "Ahmed", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Sara", image: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Omar", image: "https://i.pravatar.cc/150?img=3" },
  ];
  const hasMultipleChildren = children.length > 1;

  const events = [
    { 
      time: "8 am", 
      endTime: "10 am",
      title: "Paint session", 
      subtitle: "Sara is very active and always have the answer", 
      icon: "droplet", 
      color: "#6F42C1", 
      childId: 2, 
      childImage: "https://i.pravatar.cc/150?img=5", 
      childName: "Sara",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400"
    },
    { 
      time: "10 am", 
      endTime: "12 am",
      title: "Sport session", 
      subtitle: "Sara is very active and always have the answer", 
      icon: "activity", 
      color: "#FF6B6B", 
      childId: 2, 
      childImage: "https://i.pravatar.cc/150?img=5", 
      childName: "Sara",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=400"
    },
    { 
      time: "2 pm", 
      endTime: "4 pm",
      title: "Math session", 
      subtitle: "Logarithms and derivatives", 
      icon: "trending-up", 
      color: "#FFA500", 
      childId: 1, 
      childImage: "https://i.pravatar.cc/150?img=1", 
      childName: "Ahmed",
      hasImage: true,
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"
    },
  ];

  const filteredEvents = selectedChildId ? events.filter(event => event.childId === selectedChildId) : events;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />

      {/* --- COMPACT CALENDAR POPUP MODAL --- */}
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
          <View style={[styles.modalContent, { width: POPUP_WIDTH }]} onStartShouldSetResponder={() => true}>
            <LinearGradient colors={colors.headerGradient || ["#6f42c1", "#8e44ad"]} style={styles.popupGradient}>
              
              <View style={styles.popupMonthPicker}>
                <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(-1)}>
                  <Feather name="chevron-left" size={normalize(18)} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.monthLabelContainer}>
                  <Text style={styles.monthText} allowFontScaling={false}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Text>
                </View>

                <TouchableOpacity style={styles.navIcon} onPress={() => changeMonth(1)}>
                  <Feather name="chevron-right" size={normalize(18)} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {dayNames.map((day, index) => (
                  <Text key={index} style={[styles.weekDayText, { width: POPUP_CELL_SIZE }]} allowFontScaling={false}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.dateGridContainer}>
                {visibleDates.map((item, index) => {
                  if (!item.date) return <View key={`empty-${index}`} style={[styles.dateCell, { width: POPUP_CELL_SIZE }]} />;
                  const isSelected = isSameDay(item.date, selectedDate);
                  const isToday = isSameDay(item.date, new Date());
                  
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.dateCell, { width: POPUP_CELL_SIZE }]}
                      activeOpacity={0.7}
                      onPress={() => onPopupDatePress(item)}
                    >
                      <View style={[
                        isSelected ? styles.selectedCircle : styles.normalCircle,
                        isToday && !isSelected && styles.todayCircle
                      ]}>
                        <Text 
                          style={[
                            isSelected ? styles.selectedDateText : styles.normalDateText,
                            isToday && !isSelected && styles.todayDateText
                          ]}
                          allowFontScaling={false}
                        >
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
      <View style={[styles.whiteSection, { top: FIXED_HEIGHT - hp(3) }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.eventHeader}>
            <View style={styles.eventHeaderRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.eventCount} allowFontScaling={false}>
                  {filteredEvents.length} activities today
                </Text>
                <Text style={styles.eventDate} allowFontScaling={false}>
                  {getFormattedFullDate(selectedDate)}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.calendarIconButton}
                onPress={() => setShowCalendarPopup(true)}
              >
                <Feather name="calendar" size={normalize(20)} color="#6F42C1" />
              </TouchableOpacity>
            </View>

            {/* Compact Inline Mini Calendar Header */}
            <View style={styles.miniCalendar}>
                <View style={styles.miniCalendarHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.miniNavButton}>
                    <Feather name="chevron-left" size={normalize(12)} color="#6F42C1" />
                </TouchableOpacity>
                <Text style={styles.miniMonthText} allowFontScaling={false}>
                    {monthNames[currentDate.getMonth()].substring(0, 3)}, {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.miniNavButton}>
                    <Feather name="chevron-right" size={normalize(12)} color="#6F42C1" />
                </TouchableOpacity>
                </View>
                <View style={styles.miniDatesRow}>
                {visibleDates.filter(d => d.date).slice(0, 10).map((item, index) => {
                    const isSelected = isSameDay(item.date, selectedDate);
                    return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => { setSelectedDate(item.date); setCurrentDate(new Date(item.date)); }}
                        style={[styles.miniDateCell, isSelected && styles.miniDateCellSelected]}
                    >
                        <Text 
                          style={[styles.miniDateText, isSelected && styles.miniDateTextSelected]}
                          allowFontScaling={false}
                        >
                          {item.date.getDate()}
                        </Text>
                    </TouchableOpacity>
                    );
                })}
                </View>
            </View>
          </View>

          {/* Filters */}
          {hasMultipleChildren && (
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle} allowFontScaling={false}>Filter by child:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
                <TouchableOpacity style={[styles.filterChip, selectedChildId === null && styles.filterChipActive]} onPress={() => setSelectedChildId(null)}>
                  <Text style={[styles.filterChipText, selectedChildId === null && styles.filterChipTextActive]} allowFontScaling={false}>
                    All
                  </Text>
                </TouchableOpacity>
                {children.map((child) => (
                  <TouchableOpacity key={child.id} style={[styles.filterChip, selectedChildId === child.id && styles.filterChipActive]} onPress={() => setSelectedChildId(child.id)}>
                    <Image source={{ uri: child.image }} style={styles.filterChildImage} />
                    <Text style={[styles.filterChipText, selectedChildId === child.id && styles.filterChipTextActive]} allowFontScaling={false}>
                      {child.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Timeline Container */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine}>
              <LinearGradient colors={['#FFD700', '#FFC700', '#FFD700']} style={styles.timelineGradient} />
            </View>

            {filteredEvents.map((event, i) => (
              <View key={i} style={styles.timelineEventWrapper}>
                <View style={styles.timelineBadgeContainer}>
                  <View style={styles.timelineBadge}>
                    <Text style={styles.timelineBadgeText} allowFontScaling={false}>
                      {event.time}
                    </Text>
                  </View>
                  <View style={styles.timelineDot} />
                </View>

                <TouchableOpacity style={styles.eventCardWrapper} activeOpacity={0.9}>
                  <View style={[styles.eventCard, { borderLeftColor: event.color, borderLeftWidth: normalize(6) }]}>
                    <View style={styles.eventContent}>
                      <View style={styles.topRow}>
                        <View style={styles.timeRow}>
                          <View style={[styles.iconCircle, { backgroundColor: event.color }]}>
                            <Feather name={event.icon} size={normalize(20)} color="#FFFFFF" />
                          </View>
                          <View style={styles.eventTitleContainer}>
                            <Text style={styles.title} allowFontScaling={false}>
                              {event.title}
                            </Text>
                            <Text style={styles.eventTimeRange} allowFontScaling={false}>
                              {event.time} - {event.endTime}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {event.hasImage && (
                        <View style={styles.eventImageContainer}>
                          <Image source={{ uri: event.imageUrl }} style={styles.eventImage} resizeMode="cover" />
                        </View>
                      )}

                      <Text style={styles.subtitle} allowFontScaling={false}>
                        {event.subtitle}
                      </Text>

                      <View style={styles.eventFooter}>
                        <View style={styles.childInfo}>
                          {event.childImage && (
                            <Image source={{ uri: event.childImage }} style={styles.childImage} />
                          )}
                          <Text style={styles.childName} allowFontScaling={false}>
                            {event.childName}
                          </Text>
                        </View>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity style={styles.actionButton}><Feather name="smile" size={normalize(16)} color="#666" /></TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton}><Feather name="message-circle" size={normalize(16)} color="#666" /></TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={{ height: hp(15) }} />
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
    zIndex: 10,
    overflow: "hidden",
    borderBottomEndRadius: normalize(35),
    borderBottomStartRadius: normalize(35),
  },
  safeArea: { height: Platform.OS === "android" ? StatusBar.currentHeight : 44 },

  whiteSection: { 
    position: "absolute", 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: "#ffffff", 
    borderTopLeftRadius: normalize(35), 
    borderTopRightRadius: normalize(35), 
    overflow: "hidden", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: -5 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 12, 
    elevation: 12,
  },
  scrollContent: { paddingTop: hp(3.5), paddingHorizontal: wp(5), paddingBottom: hp(5) },
  eventHeader: { marginBottom: hp(2.5) },
  eventHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  headerLeft: { flex: 1 },
  eventCount: { fontSize: normalize(12), color: "#999999", marginBottom: hp(0.5), fontWeight: "500" },
  eventDate: { fontSize: normalize(18), fontWeight: "700", color: "#1a1a2e" },
  
  calendarIconButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(12),
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  // --- MODAL / POPUP STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: hp(20),
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  popupGradient: {
    padding: wp(4),
    paddingBottom: hp(2),
  },
  popupMonthPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  monthLabelContainer: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: wp(4), 
    paddingVertical: hp(0.6), 
    borderRadius: normalize(15),
  },
  monthText: { fontSize: normalize(14), fontWeight: "700", color: "#fff" },
  navIcon: { 
    padding: wp(1.5), 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: normalize(10),
  },
  weekDays: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp(1) },
  weekDayText: { 
    textAlign: "center", 
    fontSize: normalize(10), 
    color: "rgba(255,255,255,0.7)", 
    fontWeight: "700", 
  },
  dateGridContainer: { flexDirection: "row", flexWrap: "wrap" },
  dateCell: { height: normalize(34), alignItems: "center", justifyContent: 'center' },
  selectedCircle: { 
    width: normalize(28), 
    height: normalize(28), 
    borderRadius: normalize(8), 
    backgroundColor: "#FFD700", 
    justifyContent: "center", 
    alignItems: "center",
  },
  normalCircle: { width: normalize(28), height: normalize(28), justifyContent: "center", alignItems: "center" },
  todayCircle: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: normalize(8) },
  selectedDateText: { fontSize: normalize(12), fontWeight: "800", color: "#6F42C1" },
  normalDateText: { fontSize: normalize(12), color: "#fff", fontWeight: "600" },
  todayDateText: { color: "#fff", fontWeight: "800" },

  // Mini Inline Calendar
  miniCalendar: { backgroundColor: "#F8F5FF", borderRadius: normalize(16), padding: wp(3), marginTop: hp(1.5) },
  miniCalendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: hp(1) },
  miniNavButton: { padding: wp(1) },
  miniMonthText: { fontSize: normalize(10), fontWeight: "700", color: "#6F42C1" },
  miniDatesRow: { flexDirection: "row", justifyContent: "space-between" },
  miniDateCell: { width: normalize(26), height: normalize(26), borderRadius: normalize(8), alignItems: "center", justifyContent: "center" },
  miniDateCellSelected: { backgroundColor: "#FFD700" },
  miniDateText: { fontSize: normalize(9), fontWeight: "600", color: "#6F42C1" },
  miniDateTextSelected: { color: "#6F42C1", fontWeight: "800" },

  // Filters & Timeline
  filterSection: { marginBottom: hp(2.5) },
  filterTitle: { fontSize: normalize(12), fontWeight: "700", color: "#555", marginBottom: hp(1.5) },
  filterScroll: { marginHorizontal: -wp(5) },
  filterContent: { paddingHorizontal: wp(5), gap: wp(2.5) },
  filterChip: { flexDirection: "row", alignItems: "center", paddingVertical: hp(1), paddingHorizontal: wp(3.5), backgroundColor: "#F0F0F0", borderRadius: normalize(18) },
  filterChipActive: { backgroundColor: "#6F42C1" },
  filterChipText: { fontSize: normalize(12), fontWeight: "600", color: "#666" },
  filterChipTextActive: { color: "#FFFFFF" },
  filterChildImage: { width: normalize(22), height: normalize(22), borderRadius: normalize(11), marginRight: wp(2) },
  timelineContainer: { position: "relative", paddingLeft: wp(14) },
  timelineLine: { position: "absolute", left: wp(7), top: 0, bottom: 0, width: normalize(2) },
  timelineGradient: { flex: 1 },
  timelineEventWrapper: { position: "relative", marginBottom: hp(2) },
  timelineBadgeContainer: { position: "absolute", left: -wp(14), top: hp(2), alignItems: "center", zIndex: 2 },
  timelineBadge: { backgroundColor: "#fff", borderRadius: normalize(10), paddingHorizontal: wp(2), paddingVertical: hp(0.5), borderWidth: 2, borderColor: "#F0F0F0" },
  timelineBadgeText: { fontSize: normalize(9), fontWeight: "800" },
  timelineDot: { width: normalize(10), height: normalize(10), borderRadius: normalize(5), backgroundColor: "#FFD700", marginTop: hp(0.5) },
  eventCardWrapper: { borderRadius: normalize(20), overflow: "hidden", elevation: 3 },
  eventCard: { backgroundColor: "#fff" },
  eventContent: { padding: wp(4) },
  topRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp(1) },
  timeRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: { width: normalize(40), height: normalize(40), borderRadius: normalize(12), justifyContent: "center", alignItems: "center" },
  eventTitleContainer: { marginLeft: wp(2.5), flex: 1 },
  title: { fontSize: normalize(16), fontWeight: "700" },
  eventTimeRange: { fontSize: normalize(10), color: "#999" },
  eventImageContainer: { marginVertical: hp(1), borderRadius: normalize(12), overflow: "hidden" },
  eventImage: { width: "100%", height: hp(15) },
  subtitle: { fontSize: normalize(12), color: "#666", marginBottom: hp(1) },
  eventFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F0F0F0", paddingTop: hp(1) },
  childInfo: { flexDirection: "row", alignItems: "center" },
  childImage: { width: normalize(26), height: normalize(26), borderRadius: normalize(13) },
  childName: { fontSize: normalize(11), fontWeight: "600", marginLeft: wp(2) },
  actionButtons: { flexDirection: "row", gap: wp(2) },
  actionButton: { backgroundColor: "#F5F5F5", borderRadius: normalize(8), padding: normalize(6) },
});