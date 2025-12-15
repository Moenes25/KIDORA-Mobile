// screens/ImprovementsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import BottomNav from "../components/BottomNav";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const TIMELINE_WIDTH = 60;
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function ImprovementsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";

  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Milestones with translation keys
  const milestonesData = [
    { id: 1, periodKey: "septemberOctober", completed: true, skills: { language: 40, motor: 60, cognition: 50, social: 79 } },
    { id: 2, periodKey: "novemberDecember", completed: true, skills: { language: 50, motor: 85, cognition: 55, social: 75 } },
    { id: 3, periodKey: "januaryFebruary", completed: false, skills: { language: 0, motor: 0, cognition: 0, social: 0 } },
    { id: 4, periodKey: "marchApril", completed: false, skills: { language: 0, motor: 0, cognition: 0, social: 0 } },
    { id: 5, periodKey: "mayJune", completed: false, skills: { language: 0, motor: 0, cognition: 0, social: 0 } },
  ];

  const toggleExpand = (id, completed) => {
    if (!completed) return;
    setExpandedMilestone(expandedMilestone === id ? null : id);
  };

  const getProgressColor = (percent) =>
    percent <= 40 ? "#e74c3c" : percent <= 75 ? "#f1c40f" : "#2ecc71";

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

          {/* Header with Back Button and Title */}
          <View style={[
            styles.header,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={[
                styles.backButton,
                isRTL && { marginLeft: 8, marginRight: 0 }
              ]}
            >
              <Feather 
                name={isRTL ? "chevron-right" : "chevron-left"} 
                size={28} 
                color="#fff" 
              />
            </TouchableOpacity>
            <Text style={[
              styles.headerTitle,
              isRTL && { textAlign: 'center', marginLeft: 40, marginRight: 0 }
            ]}>
              {t('childDevelopment')}
            </Text>
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
          <View style={[
            styles.bottomInner,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            {/* Timeline Sidebar */}
            <View style={styles.timeline}>
              {milestonesData.map((milestone, index) => (
                <View key={milestone.id} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineNode,
                      {
                        backgroundColor: milestone.completed ? "#9b59b6" : "#ccc",
                      },
                    ]}
                  >
                    {milestone.completed ? (
                      <Feather name="check" size={18} color="#fff" />
                    ) : (
                      <Feather name="lock" size={18} color="#666" />
                    )}
                  </View>
                  {index < milestonesData.length - 1 && (
                    <LinearGradient
                      colors={["#9b59b6", "#d1b3ff"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={[
                        styles.timelineConnector,
                        { 
                          backgroundColor: milestone.completed ? "#9b59b6" : "#ccc",
                          height: expandedMilestone === milestone.id ? 280 : 50,
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Milestones Cards */}
            <View style={[
              styles.cardsContainer,
              isRTL && { paddingRight: 12, paddingLeft: 0 }
            ]}>
              {milestonesData.map((milestone) => (
                <TouchableOpacity
                  key={milestone.id}
                  style={[
                    styles.milestoneCard,
                    {
                      backgroundColor: milestone.completed ? "#9b59b6" : "#e0e0e0",
                      opacity: milestone.completed ? 1 : 0.6,
                    },
                  ]}
                  onPress={() => toggleExpand(milestone.id, milestone.completed)}
                  activeOpacity={milestone.completed ? 0.85 : 1}
                >
                  <View style={[
                    styles.cardHeader,
                    isRTL && { flexDirection: 'row-reverse' }
                  ]}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: milestone.completed ? "#fff" : "#ccc" },
                        isRTL && { marginLeft: 12, marginRight: 0 }
                      ]}
                    >
                      {milestone.completed && <Feather name="award" size={18} color="#9b59b6" />}
                    </View>
                    <Text
                      style={[
                        styles.cardTitle,
                        { color: milestone.completed ? "#fff" : "#888" },
                        isRTL && { textAlign: 'right' }
                      ]}
                    >
                      {t(milestone.periodKey)}
                    </Text>
                    <Ionicons
                      name={isRTL ? "chevron-back" : "chevron-forward"}
                      size={24}
                      color={milestone.completed ? "#fff" : "#888"}
                    />
                  </View>

                  {/* Expanded Details */}
                  {expandedMilestone === milestone.id && milestone.completed && (
                    <View style={styles.expandedContent}>
                      {/* First Row: Language and Motor */}
                      {/* First Row: Language and Motor */}
                      <View style={[
                        styles.circularProgressRow,
                        isRTL && { flexDirection: 'row-reverse' }
                      ]}>
                        {["language", "motor"].map((skillKey) => {
                          const value = milestone.skills[skillKey];
                          const progressColor = getProgressColor(value);
                          return (
                            <View key={skillKey} style={styles.circularProgressItem}>
                              {/* Circular Progress */}
                              <View style={styles.circularProgress}>
                                <View style={styles.circularProgressOuter}>
                                  <View style={[styles.circularProgressInner, {
                                    borderTopColor: value >= 25 ? progressColor : "transparent",
                                    borderRightColor: value >= 50 ? progressColor : "transparent",
                                    borderBottomColor: value >= 75 ? progressColor : "transparent",
                                    borderLeftColor: value >= 100 ? progressColor : "transparent",
                                    transform: [{ rotate: `${(value / 100) * 360}deg` }]
                                  }]} />
                                  <View style={styles.circularProgressCenter}>
                                    <Text style={styles.circularProgressText}>{value}%</Text>
                                  </View>
                                </View>
                              </View>
                              {/* Skill Label */}
                              <Text style={styles.skillLabel}>
                                {t(skillKey)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>

                      {/* Second Row: Cognition and Social */}
                      {/* Second Row: Cognition and Social */}
                      <View style={[
                        styles.circularProgressRow,
                        isRTL && { flexDirection: 'row-reverse' }
                      ]}>
                        {["cognition", "social"].map((skillKey) => {
                          const value = milestone.skills[skillKey];
                          const progressColor = getProgressColor(value);
                          return (
                            <View key={skillKey} style={styles.circularProgressItem}>
                              {/* Circular Progress */}
                              <View style={styles.circularProgress}>
                                <View style={styles.circularProgressOuter}>
                                  <View style={[styles.circularProgressInner, {
                                    borderTopColor: value >= 25 ? progressColor : "transparent",
                                    borderRightColor: value >= 50 ? progressColor : "transparent",
                                    borderBottomColor: value >= 75 ? progressColor : "transparent",
                                    borderLeftColor: value >= 100 ? progressColor : "transparent",
                                    transform: [{ rotate: `${(value / 100) * 360}deg` }]
                                  }]} />
                                  <View style={styles.circularProgressCenter}>
                                    <Text style={styles.circularProgressText}>{value}%</Text>
                                  </View>
                                </View>
                              </View>
                              {/* Skill Label */}
                              <Text style={styles.skillLabel}>
                                {t(skillKey)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
  },

  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backButton: { 
    padding: 8,
    marginRight: 8,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },

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
  bottomInner: { flexDirection: "row" },

  timeline: { 
    width: TIMELINE_WIDTH, 
    alignItems: "center", 
    paddingTop: 12 
  },
  timelineItem: { 
    alignItems: "center", 
    flexDirection: "column" 
  },
  timelineNode: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: "center", 
    alignItems: "center", 
    marginVertical: 4 
  },
  timelineConnector: { 
    width: 4, 
    height: 50, 
    borderRadius: 2 
  },

  cardsContainer: { 
    flex: 1, 
    paddingLeft: 12 
  },
  milestoneCard: { 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 18 
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconCircle: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    flex: 1 
  },

  expandedContent: { 
    marginTop: 16,
  },

  circularProgressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 4,
  },

  circularProgressItem: {
    alignItems: "center",
    width: "50%",
    marginVertical: 8,
  },

  circularProgress: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },

  circularProgressOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  circularProgressInner: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: "transparent",
  },

  circularProgressCenter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#9b59b6",
    justifyContent: "center",
    alignItems: "center",
  },

  circularProgressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  skillLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});