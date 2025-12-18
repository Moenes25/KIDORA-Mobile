import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import TopNavBar from "../components/TopNavBar";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { normalize, wp, hp, isSmallDevice } from "../utils/responsive";

export default function FeedbackScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [feedbackType, setFeedbackType] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const feedbackTypes = [
    { id: "general", label: "General", icon: "chatbubble-outline" },
    { id: "bug", label: "Bug Report", icon: "bug-outline" },
    { id: "feature", label: "Feature Request", icon: "bulb-outline" },
    { id: "improvement", label: "Improvement", icon: "trending-up-outline" },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Missing Information", "Please fill in both subject and message.");
      return;
    }

    // Here you would typically send the feedback to your backend
    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted successfully. We appreciate your input!",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );

    // Reset form
    setSubject("");
    setMessage("");
    setFeedbackType("general");
  };

  return (
    <View style={styles.container}>
      <View style={{ 
        height: Platform.OS === "android" ? StatusBar.currentHeight : hp(5.5), 
        backgroundColor: "#6f42c1" 
      }} />
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={colors.headerGradient} style={styles.topSection}>
        <TopNavBar title="Send Feedback" navigation={navigation} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.keyboardView, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Ionicons 
              name="mail-outline" 
              size={normalize(isSmallDevice ? 40 : 48)} 
              color={isDark ? "#BB86FC" : "#6F42C1"} 
            />
            <Text 
              style={[styles.headerTitle, { color: colors.text }]}
              allowFontScaling={false}
            >
              We'd Love to Hear From You
            </Text>
            <Text 
              style={[styles.headerSubtitle, { color: colors.subText }]}
              allowFontScaling={false}
            >
              Your feedback helps us improve the app and provide better service for you and your children.
            </Text>
          </View>

          {/* Feedback Type Selection */}
          <View style={styles.section}>
            <Text 
              style={[styles.label, { color: colors.text }]}
              allowFontScaling={false}
            >
              Feedback Type
            </Text>
            <View style={styles.typeContainer}>
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setFeedbackType(type.id)}
                  style={[
                    styles.typeButton,
                    feedbackType === type.id && [
                      styles.typeButtonActive,
                      { backgroundColor: isDark ? "#BB86FC" : "#6F42C1" },
                    ],
                    { 
                      backgroundColor: feedbackType === type.id 
                        ? (isDark ? "#BB86FC" : "#6F42C1")
                        : (isDark ? "#2C2C2C" : "#F5F5F5"),
                      borderColor: isDark ? "#444" : "#E0E0E0"
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={type.icon}
                    size={normalize(isSmallDevice ? 16 : 20)}
                    color={
                      feedbackType === type.id
                        ? "white"
                        : isDark ? "#BB86FC" : "#6F42C1"
                    }
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      feedbackType === type.id && styles.typeButtonTextActive,
                      { 
                        color: feedbackType === type.id 
                          ? "white" 
                          : colors.text 
                      },
                    ]}
                    allowFontScaling={false}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject Input */}
          <View style={styles.section}>
            <Text 
              style={[styles.label, { color: colors.text }]}
              allowFontScaling={false}
            >
              Subject
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? "#2C2C2C" : "#F9F9F9",
                  color: colors.text,
                  borderColor: isDark ? "#444" : "#E0E0E0"
                },
              ]}
              placeholder="Brief summary of your feedback"
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={subject}
              onChangeText={setSubject}
              allowFontScaling={false}
            />
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text 
              style={[styles.label, { color: colors.text }]}
              allowFontScaling={false}
            >
              Message
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                { 
                  backgroundColor: isDark ? "#2C2C2C" : "#F9F9F9",
                  color: colors.text,
                  borderColor: isDark ? "#444" : "#E0E0E0"
                },
              ]}
              placeholder="Tell us more about your thoughts, suggestions, or issues..."
              placeholderTextColor={isDark ? "#888" : "#999"}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              allowFontScaling={false}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: isDark ? "#BB86FC" : "#6F42C1" },
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={normalize(isSmallDevice ? 18 : 20)} color="white" />
            <Text 
              style={styles.submitButtonText}
              allowFontScaling={false}
            >
              Submit Feedback
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topSection: {
    paddingBottom: hp(1.2),
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(5),
  },
  headerSection: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  headerTitle: {
    fontSize: normalize(isSmallDevice ? 20 : 24),
    fontWeight: "700",
    marginTop: hp(2),
    marginBottom: hp(1),
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: normalize(isSmallDevice ? 12 : 14),
    textAlign: "center",
    lineHeight: normalize(isSmallDevice ? 18 : 20),
    paddingHorizontal: wp(3),
  },
  section: {
    marginBottom: hp(3),
  },
  label: {
    fontSize: normalize(isSmallDevice ? 14 : 16),
    fontWeight: "600",
    marginBottom: hp(1.5),
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2.5),
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: normalize(20),
    borderWidth: normalize(1),
    gap: wp(1.5),
  },
  typeButtonActive: {
    borderColor: "transparent",
  },
  typeButtonText: {
    fontSize: normalize(isSmallDevice ? 12 : 14),
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "white",
  },
  input: {
    borderWidth: normalize(1),
    borderRadius: normalize(12),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
    fontSize: normalize(isSmallDevice ? 13 : 15),
  },
  messageInput: {
    minHeight: hp(isSmallDevice ? 16 : 18),
    paddingTop: hp(1.6),
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    borderRadius: normalize(12),
    gap: wp(2),
    marginTop: hp(1.2),
    shadowColor: "#6F42C1",
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: hp(0.5) },
    elevation: 6,
  },
  submitButtonText: {
    color: "white",
    fontSize: normalize(isSmallDevice ? 14 : 16),
    fontWeight: "600",
  },
});