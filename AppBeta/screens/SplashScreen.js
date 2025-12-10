import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Wait for animation to complete (at least 1.5 seconds for splash effect)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For now, always show the splash screen (no auth check)
      setIsCheckingAuth(false);
    } catch (error) {
      console.error("Error in splash:", error);
      setIsCheckingAuth(false);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  const handleSignIn = () => {
    navigation.navigate("Login");
  };

  // Show loading indicator while checking auth
  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Image
          source={require("../assets/kidora.png")}
          style={styles.loadingLogo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#6F42C1" style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Logo Text at Top Left */}
      <View style={styles.topLogoContainer}>
        <Text style={styles.topLogoText}>
          <Text style={styles.topKidoraText}>Kidora</Text>
          <Text style={styles.topAiText}>Ai</Text>
        </Text>
        <Text style={styles.topAppText}> App</Text>
      </View>

      {/* Floating Circle Images - Kid-Friendly Themed */}
      <View style={styles.imagesContainer}>
        {/* Top Left - Playground (half visible) */}
        <View style={[styles.circleImage, styles.topLeft]}>
          <Image
            source={require("../assets/kid1.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Far Top Right - Kids Playing (mostly cut off) */}
        <View style={[styles.circleImage, styles.farTopRight]}>
          <Image
            source={require("../assets/kid2.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Top Center - Colorful Toys */}
        <View style={[styles.circleImage, styles.topCenter]}>
          <Image
            source={require("../assets/kid3.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Center Left - Happy Kids Group */}
        <View style={[styles.circleImage, styles.centerLeft]}>
          <Image
            source={require("../assets/kid4.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Center Right Large - Child Playing (main focus) */}
        <View style={[styles.circleImage, styles.centerRightLarge]}>
          <Image
            source={require("../assets/kid5.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        {/* Bottom Center - Happy Child (above text) */}
        <View style={[styles.circleImage, styles.bottomCenter]}>
          <Image
            source={require("../assets/kid6.jpeg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            <Text style={styles.titlePurple}>Safe Play</Text>
          </Text>
          <Text style={styles.title}>for Every Child</Text>
          <Text style={styles.subtitle}>
            Track activities, discover play areas,{"\n"}and keep your children safe
          </Text>
        </View>

        {/* Get Started Button with Arrow */}
        <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
          <View style={styles.arrowCircle}>
            <Feather name="arrow-up-right" size={24} color="#6F42C1" />
          </View>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity onPress={handleSignIn} style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
  topLogoContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topLogoText: {
    fontSize: 24,
    fontWeight: "700",
  },
  topKidoraText: {
    color: "#6F42C1",
  },
  topAiText: {
    color: "#6F42C1",
  },
  topAppText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#1a1a1a",
  },
  imagesContainer: {
    position: "absolute",
    width: width,
    height: height * 0.55,
    top: 0,
  },
  circleImage: {
    position: "absolute",
    borderRadius: 1000,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  // Repositioned images with spacing between them
  topLeft: {
    width: 140,
    height: 140,
    top: 90,
    left: -40,
  },
  farTopRight: {
    width: 150,
    height: 150,
    top: 60,
    right: -50,
  },
  topCenter: {
    width: 130,
    height: 130,
    top: 140,
    left: width / 2 - 65,
  },
  centerLeft: {
    width: 160,
    height: 160,
    top: 260,
    left: 10,
  },
  centerRightLarge: {
    width: 180,
    height: 180,
    top: 240,
    right: -30,
  },
  bottomCenter: {
    width: 130,
    height: 130,
    top: 360,
    left: width / 2 - 65,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 60,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 46,
  },
  titlePurple: {
    color: "#6F42C1",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
  },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6F42C1",
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 12,
    borderRadius: 30,
    marginBottom: 20,
    width: "70%",
    maxWidth: 250,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  arrowText: {
    color: "#6F42C1",
    fontSize: 20,
    fontWeight: "bold",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 32,
  },
  signInContainer: {
    marginTop: 10,
  },
  signInText: {
    color: "#666",
    fontSize: 14,
  },
  signInLink: {
    color: "#6F42C1",
    fontWeight: "600",
  },
});