// components/TopNavBar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const TopNavBar = ({ title, navigation }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient
      // Always use the gradient, regardless of dark/light mode
      colors={colors.headerGradient}
      style={styles.header}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={28} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.headerText}>{title}</Text>
      
      {/* Empty View for balancing the flex layout */}
      <View style={{ width: 28 }} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingTop: 20, // Reduced slightly since it's inside another container usually
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // Ensure it sits on top if needed, though Calendar handles zIndex
    zIndex: 10, 
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default TopNavBar;