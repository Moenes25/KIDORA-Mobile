import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import api from "../api/api.js";

export default function Registerv1({ navigation }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", firstname: "", lastname: "" });
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    // Basic validation
    if (!form.email || !form.password || !form.name || !form.firstname || !form.lastname) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", form);  // Capture response
      console.log("Registration success:", response.data);  // Debug log
      
      // Check if registration was successful
      if (response.data && response.data.token) {
        Alert.alert("Success", "Registration complete. Please log in.", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      } else {
        // Unexpected response format
        Alert.alert("Warning", "Registration may have succeeded but response was unexpected.");
      }
    } catch (err) {
      console.log("Registration error:", err.response?.data || err.message);  // Debug log
      
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.msg || 
                       err.response?.data?.error || 
                       "Registration failed. Please try again.";
      
      Alert.alert("Registration Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={form.firstname}
        onChangeText={(v) => setForm({ ...form, firstname: v })}
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={form.lastname}
        onChangeText={(v) => setForm({ ...form, lastname: v })}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={form.password}
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity 
        style={[styles.btn, loading && styles.disabledBtn]} 
        onPress={onRegister} 
        disabled={loading}
      >
        <Text style={styles.btntxt}>
          {loading ? "Creating Account..." : "Create Account"}
        </Text>
        {loading && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#f5f5f5" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8, borderColor: "#ddd" },
  btn: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  disabledBtn: { backgroundColor: "#666" },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
