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
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { normalize, wp, hp } from "../utils/responsive";
import DailyReportPopup from "../components/DailyReportPopup";

// Updated Import: Points to your centralized mock data file
import mockDailyReports from "../data/MockDailyReports";

// ──────────────────────────────────────────────────────────────
// Static test credentials
// ──────────────────────────────────────────────────────────────
const TEST_EMAIL = "mrdjebbi@gmail.com";
const TEST_PASSWORD = "26318943";

export default function LoginSc({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [dailyReports, setDailyReports] = useState([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  }, []);

  /**
   * Fetches daily reports. Now correctly uses the imported MockDailyReports.js
   * which contains the 'reportLines' and 'reportParagraph' fields.
   */
  const fetchDailyReports = async (userEmail) => {
    try {
      // In a production app, you would filter these reports by the childIds 
      // associated with the userEmail. For this demo, we return all mock reports.
      return mockDailyReports;
    } catch (error) {
      console.log("Error fetching daily reports:", error);
      return [];
    }
  };

  const handleStaticLogin = async () => {
    const mockUser = {
      id: "static-001",
      email: TEST_EMAIL,
      name: "Mr Djebbi",
      username: "mrdjebbi",
    };

    const mockToken = "static-jwt-token-for-demo";

    await AsyncStorage.setItem("token", mockToken);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));

    // Optional profile sync
    try {
      await api.post("/profile/create", {
        username: mockUser.username,
        name: mockUser.name,
        userEmail: mockUser.email,
        profession: "", DOB: "", titleline: "", about: "", img: "",
      });
    } catch (e) {
      console.log("Static profile creation skipped");
    }

    // Load detailed mock data
    const reports = await fetchDailyReports(mockUser.email);
    setDailyReports(reports);
    
    if (reports && reports.length > 0) {
      setShowReportPopup(true);
    } else {
      navigation.replace("HomeScreen", { user: mockUser });
    }
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    // Static Demo Bypass
    if (email.trim().toLowerCase() === TEST_EMAIL && password === TEST_PASSWORD) {
      setLoading(true);
      setTimeout(() => {
        handleStaticLogin();
        setLoading(false);
      }, 800);
      return;
    }

    // Normal API Flow
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data && response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        const reports = await fetchDailyReports(email);
        setDailyReports(reports);
        
        if (reports && reports.length > 0) {
          setShowReportPopup(true);
        } else {
          navigation.replace("HomeScreen", { user: response.data.user });
        }
      }
    } catch (err) {
      Alert.alert("Login Error", "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = async () => {
    setShowReportPopup(false);
    const userStr = await AsyncStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    navigation.replace("HomeScreen", { user });
  };

  return (
    <LinearGradient
      colors={['#9C77D9', '#B8A0E0', '#E8DFF5', '#FFFFFF', '#FFFFFF']}
      locations={[0, 0.15, 0.25, 0.35, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          <View style={styles.heartContainer}>
            <Text style={styles.heartLeft}>♡</Text>
            <Text style={styles.heartRight}>♡</Text>
          </View>

          <Text style={styles.title}>Welcome Back !</Text>
          <Text style={styles.subtitle}>Welcome back to your Kidora account</Text>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={normalize(20)} color="#6F42C1" style={styles.inputIcon} />
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

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={normalize(20)} color="#6F42C1" style={styles.inputIcon} />
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
                  size={normalize(22)}
                  color="#6F42C1"
                />
              </TouchableOpacity>
            </View>

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

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-google" size={normalize(30)} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={normalize(30)} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-facebook" size={normalize(32)} color="#4267B2" />
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

      {/* Pop-up integration */}
      <DailyReportPopup
        visible={showReportPopup}
        onClose={handleClosePopup}
        childrenReports={dailyReports}
        navigation={navigation}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: hp(5) },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: wp(7.5) },
  heartContainer: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginBottom: hp(2.5) },
  heartLeft: { fontSize: normalize(24), color: "#6F42C1" },
  heartRight: { fontSize: normalize(24), color: "#6F42C1" },
  title: { fontSize: normalize(28), fontWeight: "bold", color: "#1a1a1a", marginBottom: hp(1), textAlign: "center" },
  subtitle: { fontSize: normalize(14), color: "#666", marginBottom: hp(5), textAlign: "center" },
  formContainer: { width: "100%" },
  inputLabel: { fontSize: normalize(14), fontWeight: "600", color: "#1a1a1a", marginBottom: hp(1) },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: "#e0e0e0",
    height: hp(7) 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: "#1a1a1a", fontSize: normalize(16) },
  loginBtn: { 
    backgroundColor: "#6F42C1", 
    paddingVertical: hp(2), 
    borderRadius: 25, 
    alignItems: "center", 
    marginTop: 10,
    shadowColor: "#6F42C1",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: { opacity: 0.7 },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { color: "#999", paddingHorizontal: 10, fontSize: 12 },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 30 },
  socialBtn: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    backgroundColor: "#fff", 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 1, 
    borderColor: "#e0e0e0" 
  },
  signupContainer: { alignItems: "center" },
  signupText: { color: "#666", fontSize: 14 },
  signupLink: { color: "#6F42C1", fontWeight: "600" },
});