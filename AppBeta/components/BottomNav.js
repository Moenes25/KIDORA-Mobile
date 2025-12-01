import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav({ navigation, activeScreen = "home" }) {
  const [active, setActive] = useState(activeScreen);

  // Animated values for each icon
  const animations = {
    home: useRef(new Animated.Value(1)).current,
    people: useRef(new Animated.Value(1)).current,
    clipboard: useRef(new Animated.Value(1)).current,
    person: useRef(new Animated.Value(1)).current,
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

    // animate selected icon (scale up)
    Animated.spring(animations[key], {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();

    // animate other icons back to normal
    Object.keys(animations).forEach((k) => {
      if (k !== key) {
        Animated.spring(animations[k], {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 4,
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

  // Render helper
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
                { translateY: isActive ? -8 : 0 }, // lifted when active
              ],
            },
          ]}
        >
          <Ionicons
            name={iconName}
            size={isActive ? 26 : 24}
            color={isActive ? "white" : "#6F42C1"}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon("home", "home")}
      {renderIcon("people", "people")}
      {renderIcon("clipboard", "game-controller")}
      {renderIcon("person", "person")}
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
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  activeIconWrapper: {
    backgroundColor: "#6F42C1",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
});
