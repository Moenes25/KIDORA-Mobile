import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import api from "../api/api";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // ANIMATION
  const spinnerOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(600)).current;
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Phase 1 → spinner
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(spinnerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Phase 2 → move logo + show card
        setShowForm(true);
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: -230,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(cardY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 500);
  }, []);

  const onLogin = async () => {
    if (!email || !password) return alert("Please fill all fields.");

    try {
      setLoadingLogin(true);

      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;

      // auto-create profile
      await api.post("/profile/create", {
        username: user.email.split("@")[0],
        name: user.name,
        profession: "",
        DOB: "",
        titleline: "",
        about: "",
        img: "",
      });

      setLoadingLogin(false);

      navigation.navigate("Home", { user });
    } catch (err) {
      setLoadingLogin(false);
      alert(err.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Spinner */}
      <Animated.View style={[styles.centered, { opacity: spinnerOpacity }]}>
        <ActivityIndicator size="large" color="white" />
      </Animated.View>

      {/* Logo */}
      <Animated.Image
        source={require("../assets/kidora.png")}
        style={[
          styles.logo,
          { opacity: logoOpacity, transform: [{ translateY: logoY }] },
        ]}
        resizeMode="contain"
      />

      {/* LOGIN CARD */}
      {showForm && (
        <Animated.View style={[styles.card, { transform: [{ translateY: cardY }] }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Text style={styles.title}>Login</Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6F42C1" />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#777"
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6F42C1" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#777"
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.btn} onPress={onLogin}>
              {loadingLogin ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.btnRow}>
                  <Feather name="log-in" size={20} color="white" />
                  <Text style={styles.btntxt}>Login</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Register */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F42C1",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  centered: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  logo: {
    width: 150,
    height: 150,
    position: "absolute",
    top: "38%",
  },
  card: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6F42C1",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
    backgroundColor: "#fff",
    height: 50,
  },
  input: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 10,
  },
  btn: {
    backgroundColor: "#6F42C1",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  btntxt: { color: "white", marginLeft: 8, fontWeight: "bold" },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#6F42C1",
    fontWeight: "600",
  },
});
