import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Sidebar({ visible, onClose }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {/* Close Icon */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={28} color="#6F42C1" />
        </TouchableOpacity>

        {/* Sidebar Items */}
        <View style={styles.items}>
          <View style={styles.item}>
            <Feather name="user" size={24} color="#6F42C1" />
            <Text style={styles.itemText}>Profile</Text>
          </View>
          <View style={styles.item}>
            <Feather name="settings" size={24} color="#6F42C1" />
            <Text style={styles.itemText}>Settings</Text>
          </View>
          <View style={styles.item}>
            <Feather name="activity" size={24} color="#6F42C1" />
            <Text style={styles.itemText}>Activities</Text>
          </View>
          <View style={styles.item}>
            <Feather name="calendar" size={24} color="#6F42C1" />
            <Text style={styles.itemText}>Events</Text>
          </View>
        </View>
      </View>

      {/* Touchable overlay to close sidebar if clicked outside */}
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
    backgroundColor: "white", // semi-visible purple shade
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  items: {
    marginTop: 40,
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
