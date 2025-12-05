// components/Sidebar.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SidebarApp({ visible, onClose, onNavigate = () => {} }) {
  if (!visible) return null;

  const goTo = (route) => {
    onNavigate(route);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#6F42C1', '#9b59b6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.sidebar}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Parental Portal</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.items}>
          <TouchableOpacity style={styles.row} onPress={() => goTo("chat")}>
            <Feather name="message-circle" size={24} color="white" />
            <Text style={styles.itemText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => goTo("calendar")}>
            <Feather name="calendar" size={24} color="white" />
            <Text style={styles.itemText}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => goTo("daily")}>
            <Feather name="bar-chart" size={24} color="white" />
            <Text style={styles.itemText}>Daily Record</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => goTo("profile")}>
            <Feather name="user" size={24} color="white" />
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  items: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 15,
    color: "white",
  },
});
