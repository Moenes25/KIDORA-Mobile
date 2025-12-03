import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import { LightTheme, DarkTheme } from "../context/ThemeColors";

export default function LanguageScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = theme === "dark" ? DarkTheme : LightTheme;

  const languages = [
    { key: "ar", label: "العربية" },
    { key: "fr", label: "français" },
    { key: "en", label: "English" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const saved = await AsyncStorage.getItem("language");
    if (saved) setSelectedLanguage(saved);
  };

  const changeLanguage = async (lang) => {
    setSelectedLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <LinearGradient colors={colors.headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* LANGUAGE OPTIONS */}
      <View style={styles.optionsContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={[
              styles.optionCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
            onPress={() => changeLanguage(lang.key)}
          >
            <View style={styles.leftRow}>
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                {lang.label}
              </Text>
            </View>

            {selectedLanguage === lang.key && (
              <Ionicons
                name="checkmark-circle"
                size={26}
                color={colors.text}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },

  optionsContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 25,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "space-between",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
});
