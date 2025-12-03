import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { LightTheme, DarkTheme } from "../context/ThemeColors";

export default function AboutUsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = theme === "dark" ? DarkTheme : LightTheme;

  const description = `
Kidora is an innovative platform developed by our dedicated team to empower educators, parents, and children alike.
Our mission is to provide tools that track children's progress, organize educational activities, and foster collaboration
between family and school. The project combines technology, design, and educational insights to deliver a seamless and engaging user experience.
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <LinearGradient colors={colors.headerGradient} style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={28}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>About Kidora</Text>
        <View style={{ width: 28 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* DESCRIPTION CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
        >
          <Text style={[styles.cardText, { color: colors.text }]}>
            {description.trim()}
          </Text>
        </View>
      </ScrollView>
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

  scrollContainer: {
    padding: 20,
  },

  card: {
    borderRadius: 18,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  cardText: {
    fontSize: 24,
    lineHeight: 22,
  },
});
