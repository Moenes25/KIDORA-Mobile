// components/Sidebar.js  (enhanced)
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
    <>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#6F42C1', '#9b59b6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sidebar}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../assets/kidora.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Parent Portal</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close-circle" size={27} color="white" />
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
    </>
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
    width: 180,
    paddingTop: 20,
    paddingHorizontal: 20,
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
    marginLeft: -15, // move logo closer to the left edge
    gap: 2, // space between logo and text
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  items: {
    marginTop: 10,
    flex: 1,
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