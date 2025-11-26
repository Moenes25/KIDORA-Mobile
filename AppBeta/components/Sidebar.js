// components/Sidebar.js  (enhanced)
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Sidebar({ visible, onClose }) {
  const navigation = useNavigation();
  if (!visible) return null;

  const goTo = (route) => {
    onClose();
    navigation.navigate(route);
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
          <TouchableOpacity style={styles.item} onPress={() => goTo("Chat")}>
            <Feather name="message-circle" size={24} color="white" />
            <Text style={styles.itemText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => goTo("Calendar")}>
            <Feather name="calendar" size={24} color="white" />
            <Text style={styles.itemText}>Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => {
            // placeholder logout action
            onClose();
            // add your logout logic here (e.g., clear tokens + navigate to Auth)
          }}>
            <Feather name="log-out" size={24} color="white" />
            <Text style={styles.itemText}>Logout</Text>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  itemText: {
    fontSize: 18,
    marginLeft: 15,
    color: "white",
  },
});
