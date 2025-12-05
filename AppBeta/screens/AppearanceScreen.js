import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { LightTheme, DarkTheme } from "../context/ThemeColors";

export default function AppearanceScreen() {
  const navigation = useNavigation();
  const { theme, themeMode, setThemeMode } = useTheme();
  const colors = theme === "dark" ? DarkTheme : LightTheme;

  const options = [
    { key: "light", label: "Light", icon: "sunny-outline" },
    { key: "dark", label: "Dark", icon: "moon-outline" },
    { key: "system", label: "Use Device Settings", icon: "phone-portrait-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <LinearGradient colors={colors.headerGradient} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* OPTIONS LIST */}
      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.optionCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
            onPress={() => setThemeMode(opt.key)}
          >
            <View style={styles.leftRow}>
              <Ionicons
                name={opt.icon}
                size={24}
                color={colors.text}
                style={{ marginRight: 15 }}
              />
              <Text style={[styles.optionLabel, { color: colors.text }]}>{opt.label}</Text>
            </View>

            {themeMode === opt.key && (
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
