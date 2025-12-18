import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { normalize, wp, hp, screenWidth } from "../utils/responsive";

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

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 1500));

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
        <Text style={styles.topLogoText} allowFontScaling={false}>
          <Text style={styles.topKidoraText}>Kidora</Text>
          <Text style={styles.topAiText}>Ai</Text>
        </Text>
        <Text style={styles.topAppText} allowFontScaling={false}> App</Text>
      </View>

      {/* Floating Circle Images - Kid-Friendly Themed */}
      <View style={styles.imagesContainer}>
        {/* Top Left - Playground */}
        <View style={[styles.circleImage, styles.topLeft]}>
          <Image
            source={require("../assets/kid4.jpeg")}
            resizeMode="cover"
            style={styles.image}
          />
        </View>

        {/* Far Top Right - Kids Playing */}
        <View style={[styles.circleImage, styles.farTopRight]}>
          <Image
            source={require("../assets/father image.jpg")}
            resizeMode="cover"
            style={styles.image}
          />
        </View>

        {/* Top Center - Colorful Toys */}
        <View style={[styles.circleImage, styles.topCenter]}>
          <Image
            source={require("../assets/robot image.jpg")}
            resizeMode="cover"
            style={styles.image}
          />
        </View>

        {/* Center Left - Happy Kids Group */}
        <View style={[styles.circleImage, styles.centerLeft]}>
          <Image
            source={require("../assets/mother.jpg")}
            resizeMode="cover"
            style={styles.image}
          />
        </View>

        {/* Center Right Large - Child Playing */}
        <View style={[styles.circleImage, styles.centerRightLarge]}>
          <Image
            source={require("../assets/kid6.jpeg")}
            resizeMode="cover"
            style={styles.image}
          />
        </View>

        {/* Bottom Center - Happy Child (positioned higher to avoid text overlap) */}
        <View style={[styles.circleImage, styles.bottomCenter]}>
          <Image
            source={require("../assets/kid5.jpeg")}
            resizeMode="cover"
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
          <Text style={styles.title} allowFontScaling={false}>
            <Text style={styles.titlePurple}>Safe Play</Text>
          </Text>
          <Text style={styles.title} allowFontScaling={false}>
            for Every Child
          </Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            Track activities, discover play areas,{"\n"}and keep your children safe
          </Text>
        </View>

        {/* Get Started Button with Arrow */}
        <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
          <View style={styles.arrowCircle}>
            <Feather name="arrow-up-right" size={normalize(20)} color="#6F42C1" />
          </View>
          <Text style={styles.getStartedText} allowFontScaling={false}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <TouchableOpacity onPress={handleSignIn} style={styles.signInContainer}>
          <Text style={styles.signInText} allowFontScaling={false}>
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
    width: wp(30),
    height: wp(30),
    marginBottom: hp(3),
  },
  loader: {
    marginTop: hp(2),
  },
  topLogoContainer: {
    position: "absolute",
    top: hp(6),
    left: wp(5),
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topLogoText: {
    fontSize: normalize(20),
    fontWeight: "700",
  },
  topKidoraText: {
    color: "#6F42C1",
  },
  topAiText: {
    color: "#6F42C1",
  },
  topAppText: {
    fontSize: normalize(20),
    fontWeight: "400",
    color: "#1a1a1a",
  },
  imagesContainer: {
    position: "absolute",
    width: screenWidth,
    height: hp(50),
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
  // Responsive image positions using percentages
  topLeft: {
    width: wp(35),
    height: wp(35),
    top: hp(11),
    left: -wp(10),
  },
  farTopRight: {
    width: wp(38),
    height: wp(38),
    top: hp(7),
    right: -wp(12),
  },
  topCenter: {
    width: wp(40),
    height: wp(40),
    top: hp(17),
    left: wp(50) - wp(20),
  },
  centerLeft: {
    width: wp(40),
    height: wp(40),
    top: hp(31),
    left: -wp(5),
  },
  centerRightLarge: {
    width: wp(35),
    height: wp(35),
    top: hp(29),
    right: -wp(7),
  },
  bottomCenter: {
    width: wp(32),
    height: wp(32),
    top: hp(38), // Moved higher to prevent text overlap
    left: wp(50) - wp(16),
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: wp(8),
    paddingBottom: hp(7),
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: hp(4),
    marginTop: hp(20),
  },
  title: {
    fontSize: normalize(32),
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: normalize(40),
  },
  titlePurple: {
    color: "#6F42C1",
  },
  subtitle: {
    fontSize: normalize(13),
    color: "#666",
    textAlign: "center",
    lineHeight: normalize(20),
    marginTop: hp(1.5),
    paddingHorizontal: wp(5),
  },
  getStartedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6F42C1",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    paddingLeft: wp(3),
    borderRadius: 30,
    marginBottom: hp(2),
    width: wp(65),
    maxWidth: 280,
  },
  arrowCircle: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  getStartedText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: wp(8),
  },
  signInContainer: {
    marginTop: hp(1),
  },
  signInText: {
    color: "#666",
    fontSize: normalize(12),
  },
  signInLink: {
    color: "#6F42C1",
    fontWeight: "600",
  },
});