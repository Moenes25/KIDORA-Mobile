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
      <View style={{ height: Platform.OS === "android" ? StatusBar.currentHeight : 44, backgroundColor: "#6f42c1" }} />
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
              size={48} 
              color={isDark ? "#BB86FC" : "#6F42C1"} 
            />
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              We'd Love to Hear From You
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subText }]}>
              Your feedback helps us improve the app and provide better service for you and your children.
            </Text>
          </View>

          {/* Feedback Type Selection */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Feedback Type</Text>
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
                    size={20}
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
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subject Input */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
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
            />
          </View>

          {/* Message Input */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Message</Text>
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
            <Ionicons name="send" size={20} color="white" />
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
    paddingBottom: 10,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  typeButtonActive: {
    borderColor: "transparent",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  messageInput: {
    minHeight: 140,
    paddingTop: 14,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    shadowColor: "#6F42C1",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});