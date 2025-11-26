import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Wave from "../components/Wave";
import api from "../api/api";



export default function Register({ navigation }) {


  const [form, setForm] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const onRegister = async () => {
    try {
      await api.post("/auth/register", form);
      alert("Account created!");
      navigation.navigate("Login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <View style={styles.container}>
      <Wave />
      <Text style={styles.title}>Create Account</Text>

      <TextInput placeholder="Name" style={styles.input} onChangeText={(v) => setForm({...form, name: v})} />
      <TextInput placeholder="First Name" style={styles.input} onChangeText={(v) => setForm({...form, firstname: v})} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={(v) => setForm({...form, lastname: v})} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={(v) => setForm({...form, email: v})} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={(v) => setForm({...form, password: v})} />

      <TouchableOpacity style={styles.btn} onPress={onRegister}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", overflow: "hidden" },
  title: { textAlign: "center", fontSize: 32, fontWeight: "bold", marginBottom: 20, marginTop: 80 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginVertical: 10 },
  btn: { backgroundColor: "#4b6cb7", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
  loginText: { textAlign: "center", marginTop: 10, color: "#333" }
});
