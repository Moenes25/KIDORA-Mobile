// screens/AppearanceScreen.js — FIXED & WORKING
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TopNavBar from "../components/TopNavBar";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext"; // ← This is the real one

export default function AppearanceScreen() {
  const navigation = useNavigation();
  const { themeMode, setThemeMode, colors } = useTheme(); // ← Get from provider

  const options = [
    { key: "light", label: "Light", icon: "sunny-outline" },
    { key: "dark", label: "Dark", icon: "moon-outline" },
    { key: "system", label: "Use Device Settings", icon: "phone-portrait-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopNavBar title="Appearance" navigation={navigation} />

      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.optionCard,
              { backgroundColor: colors.card },
            ]}
            onPress={() => setThemeMode(opt.key)} // ← This triggers real change
          >
            <View style={styles.leftRow}>
              <Ionicons name={opt.icon} size={24} color={colors.text} style={{ marginRight: 15 }} />
              <Text style={[styles.optionLabel, { color: colors.text }]}>{opt.label}</Text>
            </View>

            {themeMode === opt.key && (
              <Ionicons name="checkmark-circle" size={26} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  optionsContainer: { width: "90%", alignSelf: "center", marginTop: 30 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  optionLabel: { fontSize: 17, fontWeight: "600" },
});