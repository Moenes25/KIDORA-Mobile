import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ──────────────────────────────────────────────────────────────
// Static test credentials (for demo/offline APK)
// ──────────────────────────────────────────────────────────────
const TEST_EMAIL = "mrdjebbi@gmail.com";
const TEST_PASSWORD = "26318943";

export default function LoginSc({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set values immediately without animation
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  }, []);

  const handleStaticLogin = async () => {
    // Hard-coded mock user data (adjust as needed)
    const mockUser = {
      id: "static-001",
      email: TEST_EMAIL,
      name: "Mr Djebbi",
      username: "mrdjebbi",
    };

    const mockToken = "static-jwt-token-for-demo-purposes-only";

    await AsyncStorage.setItem("token", mockToken);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));

    // Optionally create a static profile
    try {
      await api.post("/profile/create", {
        username: mockUser.username,
        name: mockUser.name,
        userEmail: mockUser.email,
        profession: "",
        DOB: "",
        titleline: "",
        about: "",
        img: "",
      });
    } catch (e) {
      console.log("Static profile creation skipped (offline mode)");
    }

    navigation.replace("HomeScreen", { user: mockUser });
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    // ────── Static / Demo login bypass ──────
    if (email.trim().toLowerCase() === TEST_EMAIL && password === TEST_PASSWORD) {
      setLoading(true);
      // Simulate small delay for realism
      setTimeout(() => {
        handleStaticLogin();
        setLoading(false);
      }, 800);
      return;
    }

    // ────── Normal API login (for production) ──────
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        const user = response.data.user;

        // Optional profile creation (keep your existing logic)
        try {
          const username = email.split("@")[0];
          await api.post("/profile/create", {
            username,
            name: user.name,
            userEmail: email,
            profession: "",
            DOB: "",
            titleline: "",
            about: "",
            img: "",
          });
        } catch (profileErr) {
          console.log("Profile creation skipped:", profileErr.message);
        }

        navigation.replace("HomeScreen", { user });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Please check your credentials.";

      Alert.alert(
        "Login Error",
        typeof errorMsg === "string" ? errorMsg : "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#9C77D9', '#B8A0E0', '#E8DFF5', '#FFFFFF', '#FFFFFF']}
      locations={[0, 0.15, 0.25, 0.35, 1]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Decorative Hearts */}
          <View style={styles.heartContainer}>
            <Text style={styles.heartLeft}>♡</Text>
            <Text style={styles.heartRight}>♡</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome Back !</Text>
          <Text style={styles.subtitle}>Welcome back to your Kidora account</Text>

          <View style={styles.formContainer}>
            {/* Email Input Label */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6F42C1" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password Input Label */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6F42C1" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={styles.input}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6F42C1"
                />
              </TouchableOpacity>
              {password.length > 0 && (
                <Text style={styles.passwordStrength}>Strong</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginBtnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-google" size={35} color="#DB4437" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={35} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-facebook" size={37} color="#4267B2" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Registerv1")}
              style={styles.signupContainer}
            >
              <Text style={styles.signupText}>
                New to Kidora? <Text style={styles.signupLink}>Sign up for FREE</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },


  heartContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heartLeft: {
    fontSize: 24,
    color: "#6F42C1",
  },
  heartRight: {
    fontSize: 24,
    color: "#6F42C1",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
    color: "#6F42C1",
  },
  input: {
    flex: 1,
    color: "#1a1a1a",
    fontSize: 16,
    paddingVertical: 12,
  },
  passwordStrength: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 8,
  },
  loginBtn: {
    backgroundColor: "#6F42C1",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: "#9C77D9",
    opacity: 0.7,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    color: "#999",
    paddingHorizontal: 15,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signupContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
  signupLink: {
    color: "#6F42C1",
    fontWeight: "600",
  },
});