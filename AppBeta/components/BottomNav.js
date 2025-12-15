import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function BottomNav({ navigation, activeScreen = "home" }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();
  
  const [active, setActive] = useState(activeScreen);

  // Animated values for each icon
  const animations = {
    home: useRef(new Animated.Value(1)).current,
    people: useRef(new Animated.Value(1)).current,
    clipboard: useRef(new Animated.Value(1)).current,
    person: useRef(new Animated.Value(1)).current,
    chat: useRef(new Animated.Value(1)).current,
  };

  // Animate the active icon on mount
  useEffect(() => {
    if (active !== "add") {
      Animated.spring(animations[active], {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }).start();
    }
  }, []);

  const handlePress = (key) => {
    if (key === "add") {
      navigation.navigate("FeedbackScreen");
      return;
    }

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
      case "chat":
        navigation.navigate("ChatListScreen");
        break;
      case "people":
        navigation.navigate("ChildrenListScreen");
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
            isActive && [
              styles.activeIconWrapper,
              { backgroundColor: isDark ? "#000000" : "#6F42C1" }
            ],
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
            size={isActive ? 26 : 24}
            color={isActive ? "white" : (isDark ? "#000000" : "#6F42C1")}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: "#ffffff",
          borderTopColor: isDark ? "rgba(0,0,0,0.1)" : "#eee",
          paddingBottom: Math.max(insets.bottom, 10), // Use device's safe area or minimum 10px
          height: 75 + Math.max(insets.bottom, 10), // Adjust total height
        }
      ]}
    >
      {renderIcon("home", "home")}
      {renderIcon("chat", "chatbubble")}
      
      {/* Floating Plus Button */}
      <TouchableOpacity 
        onPress={() => handlePress("add")} 
        activeOpacity={0.8}
        style={styles.floatingButton}
      >
        <View style={styles.plusButton}>
          <Ionicons name="add" size={32} color="white" />
        </View>
      </TouchableOpacity>
      
      {renderIcon("people", "people")}
      {renderIcon("person", "person")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },

  floatingButton: {
    position: "absolute",
    top: -28,
    alignSelf: "center",
    shadowColor: "#6F42C1",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6F42C1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
  },
});