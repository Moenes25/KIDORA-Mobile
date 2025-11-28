import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Animated, ActivityIndicator } from "react-native";
import api from "../api/api";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animation refs
  const spinnerOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(600)).current; // start offscreen
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
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
        setShowForm(true);
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: -250,
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
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;
      const username = user.email.split("@")[0];

      await api.post(`/profile/create`, {
        username,
        name: user.name,
        profession: "",
        DOB: "",
        titleline: "",
        about: "",
        img: "",
      });

      navigation.navigate("HomeScreen", { user });
    } catch (err) {
      alert("Error: " + err.response?.data?.msg);
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading Spinner */}
      <Animated.View style={[styles.centered, { opacity: spinnerOpacity }]}>
        <ActivityIndicator size="large" color="white" />
      </Animated.View>

      {/* Kidora Logo */}
      <Animated.Image
        source={require("../assets/kidora.png")}
        style={[styles.logo, { opacity: logoOpacity, transform: [{ translateY: logoY }] }]}
        resizeMode="contain"
      />

      {/* Login Card */}
      {showForm && (
        <Animated.View style={[styles.card, { transform: [{ translateY: cardY }] }]}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#6F42C1" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#777"
                onChangeText={setEmail}
                style={{ flex: 1, paddingVertical: 12 }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#6F42C1" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#777"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={{ flex: 1, paddingVertical: 12 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6F42C1"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={onLogin}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Feather name="log-in" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.btntxt}>Login</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#6F42C1", justifyContent: "flex-end", alignItems: "center" },
  centered: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -25 }, { translateY: -25 }] },
  logo: { width: 140, height: 140, position: "absolute", top: "40%" },
  card: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#6F42C1", marginTop: 30, marginBottom: 5 },
  formContainer: { flex: 1, justifyContent: "center" },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, paddingHorizontal: 12, marginVertical: 10, backgroundColor: "#fff" },
  btn: { backgroundColor: "#6F42C1", padding: 15, borderRadius: 10, marginTop: 10 },
  btntxt: { color: "white", textAlign: "center", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15, color: "#6F42C1", fontWeight: "600" },
});
