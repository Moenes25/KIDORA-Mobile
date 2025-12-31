import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { normalize, wp, hp } from "../utils/responsive";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Avatar mapping based on child IDs
const childAvatars = {
  "child-001": require("../assets/child1.png"),
  "child-002": require("../assets/child3.png"),
  "child-003": require("../assets/child2.png"),
  "child-004": require("../assets/child1.png"),
};

const DailyReportPopup = ({ visible, onClose, childrenReports, navigation }) => {
  const [viewMode, setViewMode] = useState("lines"); // "lines" or "paragraph"

  // Get emoji based on mood/status
  const getEmoji = (type) => {
    const emojiMap = {
      happy: "😊",
      sad: "😢",
      neutral: "😐",
      excited: "😄",
      tired: "😴",
    };
    return emojiMap[type?.toLowerCase()] || "😐";
  };

  // Get border color based on overall mood
  const getMoodColor = (mood) => {
    switch (mood?.toLowerCase()) {
      case "happy":
      case "excited":
        return "#10b981";
      case "neutral":
      case "tired":
        return "#f59e0b";
      case "sad":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  const handleViewFullReport = (child) => {
    onClose();
    // Small delay to ensure smooth transition
    setTimeout(() => {
      navigation.navigate("ChildDetailScreen", {
        child: {
          id: child.childId,
          name: child.name,
          age: child.age,
          avatar: childAvatars[child.childId],
        }
      });
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {/* Header */}
          <LinearGradient
            colors={["#6F42C1", "#8e44ad"]}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Feather name="file-text" size={normalize(24)} color="#fff" />
              <Text style={styles.headerTitle}>Daily Reports Summary</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={normalize(22)} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          {/* View Toggle Buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "lines" && styles.toggleButtonActive
              ]}
              onPress={() => setViewMode("lines")}
            >
              <Feather 
                name="list" 
                size={normalize(16)} 
                color={viewMode === "lines" ? "#fff" : "#6F42C1"} 
              />
              <Text style={[
                styles.toggleText,
                viewMode === "lines" && styles.toggleTextActive
              ]}>
                Points
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "paragraph" && styles.toggleButtonActive
              ]}
              onPress={() => setViewMode("paragraph")}
            >
              <Feather 
                name="align-left" 
                size={normalize(16)} 
                color={viewMode === "paragraph" ? "#fff" : "#6F42C1"} 
              />
              <Text style={[
                styles.toggleText,
                viewMode === "paragraph" && styles.toggleTextActive
              ]}>
                Paragraph
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {childrenReports && childrenReports.length > 0 ? (
              childrenReports.map((child, index) => (
                <View
                  key={child.childId || index}
                  style={[
                    styles.childCard,
                    { borderLeftColor: getMoodColor(child.mood) }
                  ]}
                >
                  {/* Child Header with Avatar */}
                  <View style={styles.childHeader}>
                    {/* Avatar positioned on the left */}
                    <View style={styles.avatarContainer}>
                      <View style={[styles.avatarBorder, { borderColor: getMoodColor(child.mood) }]}>
                        <Image
                          source={childAvatars[child.childId]}
                          style={styles.childAvatar}
                        />
                      </View>
                    </View>

                    {/* Name and Mood Badge */}
                    <View style={styles.childNameContainer}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <View style={styles.moodBadge}>
                        <Text style={styles.moodEmoji}>
                          {getEmoji(child.mood)}
                        </Text>
                        <Text
                          style={[
                            styles.moodText,
                            { color: getMoodColor(child.mood) }
                          ]}
                        >
                          {child.mood || "Neutral"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Report Preview - Lines Format (Show only 2 lines) */}
                  {viewMode === "lines" && (
                    <View style={styles.reportPreview}>
                      {child.reportLines && child.reportLines.length > 0 ? (
                        <>
                          {child.reportLines.slice(0, 2).map((line, lineIndex) => (
                            <View key={lineIndex} style={styles.reportLineContainer}>
                              <Text style={styles.reportEmoji}>{line.emoji}</Text>
                              <Text style={styles.reportLineText} numberOfLines={2}>
                                {line.text}
                              </Text>
                            </View>
                          ))}
                          {child.reportLines.length > 2 && (
                            <Text style={styles.moreText}>
                              ... and {child.reportLines.length - 2} more updates
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={styles.noReportText}>
                          No updates for today
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Report Preview - Paragraph Format (Truncated) */}
                  {viewMode === "paragraph" && (
                    <View style={styles.reportPreview}>
                      {child.reportParagraph ? (
                        <>
                          <Text style={styles.reportParagraph} numberOfLines={3}>
                            {child.reportParagraph}
                          </Text>
                          {child.reportParagraph.split(' ').length > 30 && (
                            <Text style={styles.moreText}>
                              ... Read more in full report
                            </Text>
                          )}
                        </>
                      ) : (
                        <Text style={styles.noReportText}>
                          No report available
                        </Text>
                      )}
                    </View>
                  )}

                  {/* View Full Report Button */}
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => handleViewFullReport(child)}
                  >
                    <Text style={styles.viewMoreText}>View Full Report</Text>
                    <Feather name="arrow-right" size={normalize(14)} color="#6F42C1" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={normalize(48)} color="#cbd5e1" />
                <Text style={styles.emptyStateText}>
                  No daily reports available
                </Text>
              </View>
            )}

            <View style={{ height: hp(2) }} />
          </ScrollView>

          {/* Footer Button */}
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: SCREEN_WIDTH * 0.92,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.25,
    shadowRadius: normalize(15),
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: {
    padding: wp(1),
  },
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    gap: wp(2),
    backgroundColor: "#f8f9fa",
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
    borderRadius: normalize(10),
    backgroundColor: "#fff",
    gap: wp(1.5),
    borderWidth: normalize(1),
    borderColor: "#e0e0e0",
  },
  toggleButtonActive: {
    backgroundColor: "#6F42C1",
    borderColor: "#6F42C1",
  },
  toggleText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#6F42C1",
  },
  toggleTextActive: {
    color: "#fff",
  },
  scrollView: {
    maxHeight: hp(50),
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  childCard: {
    backgroundColor: "#fff",
    borderRadius: normalize(16),
    padding: wp(4),
    marginBottom: hp(2),
    borderLeftWidth: normalize(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.3) },
    shadowOpacity: 0.08,
    shadowRadius: normalize(8),
    elevation: 3,
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  avatarContainer: {
    marginRight: wp(3),
  },
  avatarBorder: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    borderWidth: normalize(3),
    padding: normalize(2),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.2) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  childAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: wp(6),
  },
  childNameContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childName: {
    fontSize: normalize(17),
    fontWeight: "700",
    color: "#1a1a2e",
    flex: 1,
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1.5),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: normalize(12),
    backgroundColor: "#f8fafc",
  },
  moodEmoji: {
    fontSize: normalize(14),
  },
  moodText: {
    fontSize: normalize(12),
    fontWeight: "600",
  },
  reportPreview: {
    marginTop: hp(0.5),
    paddingVertical: hp(0.5),
  },
  reportLineContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1),
    paddingRight: wp(2),
  },
  reportEmoji: {
    fontSize: normalize(16),
    marginRight: wp(2),
    marginTop: hp(0.2),
  },
  reportLineText: {
    flex: 1,
    fontSize: normalize(13),
    color: "#374151",
    lineHeight: normalize(20),
  },
  reportParagraph: {
    fontSize: normalize(13),
    color: "#374151",
    lineHeight: normalize(20),
    textAlign: "left",
  },
  moreText: {
    fontSize: normalize(12),
    color: "#6366f1",
    fontWeight: "600",
    marginTop: hp(0.5),
    fontStyle: "italic",
  },
  noReportText: {
    fontSize: normalize(13),
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: hp(2),
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: "#f3f4f6",
    borderRadius: normalize(10),
    gap: wp(2),
  },
  viewMoreText: {
    fontSize: normalize(13),
    fontWeight: "600",
    color: "#6F42C1",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(8),
  },
  emptyStateText: {
    fontSize: normalize(14),
    color: "#94a3b8",
    marginTop: hp(1.5),
  },
  continueButton: {
    backgroundColor: "#6F42C1",
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    paddingVertical: hp(1.8),
    borderRadius: normalize(12),
    alignItems: "center",
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
    elevation: 4,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "700",
  },
});

export default DailyReportPopup;