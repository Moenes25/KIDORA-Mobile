import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav({ onNavigate }) {
  const [active, setActive] = useState("home");

  const animations = {
    home: useRef(new Animated.Value(1)).current,
    chat: useRef(new Animated.Value(1)).current,
    daily: useRef(new Animated.Value(1)).current,
    profile: useRef(new Animated.Value(1)).current,
  };

  // Animate the active icon on mount
  useEffect(() => {
    Animated.spring(animations[active], {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, []);

  const handlePress = (key) => {
    setActive(key);
    onNavigate(key);

    Animated.spring(animations[key], {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();

    Object.keys(animations).forEach((k) => {
      if (k !== key) {
        Animated.spring(animations[k], {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    });

    // navigate to the screen
    switch (key) {
      case "home":
        navigation.navigate("HomeScreen");
        break;
      case "people":
        navigation.navigate("ChildrenListScreen"); // replace with your screen if needed
        break;
      case "clipboard":
        navigation.navigate("TasksScreen"); // replace with your screen
        break;
      case "person":
        navigation.navigate("ProfileScreen");
        break;
      default:
        break;
    }
  };

  const renderIcon = (key, iconName) => {
    const isActive = active === key;

    return (
      <TouchableOpacity key={key} onPress={() => handlePress(key)} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.iconWrapper,
            isActive && styles.activeIconWrapper,
            {
              transform: [
                { scale: animations[key] },
                { translateY: isActive ? -8 : 0 },
              ],
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={isActive ? 28 : 24}
            color={isActive ? "white" : "#6F42C1"}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon("home", "home")}
      {renderIcon("chat", "chatbubble")}
      {renderIcon("daily", "bar-chart")}
      {renderIcon("profile", "person")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 75,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fbf7ff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconWrapper: {
    backgroundColor: "#6F42C1",
  },
});
