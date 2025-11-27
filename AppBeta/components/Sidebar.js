import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Sidebar({ visible, onClose }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../assets/kidora.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerText}>ParentPortal</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close-circle" size={32} color="#6F42C1" />
          </TouchableOpacity>
        </View>

        {/* Main Sidebar Items */}
        <View style={styles.items}>
          <View style={styles.item}>
            <MaterialCommunityIcons name="message" size={26} color="#6F42C1" />
            <Text style={styles.itemText}>Chat</Text>
          </View>

          <View style={styles.item}>
            <MaterialCommunityIcons name="calendar" size={26} color="#6F42C1" />
            <Text style={styles.itemText}>Calendar</Text>
          </View>

          <View style={styles.item}>
            <MaterialCommunityIcons name="credit-card" size={26} color="#6F42C1" />
            <Text style={styles.itemText}>Payments</Text>
          </View>

          {/* Spacer to push Logout to bottom */}
          <View style={{ flex: 1 }} />

          {/* Logout at the bottom */}
          <View style={styles.item}>
            <MaterialCommunityIcons name="logout" size={26} color="#6F42C1" />
            <Text style={styles.itemText}>Logout</Text>
          </View>
        </View>
      </View>

      {/* Close on outside press */}
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    zIndex: 100,
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sidebar: {
    width: 250,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fbf7ff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8, // move logo closer to the left edge
    gap: 8, // space between logo and text
  },
  logo: {
    width: 50,  // bigger logo
    height: 50,
  },
  headerText: {
    fontSize: 20, // slightly smaller text
    fontWeight: "bold",
    color: "#6F42C1",
  },
  items: {
    marginTop: 10,
    flex: 1, // fill space to allow Logout to be at bottom
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#6F42C1",
  },
});
