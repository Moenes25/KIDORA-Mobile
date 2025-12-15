// components/TopNavBar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";

const TopNavBar = ({ title }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isRTL } = useTranslation();

  return (
    <LinearGradient
      // Default to your purple gradient if colors.headerGradient isn't available
      colors={colors.headerGradient || ["#9d00ff", "#6f42c1"]}
      style={styles.header}
    >
      <View style={styles.safeArea} />
      
      <View style={[
        styles.content,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather 
            name={isRTL ? "arrow-right" : "chevron-left"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>{title}</Text>
        
        {/* Invisible view to balance the Back Button so text stays centered */}
        <View style={styles.backBtn} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    // Standard shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  safeArea: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },
  content: {
    height: 56, // Standard Toolbar height
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  backBtn: {
    width: 28,
    alignItems: 'center',
  }
});

export default TopNavBar;