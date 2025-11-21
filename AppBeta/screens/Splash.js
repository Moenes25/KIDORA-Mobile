import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, ActivityIndicator } from "react-native";

export default function Splash({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in logo after 0.5s
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      delay: 500,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("Login"); 
    }, 2000); // Total splash duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" style={{ marginBottom: 20 }} />
      <Animated.Image 
        source={require("../assets/kidora.png")}
        style={[styles.logo, { opacity: logoOpacity }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F42C1",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
