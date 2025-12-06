// components/TopNavBar.js — Dark theme with opacity support
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const TopNavBar = ({ title, navigation }) => {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {isDark ? (
        // Dark theme: solid dark card with opacity
        <View
          style={[
            styles.header,
            { backgroundColor: colors.cardHeavy }
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{title}</Text>
          <View style={{ width: 28 }} />
        </View>
      ) : (
        // Light theme: keep gradient
        <LinearGradient
          colors={colors.headerGradient}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{title}</Text>
          <View style={{ width: 28 }} />
        </LinearGradient>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

export default TopNavBar;