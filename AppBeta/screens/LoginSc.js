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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
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
    <View style={styles.container}>
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
          {/* Logo */}
          <Image
            source={require("../assets/kidora.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Login to your Kidora account</Text>

          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
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
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.forgotPassword}>
                Forgot Password? <Text style={styles.forgotPasswordLink}>Recover it</Text>
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginBtnText}>Login with Email</Text>
              )}
            </TouchableOpacity>

            {/* Divider & Social Buttons remain unchanged */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={24} color="#1a1a1a" />
              <Text style={styles.socialBtnText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={24} color="#1a1a1a" />
              <Text style={styles.socialBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-facebook" size={24} color="#1a1a1a" />
              <Text style={styles.socialBtnText}>Continue with Facebook</Text>
            </TouchableOpacity>

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
    </View>
  );
}

/* Styles remain exactly the same as your original code */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 40 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1a1a1a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 30 },
  formContainer: { width: "100%", maxWidth: 400 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: { marginRight: 10, color: "#666" },
  input: { flex: 1, color: "#1a1a1a", fontSize: 16, paddingVertical: 12 },
  forgotPassword: { textAlign: "center", color: "#666", fontSize: 14, marginBottom: 20 },
  forgotPasswordLink: { color: "#6F42C1", fontWeight: "600" },
  loginBtn: {
    backgroundColor: "#6F42C1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledBtn: { backgroundColor: "#9C77D9", opacity: 0.7 },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { color: "#666", paddingHorizontal: 15, fontSize: 14 },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialBtnText: { color: "#1a1a1a", fontSize: 16, fontWeight: "500", marginLeft: 10 },
  signupContainer: { marginTop: 20, alignItems: "center" },
  signupText: { color: "#666", fontSize: 14 },
  signupLink: { color: "#6F42C1", fontWeight: "600" },
});