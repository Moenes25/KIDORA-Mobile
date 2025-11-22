import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import api from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!form.name || !form.firstname || !form.lastname || !form.email || !form.password) {
      return alert("Please fill all fields.");
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      setLoading(false);
      navigation.navigate("Login");
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />
      <TextInput
        placeholder="First Name"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, firstname: v })}
      />
      <TextInput
        placeholder="Last Name"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, lastname: v })}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, email: v })}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btntxt}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: "#ddd",
  },
  btn: {
    backgroundColor: "#6F42C1",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  btntxt: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#6F42C1",
    fontWeight: "600",
  },
});
