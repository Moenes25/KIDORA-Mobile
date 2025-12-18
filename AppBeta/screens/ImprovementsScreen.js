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
import { normalize, wp, hp, screenHeight } from "../utils/responsive";
import BottomNav from "../components/BottomNav";

const { width: screenWidth } = Dimensions.get("window");
const TIMELINE_WIDTH = wp(15);
const TOP_SECTION_HEIGHT = screenHeight * 0.20;
const CIRCLE_SIZE = wp(17.5);

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
                isRTL && { marginLeft: wp(2), marginRight: 0 }
              ]}
            >
              <Feather 
                name={isRTL ? "chevron-right" : "chevron-left"} 
                size={normalize(28)} 
                color="#fff" 
              />
            </TouchableOpacity>
            <Text style={[
              styles.headerTitle,
              isRTL && { textAlign: 'center', marginLeft: wp(10), marginRight: 0 }
            ]}>
              {t('childDevelopment')}
            </Text>
          </View>
          
          {/* Spacer for rounded section */}
          <View style={{ height: hp(3.7) }} />
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
                      <Feather name="check" size={normalize(18)} color="#fff" />
                    ) : (
                      <Feather name="lock" size={normalize(18)} color="#666" />
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
                          height: expandedMilestone === milestone.id ? hp(35) : hp(6.2),
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
              isRTL && { paddingRight: wp(3), paddingLeft: 0 }
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
                        isRTL && { marginLeft: wp(3), marginRight: 0 }
                      ]}
                    >
                      {milestone.completed && <Feather name="award" size={normalize(18)} color="#9b59b6" />}
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
                      size={normalize(24)}
                      color={milestone.completed ? "#fff" : "#888"}
                    />
                  </View>

                  {/* Expanded Details */}
                  {expandedMilestone === milestone.id && milestone.completed && (
                    <View style={styles.expandedContent}>
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
          <View style={{ height: hp(12.5) }} />
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
    borderBottomEndRadius: normalize(38),
    borderBottomStartRadius: normalize(38),
  },

  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : hp(5.5),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(2.5),
  },
  backButton: { 
    padding: wp(2),
    marginRight: wp(2),
  },
  headerTitle: { 
    fontSize: normalize(22), 
    fontWeight: "700", 
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: wp(10),
  },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -hp(0.6) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(12),
    elevation: 12,
  },

  scrollContent: { 
    paddingTop: hp(4), 
    paddingHorizontal: wp(5),
    paddingBottom: hp(15),
  },
  bottomInner: { flexDirection: "row" },

  timeline: { 
    width: TIMELINE_WIDTH, 
    alignItems: "center", 
    paddingTop: hp(1.5) 
  },
  timelineItem: { 
    alignItems: "center", 
    flexDirection: "column" 
  },
  timelineNode: { 
    width: wp(7), 
    height: wp(7), 
    borderRadius: wp(3.5), 
    justifyContent: "center", 
    alignItems: "center", 
    marginVertical: hp(0.5) 
  },
  timelineConnector: { 
    width: normalize(4), 
    height: hp(6.2), 
    borderRadius: normalize(2) 
  },

  cardsContainer: { 
    flex: 1, 
    paddingLeft: wp(3) 
  },
  milestoneCard: { 
    borderRadius: normalize(24), 
    padding: wp(4), 
    marginBottom: hp(2.2) 
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconCircle: { 
    width: wp(7), 
    height: wp(7), 
    borderRadius: wp(3.5), 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: wp(3) 
  },
  cardTitle: { 
    fontSize: normalize(16), 
    fontWeight: "700", 
    flex: 1 
  },

  expandedContent: { 
    marginTop: hp(2),
  },

  circularProgressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: hp(0.5),
  },

  circularProgressItem: {
    alignItems: "center",
    width: "50%",
    marginVertical: hp(1),
  },

  circularProgress: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    marginBottom: hp(1),
  },

  circularProgressOuter: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  circularProgressInner: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: normalize(6),
    borderColor: "transparent",
  },

  circularProgressCenter: {
    width: CIRCLE_SIZE * 0.77,
    height: CIRCLE_SIZE * 0.77,
    borderRadius: (CIRCLE_SIZE * 0.77) / 2,
    backgroundColor: "#9b59b6",
    justifyContent: "center",
    alignItems: "center",
  },

  circularProgressText: {
    color: "#fff",
    fontSize: normalize(14),
    fontWeight: "700",
  },

  skillLabel: {
    color: "#fff",
    fontSize: normalize(12),
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