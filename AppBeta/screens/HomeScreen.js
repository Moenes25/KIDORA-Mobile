import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, Animated } from "react-native";
import SidebarApp from "../components/SideBarApp";
import BottomNavApp from "../components/BottomNavApp";
import LanguageSelector from "../components/LanguageSelector";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Animation for notification hover
  const notifScale = useRef(new Animated.Value(1)).current;

  const animateNotif = (toValue) => {
    Animated.spring(notifScale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <View style={styles.container}>
      <SidebarApp visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Top Bar */}
      <LinearGradient
        colors={["#6F42C1", "#9b59b6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBar}
      >
        <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.logoContainer}>
          <Image
            source={require("../assets/kidora.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.rightSection}>
          {/* Notification Bubble */}
          <Animated.View
            style={[
              styles.notifWrapper,
              { transform: [{ scale: notifScale }] },
            ]}
          >
            <TouchableOpacity
              onPressIn={() => animateNotif(1.1)}
              onPressOut={() => animateNotif(1)}
              activeOpacity={0.8}
            >
              <Feather name="bell" size={22} color="#6F42C1" />
            </TouchableOpacity>
          </Animated.View>

          <LanguageSelector />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Home Page</Text>
      </View>

      <BottomNavApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 70,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 80,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  notifWrapper: {
    backgroundColor: "#e0c3fc",
    width: 36,
    height: 36,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});

import Svg, { Path } from 'react-native-svg';

const WavyHeader = () => {
  const WIDTH = 320;
  const HEIGHT = 100; // Height of the wavy section
  const waveHeight = 20; // Amplitude of the wave

  const d = `M0,0 L0,${HEIGHT - waveHeight} Q${WIDTH / 4},${HEIGHT} ${WIDTH / 2},${HEIGHT - waveHeight} Q${WIDTH * 3 / 4},${HEIGHT - 2 * waveHeight} ${WIDTH},${HEIGHT - waveHeight} L${WIDTH},0 Z`;

  return (
    <Svg width={WIDTH} height={HEIGHT}>
      <Path d={d} fill="#yourColor" />
    </Svg>
  );
};