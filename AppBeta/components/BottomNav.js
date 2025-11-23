import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="home" size={28} color="#6F42C1" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="notifications" size={28} color="#6F42C1" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="chatbubble-ellipses" size={28} color="#6F42C1" />
      </TouchableOpacity>

      <TouchableOpacity>
        <Ionicons name="people" size={28} color="#6F42C1" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
  },
});
